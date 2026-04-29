import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ClientManagement from '../modules/admin/ClientManagement';
import EmployeeManagement from '../modules/admin/EmployeeManagement';
import IncomingRegister from '../modules/admin/IncomingRegister';
import VisitorRegister from '../modules/admin/VisitorRegister';
import MasterManagement from '../modules/admin/MasterManagement';
import AdminOverview from '../modules/admin/AdminOverview';

// Mock placeholders for the other modules
const Placeholder = ({ title }) => (
  <div className="card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h2>{title}</h2>
      <button className="btn btn-primary">+ Add New</button>
    </div>
    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Module under construction.</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/overview', icon: '🏠' },
    
    { name: 'Masters Module', isHeader: true },
    { name: 'Core Masters', path: '/admin/masters', icon: '🛠️' },

    { name: 'CRM Module', isHeader: true },
    { name: 'Client Master', path: '/admin/clients', icon: '👥' },
    { name: 'Incoming Register', path: '/admin/incoming', icon: '📥' },
    { name: 'Visitor Register', path: '/admin/visitors', icon: '🚶' },
    
    { name: 'HRMS Module', isHeader: true },
    { name: 'Employee Master', path: '/admin/employees', icon: '👔' },
    { name: 'Attendance', path: '/admin/attendance', icon: '📅' },
    { name: 'Leave Management', path: '/admin/leave', icon: '✈️' },
    { name: 'Recruitment', path: '/admin/recruitment', icon: '🎯' },
    { name: 'Payroll', path: '/admin/payroll', icon: '💸' },

    { name: 'ERP Module', isHeader: true },
    { name: 'Task Management', path: '/admin/tasks', icon: '📋' },
    { name: 'Issue Tracker', path: '/admin/issues', icon: '🐛' },
    { name: 'Assets Management', path: '/admin/assets', icon: '💻' },
    { name: 'File Management', path: '/admin/files', icon: '📁' },
    { name: 'Communication', path: '/admin/communication', icon: '💬' },

    { name: 'Finance & Admin', isHeader: true },
    { name: 'Finance & Accounting', path: '/admin/finance', icon: '💰' },
    { name: 'Accounts Setup', path: '/admin/accounts-setup', icon: '🏦' },
    { name: 'General Admin', path: '/admin/general-admin', icon: '🏢' },
    { name: 'General Setting', path: '/admin/settings', icon: '⚙️' }
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout role="Admin" navigation={navItems} />}>
        {/* Redirect root to overview */}
        <Route index element={<Navigate to="overview" replace />} />
        
        <Route path="overview" element={<AdminOverview />} />
        
        {/* Masters */}
        <Route path="masters" element={<MasterManagement />} />

        {/* CRM */}
        <Route path="clients" element={<ClientManagement />} />
        <Route path="incoming" element={<IncomingRegister />} />
        <Route path="visitors" element={<VisitorRegister />} />

        {/* HRMS */}
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="attendance" element={<Placeholder title="Attendance" />} />
        <Route path="leave" element={<Placeholder title="Leave Management" />} />
        <Route path="recruitment" element={<Placeholder title="Recruitment" />} />
        <Route path="payroll" element={<Placeholder title="Payroll" />} />

        {/* ERP */}
        <Route path="tasks" element={<Placeholder title="Task Management" />} />
        <Route path="issues" element={<Placeholder title="Issue Tracker" />} />
        <Route path="assets" element={<Placeholder title="Assets Management" />} />
        <Route path="files" element={<Placeholder title="File Management" />} />
        <Route path="communication" element={<Placeholder title="Communication" />} />

        {/* Finance & Admin */}
        <Route path="finance" element={<Placeholder title="Finance & Accounting" />} />
        <Route path="accounts-setup" element={<Placeholder title="Accounts Setup" />} />
        <Route path="general-admin" element={<Placeholder title="General Admin" />} />
        <Route path="settings" element={<Placeholder title="General Setting" />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
