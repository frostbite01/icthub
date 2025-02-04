import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSidebarVisible'
})(({ theme, isSidebarVisible }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: isSidebarVisible ? '16%' : 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  minHeight: 'calc(100vh - 64px - 56px)', // Subtract header and footer height
  marginTop: '64px', // Add margin for header height
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: theme.zIndex.drawer + 1, // Make header appear above sidebar
}));

const SidebarWrapper = styled(Box)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    marginTop: '64px', // Add margin for header height
    height: 'calc(100% - 64px)', // Adjust height to account for header
  }
}));

const Layout = ({ children, isSidebarVisible }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <Box sx={{ display: 'flex', flex: 1 }}>
        <SidebarWrapper>
          <Sidebar isVisible={isSidebarVisible} />
        </SidebarWrapper>
        <MainContent isSidebarVisible={isSidebarVisible}>
          {children}
        </MainContent>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 