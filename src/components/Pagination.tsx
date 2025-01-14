import React, { useEffect, useState, useCallback } from "react";
import classNames from "classnames";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
}) => {
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  /**
   * Get filtered visible pages based on the total pages.
   */
  const filterPages = useCallback(
    (pages: number[], total: number) => {
      return pages.filter((page) => page <= total);
    },
    []
  );

  /**
   * Get visible pages for pagination.
   */
  const getVisiblePages = useCallback(
    (page: number, total: number) => {
      if (total < 7) {
        // Generate an array from 1 to total
        return filterPages(Array.from({ length: total }, (_, i) => i + 1), total);
      }
      if (page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      }
      if (page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      }
      return [1, 2, 3, 4, 5, total];
    },
    [filterPages]
  );


  useEffect(() => {
    setVisiblePages(getVisiblePages(currentPage, totalPages));
  }, [currentPage, totalPages, getVisiblePages]);

  /**
   * Handle page change.
   */
  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="d-lg-flex align-items-center text-center pb-1">
      <span className="me-3">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <ul className="pagination pagination-rounded d-inline-flex ms-auto align-item-center mb-0">
        <li
          className={classNames("page-item", "paginate_button", "previous", {
            disabled: currentPage === 1,
          })}
          onClick={() => handleChangePage(currentPage - 1)}
        >
          <button className="page-link">
            <i className="mdi mdi-chevron-left"></i>
          </button>
        </li>
        {visiblePages.map((page, index, array) => (
          <React.Fragment key={page}>
            {index > 0 && array[index - 1] + 1 < page && (
              <li className="page-item disabled d-none d-xl-inline-block">
                <button className="page-link">...</button>
              </li>
            )}
            <li
              className={classNames("page-item", "d-none", "d-xl-inline-block", {
                active: currentPage === page,
              })}
              onClick={() => handleChangePage(page)}
            >
              <button className="page-link">{page}</button>
            </li>
          </React.Fragment>
        ))}
        <li
          className={classNames("page-item", "paginate_button", "next", {
            disabled: currentPage === totalPages,
          })}
          onClick={() => handleChangePage(currentPage + 1)}
        >
          <button className="page-link">
            <i className="mdi mdi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
