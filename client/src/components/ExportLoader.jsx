import "../styles/ExportLoader.css";

function ExportLoader() {
  return (
    <div className="export-loader">
      <div className="export-loader-content">
        <div className="export-spinner"></div>
        <p className="export-loader-text">Generating Attendance Report...</p>
      </div>
    </div>
  );
}

export default ExportLoader;
