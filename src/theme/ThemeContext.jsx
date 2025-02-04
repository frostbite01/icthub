import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#1a1a1a',
            light: mode === 'light' ? '#42a5f5' : '#2d2d2d',
            dark: mode === 'light' ? '#1565c0' : '#171717',
            contrastText: '#ffffff',
          },
          secondary: {
            main: mode === 'light' ? '#dc004e' : '#9e9e9e',
            light: mode === 'light' ? '#ff4081' : '#cfcfcf',
            dark: mode === 'light' ? '#c51162' : '#707070',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          chart: {
            background: mode === 'light' ? '#ffffff' : '#1e1e1e',
            text: mode === 'light' ? '#2f2f2f' : '#e0e0e0',
            grid: mode === 'light' ? '#f0f0f0' : '#333333',
          },
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              root: {
                '& .MuiPaper-root': {
                  backgroundColor: mode === 'light' ? '#1976d2' : '#1a1a1a',
                },
                '& .MuiListItemText-primary': {
                  color: '#ffffff !important',
                },
                '& .MuiListItemIcon-root': {
                  color: '#ffffff !important',
                },
                '& .MuiTypography-root': {
                  color: '#ffffff !important',
                },
                '& .MuiListItemButton-root': {
                  '& *': {
                    color: '#ffffff !important',
                  },
                },
              },
              paper: {
                backgroundColor: mode === 'light' ? '#1976d2' : '#1a1a1a',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                boxShadow: mode === 'light' 
                  ? '0 2px 4px rgba(0,0,0,0.1)' 
                  : '0 2px 4px rgba(0,0,0,0.3)',
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};