// src/pages/AuthForm.js
import React, { useState } from 'react';
import './authForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className={`form-container ${isLogin ? 'slide-left' : 'slide-right'}`}>
        {isLogin ? (
          <div className="login-form">
            <h1>Login</h1>
            {/* Login form fields go here */}
            <button onClick={toggleForm}>Switch to Register</button>
          </div>
        ) : (
          <div className="register-form">
            <h1>Register</h1>
            {/* Register form fields go here */}
            <button onClick={toggleForm}>Switch to Login</button>
          </div>
        )}
      </div>
      <div className="login-image">
        {/* Your image goes here */}
        <img src="path_to_your_image.jpg" alt="Auth" />
      </div>
    </div>
  );
};

export default AuthForm;
