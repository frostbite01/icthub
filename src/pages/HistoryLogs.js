import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 15;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/inventory/history');
                
                // Sort logs by date in descending order
                const sortedLogs = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setLogs(sortedLogs);
            } catch (error) {
                console.error('Error fetching history logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Pagination logic
    const lastIndex = currentPage * entriesPerPage;
    const firstIndex = lastIndex - entriesPerPage;
    const currentEntries = logs.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(logs.length / entriesPerPage);

    return (
        <div>
            <h2>Inbound and Outbound History</h2>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Item</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((log) => (
                            <tr key={log.id}>
                                <td>{log.action}</td>
                                <td>{log.itemName}</td>
                                <td>{log.category}</td>
                                <td>{log.type}</td>
                                <td>{log.quantity}</td>
                                <td>{log.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} disabled={currentPage === i + 1}>
                        {i + 1}
                    </button>
                ))}

                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default HistoryLogs;
