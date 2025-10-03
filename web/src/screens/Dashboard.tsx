import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setMedicines, setLoading, setError } from '../store/slices/medicineSlice';
import { setAlerts } from '../store/slices/alertSlice';
import { apiService } from '../services/ApiService';
import MedicineCard from '../components/MedicineCard';
import AlertBanner from '../components/AlertBanner';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicines);
  const { alerts } = useSelector((state: RootState) => state.alerts);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      dispatch(setLoading(true));
      const [medicinesData, alertsData] = await Promise.all([
        apiService.getMedicines(),
        apiService.checkAlerts(),
      ]);

      dispatch(setMedicines(medicinesData));
      dispatch(setAlerts(alertsData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const expiringSoonMedicines = medicines.filter(medicine => {
    const expiryDate = new Date(medicine.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const lowStockMedicines = medicines.filter(medicine => medicine.quantity <= medicine.min_threshold);

  const urgentAlerts = alerts.filter(alert => !alert.is_sent);

  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link active">Dashboard</Link>
          <Link to="/medicines" className="nav-link">My Medicines</Link>
          <Link to="/add-medicine" className="nav-link">Add Medicine</Link>
          <Link to="/alerts" className="nav-link">Alerts</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Urgent Alerts */}
        {urgentAlerts.length > 0 && (
          <div className="alerts-section">
            <h2 className="section-title">Urgent Alerts</h2>
            <div className="alerts-container">
              {urgentAlerts.slice(0, 3).map(alert => (
                <AlertBanner key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{expiringSoonMedicines.length}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{lowStockMedicines.length}</div>
            <div className="stat-label">Low Stock</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{medicines.length}</div>
            <div className="stat-label">Total Medicines</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/add-medicine" className="action-button">Add Medicine</Link>
            <Link to="/medicines" className="action-button">View All Medicines</Link>
            <Link to="/alerts" className="action-button">View Alerts</Link>
          </div>
        </div>

        {/* Recent Medicines */}
        {medicines.length > 0 && (
          <div className="recent-medicines">
            <h2 className="section-title">Recent Medicines</h2>
            <div className="medicine-grid">
              {medicines.slice(0, 6).map(medicine => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            Loading dashboard data...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
