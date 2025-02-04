import React, { useEffect, useState } from 'react';
import { logTransaction, updateInventoryUnit } from '../api/api';
import './transaction.css';

const LogModal = ({ isOpen, onClose, currentItem, onSave }) => {
    const [logData, setLogData] = useState({
        id: '',
        name: '',
        category: '',
        type: '',
        quantity_new: 0,
        quantity_used: 0,
        unit: '',
        description: '',
        transactionType: 'Barang Masuk',
        quantityAdjustNew: 0,
        quantityAdjustUsed: 0,
    });

    useEffect(() => {
        if (currentItem) {
            setLogData({
                ...currentItem,
                description: '',
                transactionType: 'Barang Masuk',
                quantityAdjustNew: 0,
                quantityAdjustUsed: 0,
            });
        }
    }, [currentItem]);

    const handleAdjustmentChange = (type, operation) => {
        setLogData((prevData) => ({
            ...prevData,
            [type]: operation === 'increase' ? prevData[type] + 1 : Math.max(0, prevData[type] - 1),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let finalQuantityNew = logData.quantity_new;
        let finalQuantityUsed = logData.quantity_used;

        if (logData.transactionType === 'Barang Masuk') {
            finalQuantityNew += logData.quantityAdjustNew;
            finalQuantityUsed += logData.quantityAdjustUsed;
        } else {
            finalQuantityNew -= logData.quantityAdjustNew;
            finalQuantityUsed -= logData.quantityAdjustUsed;
        }

        try {
            await updateInventoryUnit(logData.id, {
                quantity_new: finalQuantityNew,
                quantity_used: finalQuantityUsed,
            });

            await logTransaction({
                id: logData.id,
                name: logData.name,
                category: logData.category,
                type: logData.type,
                change_type: logData.transactionType,
                quantity_new: logData.quantityAdjustNew,
                quantity_used: logData.quantityAdjustUsed,
                unit: logData.unit,
                description: logData.description,
            });


            onClose();
        } catch (error) {
            console.error('Error during logging transaction:', error);
            alert('Error saving the transaction. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="transaction-modal-overlay">
            <div className="transaction-modal-content">
                <h2>Item Transaction Log</h2>
                <div className="transaction-toggle">
                    <button
                        className={logData.transactionType === 'Barang Masuk' ? 'active' : ''}
                        onClick={() => setLogData({ ...logData, transactionType: 'Barang Masuk', quantityAdjustNew: 0, quantityAdjustUsed: 0 })}
                    >
                        Barang Masuk
                    </button>
                    <button
                        className={logData.transactionType === 'Barang Keluar' ? 'active' : ''}
                        onClick={() => setLogData({ ...logData, transactionType: 'Barang Keluar', quantityAdjustNew: 0, quantityAdjustUsed: 0 })}
                    >
                        Barang Keluar
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="transaction-form-group">
                        <label>ID:</label>
                        <p>{logData.id}</p>
                    </div>
                    <div className="transaction-form-group">
                        <label>Name:</label>
                        <p>{logData.name}</p>
                    </div>
                    <div className="transaction-form-group">
                        <label>Category:</label>
                        <p>{logData.category}</p>
                    </div>
                    <div className="transaction-form-group">
                        <label>Type:</label>
                        <p>{logData.type}</p>
                    </div>
                    <div className="transaction-form-group">
                        <label>Quantity New (A):</label>
                        <div>
                            <span>{logData.quantity_new}</span>
                            <button type="button" onClick={() => handleAdjustmentChange('quantityAdjustNew', 'decrease')}>-</button>
                            <span>{logData.quantityAdjustNew}</span>
                            <button type="button" onClick={() => handleAdjustmentChange('quantityAdjustNew', 'increase')}>+</button>
                        </div>
                    </div>
                    <div className="transaction-form-group">
                        <label>Quantity Used (A):</label>
                        <div>
                            <span>{logData.quantity_used}</span>
                            <button type="button" onClick={() => handleAdjustmentChange('quantityAdjustUsed', 'decrease')}>-</button>
                            <span>{logData.quantityAdjustUsed}</span>
                            <button type="button" onClick={() => handleAdjustmentChange('quantityAdjustUsed', 'increase')}>+</button>
                        </div>
                    </div>
                    <div className="transaction-form-group">
                        <label>Unit:</label>
                        <p>{logData.unit}</p>
                    </div>
                    <div className="transaction-form-group">
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={logData.description}
                            onChange={(e) => setLogData({ ...logData, description: e.target.value })}
                            placeholder="Add any notes or description"
                        />
                    </div>
                    <button type="submit">Save Log</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default LogModal;
