import React from 'react';
import { Link } from 'react-router-dom';

const Alerts: React.FC = () => {
  return (
    <div className="alerts">
      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/medicines" className="nav-link">My Medicines</Link>
          <Link to="/add-medicine" className="nav-link">Add Medicine</Link>
          <Link to="/alerts" className="nav-link active">Alerts</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </div>
      </nav>

      <div className="alerts-content">
        <h2 className="section-title">Alerts</h2>
        <p>Alerts management functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default Alerts;
