import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/ThemeContext';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.primary.main,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const Logo = styled('img')({
  width: 50,
  marginRight: 10,
  transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
  '&:hover': {
    transform: 'scale(1.1)'
  }
});

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo src="/logoppa.png" alt="PPA Logo" />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            ICT Hub®
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          onClick={toggleTheme} 
          color="inherit"
          sx={{ mr: 2 }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {!isAuthPage && (
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(255, 0, 0, 0.1)' 
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 