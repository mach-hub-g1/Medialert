import React from 'react';
import { Link } from 'react-router-dom';

const MedicineList: React.FC = () => {
  return (
    <div className="medicine-list">
      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/medicines" className="nav-link active">My Medicines</Link>
          <Link to="/add-medicine" className="nav-link">Add Medicine</Link>
          <Link to="/alerts" className="nav-link">Alerts</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </div>
      </nav>

      <div className="medicine-list-content">
        <h2 className="section-title">My Medicines</h2>
        <p>Medicine list functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default MedicineList;
