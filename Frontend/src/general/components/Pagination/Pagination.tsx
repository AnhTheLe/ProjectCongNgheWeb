// eslint-disable-next-line import/named
import { Box, MenuItem, PaginationProps, Select, SelectChangeEvent, Pagination } from '@mui/material';
import { useCallback } from 'react';
import PerPageItems from 'src/utils/Pagination';
import useStyles from './Pagination.style';

interface Props extends PaginationProps {
  totalCount: number;
  perPage: number;
  currentPage: number;
  onChangePerPage?(value: number): void;
  onChangePage?: (page: number) => void;
}

export function LuxtechPagination(props: Props) {
  const { totalCount, perPage, onChangePerPage, currentPage, onChangePage } = props;
  const totalPages = Math.ceil(totalCount / perPage);
  const classes = useStyles();
  const handleChangePerPage = useCallback(
    (event: SelectChangeEvent) => {
      onChangePerPage?.(Number(event.target.value as string));
    },
    [onChangePerPage]
  );

  const handleOnChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    onChangePage?.(page);
  };

  const firstItem = currentPage === 1 ? 1 : currentPage && (currentPage - 1) * perPage;
  const lastItem = currentPage === totalPages ? totalCount : currentPage && perPage * currentPage;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box marginRight={'16px'}>
        <span>Hiển thị </span>
        <Select
          className={classes.perPageSelect}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={perPage.toString()}
          onChange={handleChangePerPage}
        >
          {PerPageItems.perPageItems.map((item) => {
            return (
              <MenuItem value={item.value} key={item.value}>
                {item.value}
              </MenuItem>
            );
          })}
        </Select>
        <span>kết quả </span>
      </Box>
      <Box>
        Từ {firstItem} - {lastItem} trên tổng {totalCount}
      </Box>
      <Pagination count={totalPages} size="medium" color="primary" page={currentPage} onChange={handleOnChangePage} />
    </Box>
  );
}
