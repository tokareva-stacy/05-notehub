import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected + 1);
  };
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={css.paginationWrapper}>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={currentPage - 1} 
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={css.pagination}
        pageLinkClassName={css.pageLink}
        activeLinkClassName={css.active}
        previousLinkClassName={css.previousLink}
        nextLinkClassName={css.nextLink}
        breakLinkClassName={css.breakLink}
        disabledClassName={css.disabled}
      />
    </div>
  );
};

export default Pagination;