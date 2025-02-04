import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchInventory, fetchCategories, fetchTypes, addInventoryUnit, updateInventoryUnit, deleteInventoryUnit, logTransaction } from '../api/api';
import './inandout.css';
import FormModal from './form-modal';
import LogModal from './transaction'; // Import your LogModal component
import ConfirmationModal from './ConfirmationModal';
import Alert from '../alert';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom


const InandOut = () => {
    
    const [units, setUnits] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUnit, setCurrentUnit] = useState(null);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [unitToDelete, setUnitToDelete] = useState(null);
    const [currentTransactionItem, setCurrentTransactionItem] = useState(null); // Define the currentTransactionItem state
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });

    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 15;

    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const unitsData = await fetchInventory();
                setUnits(unitsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Ensure loading is set to false here
            }
        };
        
    
        const fetchCategoriesData = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories([...new Set(categoriesData.filter(item => item !== null))]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
    
        const fetchTypesData = async () => {
            try {
                const typesData = await fetchTypes();
                setTypes([...new Set(typesData.filter(item => item !== null))]);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };
    
        // Call all functions without conditional calls
        fetchUnits();
        fetchCategoriesData();
        fetchTypesData();
    }, []);
    

    // Automatically close alert after a timeout
    useEffect(() => {
        if (alert.visible) {
            const timer = setTimeout(() => {
                setAlert(prevAlert => ({ ...prevAlert, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const openModal = (unit = null) => {
        setCurrentUnit(unit);
        setModalOpen(true);
    };

    const openTransactionModal = (item) => {
        console.log('Opening transaction modal for item:', item); // Log the clicked item
        setCurrentTransactionItem(item);
        setIsTransactionModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentUnit(null);
    };

    const closeTransactionModal = () => {
        setIsTransactionModalOpen(false);
        setCurrentTransactionItem(null);
    };

    const openConfirmModal = (unit) => {
        setUnitToDelete(unit);
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setUnitToDelete(null);
    };

    const showAlert = (message) => {
        setAlert({ message, visible: true });
    };

    const handleDelete = async (id) => {
        try {
            await deleteInventoryUnit(id);
            setUnits(units.filter(unit => unit.id !== id));
            showAlert('Unit deleted successfully!', 'success'); // Show success alert
        } catch (error) {
            console.error('Failed to delete unit', error);
            showAlert('Error deleting unit!', 'error'); // Show error alert
        }
    };
    

    const handleConfirmDelete = () => {
        if (unitToDelete) {
            handleDelete(unitToDelete.id);
        }
        closeConfirmModal();
    };

const handleSave = async (unitData) => {
    // Check for negative values before proceeding
    if (unitData.quantity_new < 0 || unitData.quantity_used < 0) {
        showAlert('Please enter only positive values for quantities.', 'error');
        return; // Exit the function early if invalid data
    }

    try {
        let response;
        if (currentUnit) {
            response = await updateInventoryUnit(currentUnit.id, unitData);
        } else {
            response = await addInventoryUnit(unitData);
        }

        if (response && response.item) {
            const updatedUnit = response.item; // This should include 'type'
            if (currentUnit) {
                setUnits(units.map(unit => (unit.id === updatedUnit.id ? updatedUnit : unit)));
                showAlert('Unit updated successfully!', 'success');
            } else {
                setUnits([...units, updatedUnit]); // Ensure this includes 'type'
                showAlert('Unit added successfully!', 'success');
            }
        } else {
            console.error('Unexpected response structure:', response);
            showAlert('Error saving item.', 'error');
        }

        closeModal();
    } catch (error) {
        console.error('Error saving unit:', error.response?.data || error.message);
        showAlert('Error saving item.', 'error');
    }
};
    
    const filteredAndSortedUnits = useMemo(() => {
        return units
            .filter(unit => {
                const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = !selectedCategory || unit.category === selectedCategory;
                const matchesType = !selectedType || unit.type === selectedType;
                return matchesSearch && matchesCategory && matchesType;
            })
            .sort((a, b) => {
                if (!sortConfig.key) return 0;
                const direction = sortConfig.direction === 'asc' ? 1 : -1;
                return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
            });
    }, [units, searchQuery, selectedCategory, selectedType, sortConfig]);

    const handleSort = useCallback((key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    // Helper function to display sorting arrow
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return '↕';
    };

    const handleTransactionSave = async (transactionData) => {
        try {
            // Update the inventory for the current item
            await updateInventoryUnit(currentTransactionItem.id, transactionData);
    
            // Log the transaction (adjust this function to match your backend logging endpoint)
            await logTransaction(transactionData);
    
            showAlert('Transaction saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save transaction', error);
            showAlert('Error saving transaction!', 'error');
        }
    
        closeTransactionModal();
    };
    

    return (
        <div className="inandout">
            <h1>Inventory and History</h1>
            <button onClick={() => openModal()}>Input</button>
            <button onClick={() => navigate('../history')}>History</button> {/* Link to history page */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                    <option value="">All Categories</option>
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))
                    ) : (
                        <option value="">Loading categories...</option>
                    )}
                </select>
                <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
                    <option value="">All Types</option>
                    {types.length > 0 ? (
                        types.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))
                    ) : (
                        <option value="">Loading types...</option>
                    )}
                </select>
            </div>

            <div className="inputcontainer"> 
            <div className="table-container">
                <table className="table">
                <thead>
    <tr>
        
        <th onClick={() => handleSort('id')}>
            <span>ID</span>
            <span className="sort-icon">{getSortIndicator('name')}</span>
        </th>
        <th onClick={() => handleSort('name')}>
            <span>Nama</span>
            <span className="sort-icon">{getSortIndicator('name')}</span>
        </th>
        <th onClick={() => handleSort('category')}>
            <span>Kategori</span>
            <span className="sort-icon">{getSortIndicator('category')}</span>
        </th>
        <th onClick={() => handleSort('type')}>
            <span>Tipe</span>
            <span className="sort-icon">{getSortIndicator('type')}</span>
        </th>
        <th onClick={() => handleSort('quantity_new')}>
            <span>Jumlah baru</span>
            <span className="sort-icon">{getSortIndicator('quantity_new')}</span>
        </th>
        <th onClick={() => handleSort('quantity_used')}>
            <span>Jumlah Bekas</span>
            <span className="sort-icon">{getSortIndicator('quantity_used')}</span>
        </th>
        <th onClick={() => handleSort('unit')}>
            <span>Satuan</span>
            <span className="sort-icon">{getSortIndicator('unit')}</span>
        </th>
        <th onClick={() => handleSort('total')}>
            <span>Total Barang</span>
            <span className="sort-icon">{getSortIndicator('total')}</span>
        </th>
        <th>Aksi</th>
            </tr>
                </thead>
                    <tbody>
                        {filteredAndSortedUnits.slice(currentPage * entriesPerPage - entriesPerPage, currentPage * entriesPerPage).map((unit) => (
                                <tr key={unit.id} onClick={() => openTransactionModal(unit)} style={{ cursor: 'pointer' }}>                               
                                <td>{unit.id}</td>
                                <td>{unit.name}</td>
                                <td>{unit.category}</td>
                                <td>{unit.type}</td>
                                <td>{unit.quantity_new}</td>
                                <td>{unit.quantity_used}</td>
                                <td>{unit.unit}</td>
                                <td>{parseInt(unit.quantity_new, 10) + parseInt(unit.quantity_used, 10)}</td> 
                                <td>
                                    <button onClick={() => openModal(unit)} className="edit-button">
                                        <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="edit-icon" />
                                    </button>
                                    <button onClick={() => openConfirmModal(unit)} className="delete-button">
                                        <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" className="delete-icon" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>

            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>

                {Array.from({ length: Math.ceil(filteredAndSortedUnits.length / entriesPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} disabled={currentPage === i + 1}>
                        {i + 1}
                    </button>
                ))}

                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedUnits.length / entriesPerPage)))} disabled={currentPage === Math.ceil(filteredAndSortedUnits.length / entriesPerPage)}>
                    Next
                </button>
            </div>

            {alert.visible && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, visible: false })} />}

            <FormModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                currentUnit={currentUnit} 
                onSave={handleSave} 
                categories={categories} 
                types={types} 
            />

            <LogModal 
                isOpen={isTransactionModalOpen} 
                onClose={closeTransactionModal} 
                currentItem={currentTransactionItem} 
                onSave={(data) => handleTransactionSave({
                    ...data,
                    item_id: currentTransactionItem.id,
                    timestamp: new Date().toISOString(),
                })}
            />
        

            <ConfirmationModal 
                isOpen={isConfirmModalOpen} 
                onClose={closeConfirmModal} 
                onConfirm={handleConfirmDelete} 
                message="Are you sure you want to delete this item?" 
            />
        </div>
    );
};

export default InandOut;
