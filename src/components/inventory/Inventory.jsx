import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  InputLabel,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  fetchInventory, 
  fetchDashboardData,
} from '../../api/api';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import InventoryTable from './InventoryTable';
import InventoryCards from './InventoryCards';
import ErrorBoundary from '../ErrorBoundary';
import ProtectedRoute from '../auth/ProtectedRoute';

const Inventory = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: false,
    error: null,
    items: []
  });

  const [statistics, setStatistics] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0
  });

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filters, setFilters] = useState({
    categories: ['all'],
    types: ['all']
  });

  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (filters = {}) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const [inventoryData, dashboardData] = await Promise.all([
        fetchInventory(filters),
        fetchDashboardData()
      ]);

      if (inventoryData.success && inventoryData.data) {
        setState(prev => ({
          ...prev,
          items: inventoryData.data.items || [],
          loading: false,
          error: null,
        }));
      }

      setStatistics({
        totalItems: dashboardData.statistics?.totalItems || 0,
        lowStock: dashboardData.statistics?.lowStock || 0,
        outOfStock: dashboardData.statistics?.outOfStock || 0
      });

      setFilters({
        categories: ['all', ...(dashboardData.filters?.categories || [])],
        types: ['all', ...(dashboardData.filters?.types || [])]
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load inventory data',
        loading: false
      }));
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'category') {
      setCategoryFilter(value);
      setTypeFilter('all');
    } else if (filterType === 'type') {
      setTypeFilter(value);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = state.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchData({ category: categoryFilter, type: typeFilter });
  }, [categoryFilter, typeFilter]);

  // Add handler for history navigation
  const handleHistoryClick = () => {
    navigate('/history');
  };

  if (state.loading && !state.items.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (state.error) {
    return <Alert severity="error">{state.error}</Alert>;
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">
                Inventory Management
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HistoryIcon />}
                onClick={handleHistoryClick}
                sx={{ ml: 2 }}
              >
                View History
              </Button>
            </Box>
            <ErrorBoundary>
              <InventoryCards 
                statistics={statistics}
                loading={state.loading}
              />
            </ErrorBoundary>
          </Box>
          
          <Box sx={{ my: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                {filters.categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label="Type"
                disabled={categoryFilter === 'all'}
              >
                {filters.types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <ErrorBoundary>
              <InventoryTable data={filteredItems} />
            </ErrorBoundary>
          </Box>
        </Container>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default Inventory;