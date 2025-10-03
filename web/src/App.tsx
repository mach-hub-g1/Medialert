import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Dashboard from './screens/Dashboard';
import MedicineList from './screens/MedicineList';
import AddMedicine from './screens/AddMedicine';
import Alerts from './screens/Alerts';
import Settings from './screens/Settings';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header className="app-header">
            <h1>MediAlert Pro</h1>
            <p>Medicine Expiry Notification System</p>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medicines" element={<MedicineList />} />
              <Route path="/add-medicine" element={<AddMedicine />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>&copy; 2024 MediAlert Pro - Medicine Management System</p>
          </footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
