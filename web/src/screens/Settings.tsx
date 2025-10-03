import React from 'react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <div className="settings">
      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/medicines" className="nav-link">My Medicines</Link>
          <Link to="/add-medicine" className="nav-link">Add Medicine</Link>
          <Link to="/alerts" className="nav-link">Alerts</Link>
          <Link to="/settings" className="nav-link active">Settings</Link>
        </div>
      </nav>

      <div className="settings-content">
        <h2 className="section-title">Settings</h2>
        <p>Settings configuration will be implemented here.</p>
      </div>
    </div>
  );
};

export default Settings;
