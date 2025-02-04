import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)({
  width: '16%',
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: '16%',
    boxSizing: 'border-box',
  },
});

const Sidebar = ({ isVisible }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
  ];

  if (!isVisible) return null;

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <List>
          <ListItem>
            <Typography variant="h6" align="center">
              Menu
            </Typography>
          </ListItem>
          <Divider />
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar; 