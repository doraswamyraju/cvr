import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const AdminDashboard = () => {
  const navItems = [
    { name: 'Home', path: '/admin', icon: '🏠' },
    { name: 'Clients', path: '/admin/clients', icon: '👥' },
    { name: 'HR', path: '/admin/hr', icon: '👔' },
    { name: 'Finance', path: '/admin/finance', icon: '💰' },
    { name: 'Tasks', path: '/admin/tasks', icon: '📋' }
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout role="Admin" navigation={navItems} />}>
        <Route index element={<div className="card"><h2>Admin Overview</h2><p>Welcome to the Admin Dashboard. Select a module from the sidebar.</p></div>} />
        <Route path="clients" element={<div className="card"><h2>Client Management Module</h2></div>} />
        <Route path="hr" element={<div className="card"><h2>HR Management Module</h2></div>} />
        <Route path="finance" element={<div className="card"><h2>Finance Module</h2></div>} />
        <Route path="tasks" element={<div className="card"><h2>Task Management Module</h2></div>} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
