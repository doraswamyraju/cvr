import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Home, ClipboardList, Calendar, Plane } from 'lucide-react';

const EmployeeDashboard = () => {
  const navItems = [
    { name: 'Home', path: '/employee', icon: <Home size={20} /> },
    { name: 'My Tasks', path: '/employee/tasks', icon: <ClipboardList size={20} /> },
    { name: 'Attendance', path: '/employee/attendance', icon: <Calendar size={20} /> },
    { name: 'Leave', path: '/employee/leave', icon: <Plane size={20} /> }
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout role="Employee" navigation={navItems} />}>
        <Route index element={<div className="card"><h2>Employee Portal</h2><p>Welcome to your portal.</p></div>} />
        <Route path="tasks" element={<div className="card"><h2>My Tasks Module</h2></div>} />
        <Route path="attendance" element={<div className="card"><h2>Attendance Module</h2></div>} />
        <Route path="leave" element={<div className="card"><h2>Leave Management Module</h2></div>} />
      </Route>
    </Routes>
  );
};

export default EmployeeDashboard;
