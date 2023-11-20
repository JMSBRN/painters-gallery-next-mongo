import { Pagination } from '@mui/material';
import React from 'react';

interface PaginationArtChicagoProps {
  totalPages: number;
  currentPage: number;
  handleChangePage: (e: React.ChangeEvent<unknown>, page: number) => void;
}
const PaginationArtChicago = ({
  totalPages,
  currentPage,
  handleChangePage,
}: PaginationArtChicagoProps) => {
  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handleChangePage}
      siblingCount={5}
      boundaryCount={5}
    />
  );
};

export default PaginationArtChicago;
