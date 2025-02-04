import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  CircularProgress,
} from '@mui/material';
import { fetchInventory } from '../../api/api';
import ReactECharts from 'echarts-for-react';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchInventory();
        setData(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Calculate metrics
  const totalNew = data.reduce((sum, item) => sum + (parseInt(item.quantity_new) || 0), 0);
  const totalUsed = data.reduce((sum, item) => sum + (parseInt(item.quantity_used) || 0), 0);
  const totalItems = totalNew + totalUsed;
  const categories = [...new Set(data.map(item => item.category))];
  const types = [...new Set(data.map(item => item.type))];
  const lowStockItems = data.filter(item => (parseInt(item.quantity_new) || 0) < 10).length;
  const outOfStockItems = data.filter(item => (parseInt(item.quantity_new) || 0) === 0).length;
  const activeItems = data.filter(item => item.status === 'Active').length;

  // Chart options
  const chartOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Inventory',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: categories.map(category => ({
          name: category,
          value: data.filter(item => item.category === category)
            .reduce((sum, item) => sum + (parseInt(item.quantity_new) || 0) + (parseInt(item.quantity_used) || 0), 0)
        }))
      }
    ]
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h4">{totalItems}</Typography>
              <Typography variant="body2" color="textSecondary">
                New: {totalNew} | Used: {totalUsed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Categories</Typography>
              <Typography variant="h4">{categories.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Types: {types.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Low Stock Items</Typography>
              <Typography variant="h4">{lowStockItems}</Typography>
              <Typography variant="body2" color="textSecondary">
                Items with quantity &lt; 10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Out of Stock</Typography>
              <Typography variant="h4">{outOfStockItems}</Typography>
              <Typography variant="body2" color="textSecondary">
                Items with quantity = 0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Items</Typography>
              <Typography variant="h4">{activeItems}</Typography>
              <Typography variant="body2" color="textSecondary">
                Currently active items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Stock Value</Typography>
              <Typography variant="h4">{data.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Total inventory items
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Items by Category
              </Typography>
              <ReactECharts 
                option={chartOption}
                style={{ height: '400px' }}
                notMerge={true}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 