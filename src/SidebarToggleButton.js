import React from 'react';
import { useLocation } from 'react-router-dom';
import './sidebarToggleButton.css';

const SidebarToggleButton = ({ isVisible, onClick }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login';

  if (hideSidebar) {
    return null; // Don't render the button on the login page
  }

  return (
    <button 
      className={`sidebar-toggle-button ${isVisible ? '' : 'closed'}`}
      onClick={onClick}
    >
      {isVisible ? '<' : '>'}
    </button>
  );
};

export default SidebarToggleButton;