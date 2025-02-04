import React, { useState, useEffect } from 'react';
import './history.css';
import { fetchLogs } from '../api/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom


function History() {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate(); // Initialize navigate


    useEffect(() => {
        const getLogs = async () => {
            try {
                const data = await fetchLogs();
                const sortedLogs = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setLogs(sortedLogs);
            } catch (error) {
                console.error('Failed to fetch logs', error);
            }
        };
        getLogs();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="history">
          <button onClick={() => navigate('../inandout')} className="back-button">
            <img src="/arrow.png" alt="Back" className="arrow-icon" />
            Back to inventory
          </button>
          <h1>Inventory Log History</h1>
          <p>View past inventory transactions below.</p>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Change Type</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Quantity New</th>
                            <th>Quantity Used</th>
                            <th>Unit</th>
                            <th>IP Address</th>
                            <th>MAC Address</th>
                            <th>Serial Number</th>
                            <th>Manpower</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.change_type}</td>
                                <td>{log.name || "N/A"}</td>
                                <td>{log.category || "N/A"}</td>
                                <td>{log.type || "N/A"}</td>
                                <td>{log.quantity_new || "0"}</td>
                                <td>{log.quantity_used || "0"}</td>
                                <td>{log.unit || "N/A"}</td>
                                <td>{log.ip_address || "N/A"}</td>
                                <td>{log.mac_address || "N/A"}</td>
                                <td>{log.serial_number || "N/A"}</td>
                                <td>{log.manpower || "N/A"}</td>
                                <td>{log.notes || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(prev => prev - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button 
                    onClick={() => setCurrentPage(prev => prev + 1)} 
                    disabled={indexOfLastItem >= logs.length || logs.length === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default History;
