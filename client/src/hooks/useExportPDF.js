import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function useExportPDF() {
  const exportPDF = (records) => {
    if (!records || !records.length) {
      alert("No filtered data available to export.");
      return;
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
    totalRow[4] = "Total Hours Spent";
    totalRow[6] = `${totalHoursSpent} hrs`;

    body.push(totalRow);

    const didParseCell = (data) => {
      if (data.row.index === body.length - 1) {
        if (data.column.index === 4 || data.column.index === 6) {
          data.cell.styles.fontStyle = "bold";
        }
      }
    };

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
          { content: "—" },
        ],
        [
          { content: "Position:", styles: { fontStyle: "bold" } },
          { content: "—" },
          { content: "Supervisor:", styles: { fontStyle: "bold" } },
          { content: "—" },
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

    autoTable(doc, {
      startY: currentY,
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
      body,
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

    const pageHeight = doc.internal.pageSize.getHeight();

    let signY = Math.min(
      doc.lastAutoTable.finalY + 25,
      pageHeight - 65
    );

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
