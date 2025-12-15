import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function useExportPDF() {
  const exportPDF = (records) => {
    if (!records || !records.length) {
      alert("No filtered data available to export.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    const internEmail = records[0]?.Intern || "";

    //  CONTENT 1: HEADER DETAILS

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
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
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

    currentY += 5;

    const headers = [
      "Date",
      "Time In",
      "Time Out",
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
      r["Time Out"],
      r["Lunch Out"],
      r["Lunch In"],
      r["Time Out"],
      r.DAYS,
      r.HOURS,
      r.TOTAL,
    ]);

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

      columnStyles: {
        6: { halign: "left" },
        7: { halign: "left" },
        8: { halign: "left" },
      },

      tableWidth: "auto",
    });


    doc.save("timesheet_filtered.pdf");
  };

  return { exportPDF };
}
