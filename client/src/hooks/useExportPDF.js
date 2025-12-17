import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllUsersWithRoles } from "../api/auth";

export default function useExportPDF() {
  const exportPDF = async (records) => {
    if (!records || !records.length) {
      alert("No filtered data available to export.");
      return;
    }

    let department = "—";
    let position = "—";
    let supervisor = "—";

    try {
      const users = await getAllUsersWithRoles();

      const internEmail = records[0]?.Intern;

      const matchedUser = users.find(
        (u) => u.email === internEmail
      );

      if (matchedUser) {
        department = matchedUser.department || "—";
        position = matchedUser.position || "—";
        supervisor = matchedUser.supervisor || "—";
      }
    } catch (err) {
      console.error("Failed to fetch user info for PDF:", err);
    }


    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 330],
    });

    const internEmail = records[0]?.Intern || "";

    const headers = [
      "Date",
      "Time In",
      "Lunch Out",
      "Lunch In",
      "Time Out",
      "Days",
      "HOURS",
      "TOTAL",
    ];

    const body = records.map((r) => [
      r.Date,
      r["Time In"],
      r["Lunch Out"],
      r["Lunch In"],
      r["Time Out"],
      r.DAYS,
      r.HOURS,
      r.TOTAL,
    ]);

    const totalHoursSpent = records
      .reduce((sum, r) => {
        const hours = parseFloat(String(r.TOTAL).replace(" hrs", ""));
        return isNaN(hours) ? sum : sum + hours;
      }, 0)
      .toFixed(2);

    const totalRow = Array(headers.length).fill("");
    totalRow[6] = "Total Hours Spent";
    totalRow[7] = `${totalHoursSpent} hrs`;

    body.push(totalRow);

    const didParseCell = (data) => {
      if (data.row.index === body.length - 1) {
        if (data.column.index === 4 || data.column.index === 6) {
          data.cell.styles.fontStyle = "bold";
        }
      }
    };

    const ROWS_PER_PAGE = 12;
    const dataRows = body.slice(0, body.length - 1);
    const totalOnlyRow = body.slice(body.length - 1);

    const chunkedBodies = [];
    for (let i = 0; i < dataRows.length; i += ROWS_PER_PAGE) {
      chunkedBodies.push(dataRows.slice(i, i + ROWS_PER_PAGE));
    }

    // Append total row to the LAST page only
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
          { content: "Intern Email:", styles: { fontStyle: "bold" } },
          { content: internEmail },
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
      if (index > 0) {
        doc.addPage();
      }

      let startY = index === 0 ? currentY : 20;

      autoTable(doc, {
        startY,
        head: [
          [
            {
              content: `Intern Email: ${internEmail}`,
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
        styles: {
          fontSize: 11,
          cellPadding: 3,
          valign: "middle",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        didParseCell,
        didDrawPage: footer,
      });
    });


    const pageHeight = doc.internal.pageSize.getHeight();
    const marginBottom = 20;
    const signatureBlockHeight = 65;

    // Where the table actually ended
    let signY = doc.lastAutoTable.finalY + 25;

    // Remaining space on the page
    const remainingSpace = pageHeight - signY - marginBottom;

    if (remainingSpace < signatureBlockHeight) {
      doc.addPage();
      signY = 40; // top padding on new page
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text("Prepared by:", 25, signY - 15);
    doc.line(25, signY + 8, 105, signY + 8);

    doc.setFont("helvetica", "bold");
    doc.text("Name", 25, signY + 18);

    doc.setFont("helvetica", "normal");
    doc.text("Role", 25, signY + 26);

    doc.text("Approved by:", 180, signY - 15);
    doc.line(180, signY + 8, 260, signY + 8);

    doc.setFont("helvetica", "bold");
    doc.text("Name", 180, signY + 18);

    doc.setFont("helvetica", "normal");
    doc.text("Role", 180, signY + 26);

    doc.save("timesheet_filtered.pdf");
  };

  return { exportPDF };
}
