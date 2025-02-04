import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import ItemDetailsModal from './ItemDetailsModal';
import StockLevelIndicator from './StockLevelIndicator';

const InventoryTable = ({ data, onDataUpdate }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const validData = Array.isArray(data) ? data : [];

    const handleRowClick = (item) => {
        setSelectedItem(item);
    };

    const handleModalClose = () => {
        setSelectedItem(null);
    };

    const handleThresholdUpdate = (updatedItem) => {
        onDataUpdate && onDataUpdate(updatedItem);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="inventory table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">New</TableCell>
                            <TableCell align="right">Used</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Stock Level</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {validData.map((item) => (
                            <TableRow
                                key={item.id}
                                onClick={() => handleRowClick(item)}
                                sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {item.name}
                                </TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell align="right">{item.quantity_new}</TableCell>
                                <TableCell align="right">{item.quantity_used}</TableCell>
                                <TableCell align="right">{item.total_quantity}</TableCell>
                                <TableCell align="right">
                                    <StockLevelIndicator
                                        type={item.type}
                                        quantity={item.total_quantity}
                                        thresholds={item.thresholds}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ItemDetailsModal
                open={Boolean(selectedItem)}
                onClose={handleModalClose}
                item={selectedItem}
                onUpdate={handleThresholdUpdate}
            />
        </>
    );
};

// Add prop types validation
InventoryTable.propTypes = {
    data: PropTypes.array,
    onDataUpdate: PropTypes.func
};

// Add default props
InventoryTable.defaultProps = {
    data: [],
    onDataUpdate: () => {}
};

export default InventoryTable; 