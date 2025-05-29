import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function Layout() {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;