import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import FirmManagement from '../modules/super_admin/FirmManagement';

const SuperAdminDashboard = () => {
  const navItems = [
    { name: 'Home', path: '/super-admin', icon: '🏠' },
    { name: 'Master Setup', path: '/super-admin/master-setup', icon: '⚙️' },
    { name: 'System Admin', path: '/super-admin/system', icon: '💻' },
    { name: 'All Modules', path: '/super-admin/modules', icon: '🧩' }
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout role="Super Admin" navigation={navItems} />}>
        <Route index element={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Super Admin Control Center</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="card">
                <h3>System Health</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>All systems operational.</p>
                <div style={{ marginTop: '1.5rem', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'var(--primary-color)' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Storage usage: 85%</p>
              </div>
              <div className="card">
                <h3>Firm Management</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>12 active firms in the system.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }}>Manage Firms</button>
              </div>
            </div>
          </div>
        } />
        <Route path="master-setup" element={<FirmManagement />} />
        <Route path="system" element={<div className="card"><h2>System Admin Module</h2></div>} />
        <Route path="modules" element={<div className="card"><h2>All Modules Access</h2></div>} />
      </Route>
    </Routes>
  );
};

export default SuperAdminDashboard;
