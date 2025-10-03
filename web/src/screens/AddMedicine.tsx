import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddMedicine: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    generic_name: '',
    category: 'otc',
    expiry_date: '',
    purchase_date: '',
    quantity: '',
    min_threshold: '5',
    batch_number: '',
    manufacturer: '',
    price: '',
    storage_location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Adding medicine:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="form-container">
      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/medicines" className="nav-link">My Medicines</Link>
          <Link to="/add-medicine" className="nav-link active">Add Medicine</Link>
          <Link to="/alerts" className="nav-link">Alerts</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="medicine-form">
        <h2 className="form-title">Add New Medicine</h2>

        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Medicine Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-input"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Category</h3>
          <div className="category-options">
            {['prescription', 'otc', 'supplement'].map(category => (
              <button
                key={category}
                type="button"
                className={`category-option ${formData.category === category ? 'selected' : ''}`}
                onClick={() => handleInputChange('category', category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Important Dates</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Expiry Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.purchase_date}
                onChange={(e) => handleInputChange('purchase_date', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Inventory</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Threshold</label>
              <input
                type="number"
                className="form-input"
                value={formData.min_threshold}
                onChange={(e) => handleInputChange('min_threshold', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Add Medicine
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
