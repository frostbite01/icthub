import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Tooltip, LinearProgress, Typography } from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const StockLevelIndicator = ({ type, quantity, thresholds }) => {
    const getStockLevel = () => {
        // Calculate percentage based on medium (optimal) stock level
        const percentage = thresholds?.medium 
            ? Math.min((quantity / thresholds.medium) * 100, 100)
            : 0;

        if (quantity === 0) {
            return {
                label: 'Out of Stock',
                color: 'error',
                icon: <WarningIcon />,
                percentage: 0
            };
        }

        if (quantity <= thresholds?.low) {
            return {
                label: 'Low Stock',
                color: 'warning',
                icon: <WarningIcon />,
                percentage: percentage
            };
        }

        if (quantity >= thresholds?.medium) {
            return {
                label: 'Optimal',
                color: 'success',
                icon: <CheckCircleIcon />,
                percentage: 100
            };
        }

        return {
            label: 'In Stock',
            color: 'info',
            icon: <InfoIcon />,
            percentage: percentage
        };
    };

    const stockLevel = getStockLevel();

    // Create a more detailed tooltip message
    const getTooltipMessage = () => {
        if (!thresholds) return `${quantity} units in stock`;
        return `${quantity} units in stock
Optimal: ${thresholds.medium} units
Low Stock: ${thresholds.low} units`;
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
                label={stockLevel.label}
                color={stockLevel.color}
                size="small"
                variant="outlined"
                icon={stockLevel.icon}
            />
            <Tooltip title={getTooltipMessage()}>
                <Box sx={{ minWidth: 100, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={stockLevel.percentage}
                            color={stockLevel.color}
                            sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)' 
                            }}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {Math.round(stockLevel.percentage)}%
                    </Typography>
                </Box>
            </Tooltip>
        </Box>
    );
};

StockLevelIndicator.propTypes = {
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    thresholds: PropTypes.shape({
        low: PropTypes.number,
        medium: PropTypes.number  // Changed from optimal to medium
    })
};

export default StockLevelIndicator; 