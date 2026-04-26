import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ role, navigation }) => {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>{role} Portal</h2>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item, index) => {
            if (item.isHeader) {
              return <div key={`header-${index}`} className="sidebar-category">{item.name}</div>;
            }
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                {item.name}
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-logout" onClick={() => window.location.href='/'}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="top-header glass">
          <div className="header-left">
            <h3 className="page-title">Dashboard Overview</h3>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="avatar">{role.charAt(0)}</div>
              <span>{role} User</span>
            </div>
          </div>
        </header>
        
        <main className="page-content bg-color">
          {/* Outlet renders the matched child route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
