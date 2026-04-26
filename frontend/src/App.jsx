import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ClientDashboard from './dashboards/ClientDashboard';
import './index.css';

// A mock login page for demonstration
const Login = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="card glass animate-fade-in" style={{ width: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>ERP Login</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => window.location.href='/super-admin'}>Login as Super Admin</button>
          <button className="btn btn-primary" onClick={() => window.location.href='/admin'}>Login as Admin</button>
          <button className="btn btn-primary" onClick={() => window.location.href='/employee'}>Login as Employee</button>
          <button className="btn btn-primary" onClick={() => window.location.href='/client'}>Login as Client</button>
        </div>
      </div>
    </div>
  );
};

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
