import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, loading }) => {
  console.log(`StatCard - ${title}:`, { value, loading }); // Debug log
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={60} height={32} />
            ) : (
              <Typography variant="h4" component="div">
                {value || 0}
              </Typography>
            )}
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const InventoryCards = ({ statistics = {}, loading }) => {
  console.log('InventoryCards props:', { statistics, loading }); // Debug log

  // Ensure statistics has default values
  const {
    totalItems = 0,
    lowStock = 0,
    outOfStock = 0
  } = statistics;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={<InventoryIcon fontSize="large" />}
          color="primary.main"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
          title="Low Stock Items"
          value={lowStock}
          icon={<WarningIcon fontSize="large" />}
          color="warning.main"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          icon={<RemoveCircleIcon fontSize="large" />}
          color="error.main"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default InventoryCards; 