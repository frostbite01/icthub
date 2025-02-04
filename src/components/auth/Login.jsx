import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, styled, keyframes } from '@mui/material';

const zoomInOut = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
`;

const LoginPage = styled(Box)(({ theme }) => ({
  width: '60%',
  margin: '10% auto',
  display: 'flex',
  height: '50vh',
  backgroundColor: '#f0f0f0',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '2px solid #ffffff',
  boxShadow: '0 4px 20px rgba(97, 97, 97, 0.5)',
}));

const LoginImage = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#e0e0e0',
  boxShadow: '0 4px 20px rgba(255, 0, 0, 0.1)',
  '& img': {
    width: '110%',
    height: '100%',
    objectFit: 'cover',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    animation: `${zoomInOut} 30s infinite ease-in-out`,
  },
});

const LogoImage = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  '& img': {
    width: '50%',
    height: 'auto',
  },
});

const LoginForm = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '30px',
  boxShadow: '0 4px 20px rgba(255, 4, 4, 0.1)',
  borderTopRightRadius: '20px',
  borderBottomRightRadius: '20px',
  zIndex: 2,
  '& h1': {
    marginBottom: '20px',
    color: '#000000',
  },
  '& form': {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '300px',
    gap: '15px',
  },
  '& input': {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border 0.3s',
    '&:focus': {
      borderColor: '#ff0000',
      outline: 'none',
    },
  },
  '& button': {
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ff0000',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#000000',
    },
  },
  '& p': {
    marginTop: '10px',
    color: 'red',
  },
});

const Login = () => {
  const location = useLocation();
  const noSidebar = location.pathname === '/login';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <LoginPage className={noSidebar ? 'no-sidebar' : ''}>
      <LoginImage>
        <img src="loginbackground.jpg" alt="Preview" />
      </LoginImage>
      <LoginForm>
        <LogoImage>
          <img src="logoppa.png" alt="logoppa" />
        </LogoImage>
        <h1>PPA ICT Hub Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </LoginForm>
    </LoginPage>
  );
};

export default Login; 