import { makeStyles } from '@mui/styles';
// eslint-disable-next-line import/named
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      fontSize: '14px',
    },
    perPageSelect: {
      width: '74px',
      height: '30px',
      margin: '0 8px',
    },
  };
});
export default useStyles;
