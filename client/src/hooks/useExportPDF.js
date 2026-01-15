import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getAllUsersWithRoles, getTimesheetMeta } from "../api/auth";
import { getUserOjtHours } from "../api/ojtHours";

export default function useExportPDF() {
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);

  const sanitizeUsername = (username) =>
    username.replace(/[@.]/g, "_");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsersWithRoles();
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setUsersLoaded(true);
      }
    };

    fetchUsers();
  }, []);

  const generatePDFForUser = async (userRecords, internUsername) => {
    const matchedUser = allUsers.find((u) => u.username === internUsername);

    const department = matchedUser?.department ?? "—";
    const position = matchedUser?.position ?? "—";
    const supervisor = matchedUser?.supervisor ?? "—";

    let remainingHours = 0;
    if (matchedUser?.id) {
      try {
        const ojtData = await getUserOjtHours(matchedUser.id);
        remainingHours = ojtData.remainingWorkHours ?? 0;
      } catch (err) {
        console.error("Failed to fetch remaining work hours", err);
      }
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 330],
    });

    const headers = [
      "Date",
      "Time In",
      "Lunch Out",
      "Lunch In",
      "Time Out",
      "Days",
      "TOTAL",
      "ACTUAL",
    ];

    const body = userRecords.map((r) => [
      r.Date,
      r["Time In"],
      r["Lunch Out"],
      r["Lunch In"],
      r["Time Out"],
      r.DAYS,
      r.TOTAL,
      r.ACTUAL,
    ]);

    const totalHoursSpent = userRecords.reduce((sum, r) => {
      const hours = typeof r.ACTUAL === "string" ? parseFloat(r.ACTUAL.replace(" hrs", "")) : Number(r.ACTUAL);
      return isNaN(hours) ? sum : sum + hours;
    }, 0).toFixed(2);

    const totalRow = Array(headers.length).fill("");
    totalRow[6] = "Total Hours Spent";
    totalRow[7] = `${totalHoursSpent} hrs`;

    const remainingRow = Array(headers.length).fill("");
    remainingRow[6] = "Remaining Work Hours";
    remainingRow[7] = `${remainingHours} hrs`;

    body.push(totalRow, remainingRow);

    const didParseCell = (data) => {
      if (data.row.index >= body.length - 2 && (data.column.index === 6 || data.column.index === 7)) {
        data.cell.styles.fontStyle = "bold";
      }
    };

    const ROWS_PER_PAGE = 12;
    const dataRows = body.slice(0, body.length - 2);
    const totalOnlyRow = body.slice(body.length - 2);

    const chunkedBodies = [];
    for (let i = 0; i < dataRows.length; i += ROWS_PER_PAGE) {
      chunkedBodies.push(dataRows.slice(i, i + ROWS_PER_PAGE));
    }

    chunkedBodies[chunkedBodies.length - 1].push(...totalOnlyRow);

    const footer = () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(
        "IT Squarehub Global Services Corp.",
        pageWidth / 2,
        pageHeight - 18,
        { align: "center" }
      );

      doc.setFont("helvetica", "normal");
      doc.text(
        "Unit 5, Clark Center 09, Berthaphil III, Jose Abad Santos Ave., Clark Freeport Zone, Central Luzon, Philippines",
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" }
      );
    };

    autoTable(doc, {
      startY: 10,
      theme: "grid",
      tableWidth: 270,
      body: [
        [
          { content: "Intern:", styles: { fontStyle: "bold" } },
          { content: internUsername },
          { content: "Department:", styles: { fontStyle: "bold" } },
          { content: department },
        ],
        [
          { content: "Position:", styles: { fontStyle: "bold" } },
          { content: position },
          { content: "Supervisor:", styles: { fontStyle: "bold" } },
          { content: supervisor },
        ],
      ],
      styles: { textColor: 0, fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 90 },
        2: { cellWidth: 45 },
        3: { cellWidth: 90 },
      },
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Daily Time Records", doc.internal.pageSize.getWidth() / 2, currentY, {
      align: "center",
    });

    currentY += 8;

    chunkedBodies.forEach((pageBody, index) => {
      if (index > 0) doc.addPage();

      autoTable(doc, {
        startY: index === 0 ? currentY : 20,
        head: [
          [
            {
              content: `Username: ${internUsername}`,
              colSpan: headers.length,
              styles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: "bold",
                halign: "left",
              },
            },
          ],
          headers,
        ],
        body: pageBody,
        styles: { fontSize: 11, cellPadding: 3 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
        },
        didParseCell,
        didDrawPage: footer,
      });
    });

    let preparedByName = "—";
    let preparedByPosition = "—";
    let approvedByName = "—";
    let approvedByPosition = "—";

    try {
      if (!matchedUser?.id) throw new Error("Intern ID missing");

      const meta = await getTimesheetMeta(matchedUser.id);

      preparedByName = meta.preparedBy?.username ?? "—";
      preparedByPosition = meta.preparedBy?.position ?? "—";

      approvedByName = meta.approvedBy?.username ?? "—";
      approvedByPosition = meta.approvedBy?.position ?? "—";
    } catch (err) {
      console.error("Failed to load timesheet metadata", err);
    }

    const signY = doc.lastAutoTable.finalY + 35;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Prepared by:", 25, signY - 15);
    doc.line(25, signY + 8, 105, signY + 8);

    doc.setFont("helvetica", "bold");
    doc.text(preparedByName, 25, signY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(preparedByPosition, 25, signY + 26);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Approved by:", 180, signY - 15);
    doc.line(180, signY + 8, 260, signY + 8);

    doc.setFont("helvetica", "bold");
    doc.text(approvedByName, 180, signY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(approvedByPosition, 180, signY + 26);

    return doc;
  };

  const exportPDF = async (records) => {
    if (!records || !records.length) {
      alert("No filtered data available to export.");
      return;
    }

    if (!usersLoaded) {
      alert("Users are still loading. Please try again.");
      return;
    }

    // Group records by username
    const recordsByUser = records.reduce((acc, record) => {
      const username = record.Intern;
      if (!acc[username]) acc[username] = [];
      acc[username].push(record);
      return acc;
    }, {});


    const usernames = Object.keys(recordsByUser);

    // Single user
    if (usernames.length === 1) {
      const username = usernames[0];
      const doc = await generatePDFForUser(
        recordsByUser[username],
        username
      );

      const sanitized = sanitizeUsername(username);
      doc.save(`DTR_${sanitized}.pdf`);
      return;
    }

    // Multiple users → ZIP
    try {
      const zip = new JSZip();

      for (const username of usernames) {
        const doc = await generatePDFForUser(
          recordsByUser[username],
          username
        );

        const pdfBlob = doc.output("blob");
        const sanitized = sanitizeUsername(username);

        zip.file(`DTR_${sanitized}.pdf`, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "DTR_Export.zip");
    } catch (err) {
      console.error("Failed to generate ZIP file", err);
      alert("Failed to export multiple PDFs. Please try again.");
    }
  };

  return { exportPDF };
}