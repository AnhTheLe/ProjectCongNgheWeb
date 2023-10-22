import React from 'react';
import Sidebar from '../Sidebar';
import { Topbar } from '../Topbar';
import { Box, Container, Fab, Fade } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { AppConstants } from '../../constants/AppConstants';
interface Props {
  window?: () => Window;
  children: React.ReactElement;
}
function ScrollTop(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    document.documentElement.scrollTop = 0;
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        {children}
      </Box>
    </Fade>
  );
}
export const BaseLayout = (props: Props) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <div className="d-flex flex-column w-100">
        <Topbar />
        <Container sx={{ marginTop: `${AppConstants.sidebarHeight}px` }} maxWidth="xl">
          {props.children}
        </Container>
      </div>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
};
