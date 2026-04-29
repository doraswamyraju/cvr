import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ role, navigation }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Super Admin' };
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">C</div>
          <h2>CVR ERP</h2>
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
                <span className="nav-text">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => {
            localStorage.clear();
            window.location.href='/';
          }}>
            <span className="icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Floating Header */}
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">{role === 'Admin' ? 'CVR Association' : `${role} Portal`}</h1>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search enterprise data..." />
            </div>
          </div>
          
          <div className="header-right">
            <button className="icon-btn" title="Notifications">
              <span>🔔</span>
              <span className="notification-dot"></span>
            </button>
            
            <button className="icon-btn" title="Help">
              <span>❓</span>
            </button>

            <button className="icon-btn" title="Apps">
              <span>⠿</span>
            </button>
            
            <button className="user-profile-btn">
              <div className="avatar">{getInitials(user.name)}</div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{role}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
