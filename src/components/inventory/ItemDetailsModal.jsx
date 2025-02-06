import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider
} from '@mui/material';
import { updateItem, createLog } from '../../api/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ItemDetailsModal = ({ open, onClose, item, onUpdate }) => {
  const [mode, setMode] = useState('inbound');
  const [formData, setFormData] = useState({
    name: '',
    quantity_new: '',
    quantity_used: '',
    unit: '',
    optimal_threshold: '',
    low_threshold: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        quantity_new: item.quantity_new?.toString() || '',
        quantity_used: item.quantity_used?.toString() || '',
        unit: item.unit || '',
        optimal_threshold: item.thresholds?.medium?.toString() || '',
        low_threshold: item.thresholds?.low?.toString() || ''
      });
    }
  }, [item]);

  const handleNumberChange = (field) => (e) => {
    const value = e.target.value;
    if (mode === 'outbound') {
      const currentQuantity = field === 'quantity_new' ? item.quantity_new : item.quantity_used;
      if (parseInt(value) > currentQuantity) {
        return; // Don't update if trying to remove more than available
      }
    }
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      const newQuantityNew = mode === 'outbound' 
        ? item.quantity_new - (formData.quantity_new === '' ? 0 : parseInt(formData.quantity_new))
        : item.quantity_new + (formData.quantity_new === '' ? 0 : parseInt(formData.quantity_new));

      const newQuantityUsed = mode === 'outbound'
        ? item.quantity_used - (formData.quantity_used === '' ? 0 : parseInt(formData.quantity_used))
        : item.quantity_used + (formData.quantity_used === '' ? 0 : parseInt(formData.quantity_used));

      // First update the item
      const result = await updateItem(item.id, {
        name: formData.name,
        unit: formData.unit,
        quantity_new: newQuantityNew,
        quantity_used: newQuantityUsed,
        category_id: item.category_id,
        type_id: item.type_id,
        optimal_threshold: formData.optimal_threshold,
        low_threshold: formData.low_threshold
      });

      // Log the data being sent to createLog
      const logData = {
        name: item.name,
        category: item.category,
        type: item.type,
        change_type: mode,
        quantity_new: formData.quantity_new === '' ? 0 : parseInt(formData.quantity_new),
        quantity_used: formData.quantity_used === '' ? 0 : parseInt(formData.quantity_used),
        unit: item.unit,
        item_id: item.id
      };

      console.log('Creating log with data:', logData);

      // Then create a log entry
      try {
        const logResult = await createLog(logData);
        console.log('Log creation result:', logResult);
      } catch (error) {
        console.error('Detailed error:', error.response?.data || error.message);
        throw error;
      }

      if (result.success) {
        onUpdate(result.data);
        onClose();
      } else {
        console.error('Failed to update:', result.error);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (!item) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="item-details-modal"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Item Details
        </Typography>
        
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button 
              variant={mode === 'inbound' ? 'contained' : 'outlined'}
              onClick={() => setMode('inbound')}
              fullWidth
            >
              Inbound
            </Button>
            <Button 
              variant={mode === 'outbound' ? 'contained' : 'outlined'}
              onClick={() => setMode('outbound')}
              fullWidth
            >
              Outbound
            </Button>
          </Stack>

          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))}
            fullWidth
          />

          <Typography variant="body1">
            <strong>Category:</strong> {item.category}
          </Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {item.type}
          </Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Current New Quantity"
              value={item.quantity_new}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Current Used Quantity"
              value={item.quantity_used}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label={`${mode === 'inbound' ? 'Add' : 'Remove'} New Items`}
              type="number"
              value={formData.quantity_new}
              onChange={handleNumberChange('quantity_new')}
              inputProps={{ 
                min: 0,
                max: mode === 'outbound' ? item.quantity_new : undefined 
              }}
              disabled={mode === 'outbound' && item.quantity_new === 0}
              error={mode === 'outbound' && parseInt(formData.quantity_new) > item.quantity_new}
              helperText={mode === 'outbound' && parseInt(formData.quantity_new) > item.quantity_new 
                ? "Can't exceed current quantity" 
                : ""}
              fullWidth
            />
            <TextField
              label={`${mode === 'inbound' ? 'Add' : 'Remove'} Used Items`}
              type="number"
              value={formData.quantity_used}
              onChange={handleNumberChange('quantity_used')}
              inputProps={{ 
                min: 0,
                max: mode === 'outbound' ? item.quantity_used : undefined 
              }}
              disabled={mode === 'outbound' && item.quantity_used === 0}
              error={mode === 'outbound' && parseInt(formData.quantity_used) > item.quantity_used}
              helperText={mode === 'outbound' && parseInt(formData.quantity_used) > item.quantity_used 
                ? "Can't exceed current quantity" 
                : ""}
              fullWidth
            />
          </Stack>

          <TextField
            label="Unit"
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              unit: e.target.value
            }))}
            fullWidth
          />

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" component="h3" gutterBottom>
            Threshold Settings
          </Typography>

          <TextField
            label="Optimal Threshold"
            type="number"
            value={formData.optimal_threshold}
            onChange={handleNumberChange('optimal_threshold')}
            inputProps={{ min: 0 }}
            fullWidth
          />
          
          <TextField
            label="Low Threshold"
            type="number"
            value={formData.low_threshold}
            onChange={handleNumberChange('low_threshold')}
            inputProps={{ min: 0 }}
            fullWidth
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ItemDetailsModal; 