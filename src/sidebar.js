import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css'; // Import CSS for styling

function Sidebar({ isVisible }) {
    const location = useLocation();
    const hideSidebar = location.pathname === '/login';

    if (hideSidebar) return null;

    return (
        <aside className={`sidebar ${isVisible ? '' : 'hidden'}`}>
            <h2>
                <Link to="/inandout" className="navigation-link">Inventory and History</Link>
            </h2>
            {/* <h2>
                <Link to="/" className="navigation-link">Ticketing</Link>
            </h2> */}
            <ul>
                {/* Additional Links can go here */}
            </ul>
        </aside>
    );
}

export default Sidebar;
