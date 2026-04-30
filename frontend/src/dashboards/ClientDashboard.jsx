import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Home, Briefcase, FileText, Headphones } from 'lucide-react';

const ClientDashboard = () => {
  const navItems = [
    { name: 'Home', path: '/client', icon: <Home size={20} /> },
    { name: 'My Services', path: '/client/services', icon: <Briefcase size={20} /> },
    { name: 'Invoices', path: '/client/invoices', icon: <FileText size={20} /> },
    { name: 'Support', path: '/client/support', icon: <Headphones size={20} /> }
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
