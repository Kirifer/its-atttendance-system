import "../styles/Pagination.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination_btn"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <span className="pagination_info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="pagination_btn"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

