export const validateInventoryForm = (data) => {
    const errors = {};
    
    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!data.category) {
        errors.category = 'Category is required';
    }
    
    if (!data.type) {
        errors.type = 'Type is required';
    }
    
    if (data.quantity_new < 0 || isNaN(data.quantity_new)) {
        errors.quantity_new = 'Quantity must be a positive number';
    }
    
    if (data.quantity_used < 0 || isNaN(data.quantity_used)) {
        errors.quantity_used = 'Quantity must be a positive number';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 