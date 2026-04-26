import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const ClientDashboard = () => {
  const navItems = [
    { name: 'Home', path: '/client', icon: '🏠' },
    { name: 'My Services', path: '/client/services', icon: '🛠️' },
    { name: 'Invoices', path: '/client/invoices', icon: '🧾' },
    { name: 'Support', path: '/client/support', icon: '🎧' }
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout role="Client" navigation={navItems} />}>
        <Route index element={<div className="card"><h2>Client Portal</h2><p>Welcome to your portal.</p></div>} />
        <Route path="services" element={<div className="card"><h2>My Services</h2></div>} />
        <Route path="invoices" element={<div className="card"><h2>Invoices & Billing</h2></div>} />
        <Route path="support" element={<div className="card"><h2>Support & Tickets</h2></div>} />
      </Route>
    </Routes>
  );
};

export default ClientDashboard;
