import React from 'react';
import './alert.css'; // Assuming you have styles for the alert

const Alert = ({ message, type, visible, onClose }) => {
    if (!visible) return null; // Don't render anything if not visible

    return (
        <div className={`alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default Alert;
