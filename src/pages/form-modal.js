import React, { useEffect, useState } from 'react';
import './form-modal.css'; // Import your CSS file for styling

const FormModal = ({ isOpen, onClose, currentUnit, onSave, categories, types }) => {
    const [formData, setFormData] = useState({
        id: '',        
        name: '',
        category: '',
        type: '',
        quantity_new: '',
        quantity_used: '',
        unit: '',
        customCategory: '', // For custom category input
        customType: '' // For custom type input
    });

    useEffect(() => {
        if (currentUnit) {
            // If updating, populate the form with the current unit data
            setFormData({
                id: currentUnit.id || '',
                name: currentUnit.name || '',
                category: currentUnit.category || '',
                type: currentUnit.type || '',
                quantity_new: currentUnit.quantity_new || '',
                quantity_used: currentUnit.quantity_used || '',
                unit: currentUnit.unit || '',
                customCategory: '', // Reset custom inputs
                customType: ''
            });
        } else {
            // Reset form data for adding a new unit
            setFormData({
                id: '',
                name: '',
                category: '',
                type: '',
                quantity_new: '',
                quantity_used: '',
                unit: '',
                customCategory: '',
                customType: ''
            });
        }
    }, [currentUnit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("form modal submit triggered");

        // Use custom values if provided
        const finalData = {
            ...formData,
            category: formData.category === 'Lainnya' ? formData.customCategory : formData.category,
            type: formData.type === 'Lainnya' ? formData.customType : formData.type
        };
        onSave(finalData); // Call the onSave prop with finalData
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{currentUnit ? 'Edit Unit' : 'Tambah Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">ID:</label>
                        <input 
                            type="text" 
                            id="id" 
                            name="id" 
                            value={formData.id} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Nama:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    {/* Kategori Group */}
                    <div className="form-group-inline">
                        <select 
                            id="category" 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        {formData.category === 'Lainnya' && (
                            <input
                                type="text"
                                placeholder="Kategori baru"
                                value={formData.customCategory}
                                onChange={handleChange}
                                name="customCategory"
                            />
                        )}
                    </div>

                    {/* Tipe Group */}
                    <div className="form-group-inline">
                        <select 
                            id="type" 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Tipe</option>
                            {types.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        {formData.type === 'Lainnya' && (
                            <input
                                type="text"
                                placeholder="Tipe baru"
                                value={formData.customType}
                                onChange={handleChange}
                                name="customType"
                            />
                        )}
                    </div>


                    
                    <div className="form-group">
                        <label htmlFor="unit">Satuan:</label>
                        <input 
                            type="text" 
                            id="unit" 
                            name="unit" 
                            value={formData.unit} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default FormModal;
