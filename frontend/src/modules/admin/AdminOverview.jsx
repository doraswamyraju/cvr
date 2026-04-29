import React from 'react';
import StatCard from '../../components/dashboard/StatCard';

const AdminOverview = () => {
  return (
    <div className="admin-overview" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening with your enterprise today.</p>
        </div>
        <button className="btn btn-primary">+ Generate Report</button>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <StatCard 
          icon="👥" 
          label="Total Clients" 
          value="2,543" 
          trend="up" 
          trendValue="12%" 
          color="blue"
        />
        <StatCard 
          icon="💵" 
          label="Revenue" 
          value="$1.2M" 
          trend="up" 
          trendValue="8.4%" 
          color="green"
        />
        <StatCard 
          icon="📋" 
          label="Tasks Pending" 
          value="45" 
          trend="down" 
          trendValue="High Priority" 
          color="orange"
        />
        <StatCard 
          icon="👔" 
          label="Employees" 
          value="150" 
          trend="up" 
          trendValue="Stable" 
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '1.5rem' 
      }}>
        <div className="card" style={{ height: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Revenue Trends</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="badge badge-info" style={{ border: 'none', cursor: 'pointer' }}>Monthly</button>
              <button className="badge" style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Quarterly</button>
            </div>
          </div>
          {/* Mock Chart Area */}
          <div style={{ height: '300px', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem' }}>
            {[40, 60, 50, 80, 70, 90, 85, 100].map((height, i) => (
              <div key={i} style={{ 
                width: '30px', 
                height: `${height}%`, 
                background: i === 7 ? 'var(--primary-color)' : '#cbd5e1', 
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.5s ease'
              }}></div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Recent Activities</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { title: 'New Client Onboarding', time: '2 hours ago', color: '#4c6ef5' },
              { title: 'Financial Report Exported', time: '5 hours ago', color: '#22c55e' },
              { title: 'System Maintenance', time: 'Yesterday', color: '#f97316' },
              { title: 'New Employee Added', time: 'Yesterday', color: '#a855f7' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ minWidth: '12px', height: '12px', borderRadius: '50%', background: item.color, marginTop: '4px' }}></div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>View All Activity</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
