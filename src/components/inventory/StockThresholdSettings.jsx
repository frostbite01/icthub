import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
  LinearProgress,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const StockThresholdSettings = ({ onSaveThresholds, initialThresholds, availableCategories, currentStock }) => {
  const [thresholds, setThresholds] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notifications, setNotifications] = useState({
    email: false,
    dashboard: true,
  });
  const [autoReorder, setAutoReorder] = useState({
    enabled: false,
    quantity: 0,
  });

  useEffect(() => {
    if (initialThresholds) {
      setThresholds(initialThresholds);
    }
  }, [initialThresholds]);

  const handleThresholdChange = (category, type, value) => {
    setThresholds(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories?.[category],
          [type]: parseInt(value) || 0
        }
      }
    }));
  };

  const getStockStatus = (category) => {
    const categoryStock = currentStock?.[category] || 0;
    const categoryThresholds = thresholds.categories?.[category];
    
    if (!categoryThresholds) return null;

    const { optimal, low } = categoryThresholds;
    const percentage = (categoryStock / optimal) * 100;

    if (categoryStock >= optimal) {
      return {
        status: 'optimal',
        color: 'success',
        icon: <CheckCircleIcon />,
        message: 'Stock levels are optimal',
        percentage,
      };
    } else if (categoryStock > low) {
      return {
        status: 'moderate',
        color: 'warning',
        icon: <InfoIcon />,
        message: 'Stock levels are moderate',
        percentage,
      };
    } else {
      return {
        status: 'low',
        color: 'error',
        icon: <WarningIcon />,
        message: 'Stock levels are low',
        percentage,
      };
    }
  };

  const getStockTrend = (category) => {
    // This would ideally use historical data
    // For now, we'll simulate a trend
    const random = Math.random();
    return random > 0.5 ? 'up' : 'down';
  };

  const handleNotificationChange = (type) => (event) => {
    setNotifications(prev => ({
      ...prev,
      [type]: event.target.checked
    }));
  };

  const handleAutoReorderChange = (field) => (event) => {
    setAutoReorder(prev => ({
      ...prev,
      [field]: field === 'enabled' ? event.target.checked : parseInt(event.target.value) || 0
    }));
  };

  const handleSave = () => {
    onSaveThresholds({
      ...thresholds,
      notifications,
      autoReorder,
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Stock Threshold Settings
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Select Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Select Category"
            >
              {availableCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedCategory && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Status
                </Typography>
                
                {/* Stock Level Indicator */}
                {getStockStatus(selectedCategory) && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={getStockStatus(selectedCategory).icon}
                        label={getStockStatus(selectedCategory).message}
                        color={getStockStatus(selectedCategory).color}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Stock level trend">
                        <Chip
                          icon={getStockTrend(selectedCategory) === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          label={`Trend: ${getStockTrend(selectedCategory) === 'up' ? 'Increasing' : 'Decreasing'}`}
                          color={getStockTrend(selectedCategory) === 'up' ? 'success' : 'error'}
                        />
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(getStockStatus(selectedCategory).percentage, 100)}
                          color={getStockStatus(selectedCategory).color}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(getStockStatus(selectedCategory).percentage)}%
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Threshold Settings */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Optimal Stock Level"
                      type="number"
                      value={thresholds.categories?.[selectedCategory]?.optimal || ''}
                      onChange={(e) => handleThresholdChange(selectedCategory, 'optimal', e.target.value)}
                      helperText="Target stock level for optimal operations"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Low Stock Level"
                      type="number"
                      value={thresholds.categories?.[selectedCategory]?.low || ''}
                      onChange={(e) => handleThresholdChange(selectedCategory, 'low', e.target.value)}
                      helperText="Minimum stock level before alerts"
                    />
                  </Grid>
                </Grid>

                {/* Status Alerts */}
                <Box sx={{ mt: 2 }}>
                  {getStockStatus(selectedCategory)?.status === 'low' && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      Stock levels are critically low. Consider restocking soon.
                    </Alert>
                  )}
                  {getStockStatus(selectedCategory)?.status === 'moderate' && (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      Stock levels are below optimal but above critical threshold.
                    </Alert>
                  )}
                  {getStockStatus(selectedCategory)?.status === 'optimal' && (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      Stock levels are at optimal levels.
                    </Alert>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* New notification settings */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Notification Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={handleNotificationChange('email')}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.dashboard}
                    onChange={handleNotificationChange('dashboard')}
                  />
                }
                label="Dashboard Alerts"
              />
            </Grid>

            {/* Auto-reorder settings */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Auto-Reorder Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoReorder.enabled}
                    onChange={handleAutoReorderChange('enabled')}
                  />
                }
                label="Enable Auto-Reorder"
              />
              {autoReorder.enabled && (
                <TextField
                  sx={{ ml: 2 }}
                  label="Reorder Quantity"
                  type="number"
                  value={autoReorder.quantity}
                  onChange={handleAutoReorderChange('quantity')}
                />
              )}
            </Grid>

            {/* Threshold status indicators */}
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
              >
                Current stock levels will trigger alerts when they fall below {thresholds.categories?.[selectedCategory]?.low || 0} units
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!selectedCategory}
                >
                  Save Thresholds
                </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default StockThresholdSettings; 