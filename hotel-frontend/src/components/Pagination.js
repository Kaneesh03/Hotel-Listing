import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, function(_, index) {
    return index + 1;
  });

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={function() { onPageChange(currentPage - 1); }}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map(function(pageNum) {
        return (
          <button
            key={pageNum}
            className={pageNum === currentPage ? "pagination-btn active" : "pagination-btn"}
            onClick={function() { onPageChange(pageNum); }}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        className="pagination-btn"
        onClick={function() { onPageChange(currentPage + 1); }}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
