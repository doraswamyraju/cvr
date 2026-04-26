import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './dashboards/AdminDashboard';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ClientDashboard from './dashboards/ClientDashboard';
import './index.css';

// We will use the Login component from src/pages/Login.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Dashboards Routes */}
        <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/employee/*" element={<EmployeeDashboard />} />
        <Route path="/client/*" element={<ClientDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
