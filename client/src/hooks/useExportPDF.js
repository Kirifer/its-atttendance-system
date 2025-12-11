import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function useExportPDF() {
  const exportPDF = (records) => {
    if (!records || !records.length) {
      alert("No filtered data available to export.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    const columnsToInclude = Object.keys(records[0]).filter(
      (col) =>
        ![
          "rawDate",
          "rawTimeIn",
          "rawTimeOut",
          "rawLunchOut",
          "rawLunchIn",
          "id",
          "Lunch Tardy",
          "Tardiness",
        ].includes(col)
    );

    const tableBody = records.map((record) =>
      columnsToInclude.map((col) => record[col])
    );

    const columnStyles = {};
    columnsToInclude.forEach((col, idx) => {
      if (col === "HOURS" || col === "TOTAL") {
        columnStyles[idx] = { halign: "right" };
      } else {
        columnStyles[idx] = { halign: "left" };
      }
    });

    autoTable(doc, {
      head: [columnsToInclude],
      body: tableBody,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: "linebreak", 
      },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { valign: "middle" },
      columnStyles,
      tableWidth: "auto",
    });

    doc.setFontSize(14);
    doc.text("Timesheet Report (Filtered)", 14, 15);

    doc.save("timesheet_filtered.pdf");
  };

  return { exportPDF };
}
