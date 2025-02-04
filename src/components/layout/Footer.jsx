import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
  color: theme.palette.primary.main,
  padding: theme.spacing(2),
  textAlign: 'center',
  position: 'relative',
  bottom: 0,
  width: '100%',
  borderTop: '2px solid #ccc',
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1200,
  '& p': {
    margin: 0,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.dark
    }
  }
}));

const Footer = () => {
  return (
    <StyledFooter component="footer">
      <Typography>
        © {new Date().getFullYear()} ICT Hub, PPA. All rights reserved.
      </Typography>
    </StyledFooter>
  );
};

export default Footer; 