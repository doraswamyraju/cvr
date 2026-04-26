import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

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
        <Route index element={<div className="card"><h2>Super Admin Overview</h2><p>Full system access and configuration.</p></div>} />
        <Route path="master-setup" element={<div className="card"><h2>Master Setup Module</h2></div>} />
        <Route path="system" element={<div className="card"><h2>System Admin Module</h2></div>} />
        <Route path="modules" element={<div className="card"><h2>All Modules Access</h2></div>} />
      </Route>
    </Routes>
  );
};

export default SuperAdminDashboard;
