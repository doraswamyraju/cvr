import React from 'react';

const StatCard = ({ icon, label, value, trend, trendValue, color = 'blue' }) => {
  const getColors = () => {
    switch (color) {
      case 'green': return { bg: '#dcfce7', text: '#166534', icon: '#22c55e' };
      case 'orange': return { bg: '#ffedd5', text: '#9a3412', icon: '#f97316' };
      case 'purple': return { bg: '#f3e8ff', text: '#6b21a8', icon: '#a855f7' };
      default: return { bg: '#e0f2fe', text: '#075985', icon: '#0ea5e9' };
    }
  };

  const colors = getColors();

  return (
    <div className="card stat-card animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: colors.bg, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: colors.icon
        }}>
          {icon}
        </div>
        {trendValue && (
          <div style={{ 
            padding: '0.25rem 0.5rem', 
            borderRadius: '9999px', 
            background: trend === 'up' ? '#dcfce7' : '#fee2e2',
            color: trend === 'up' ? '#166534' : '#991b1b',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            {trend === 'up' ? '+' : '-'}{trendValue}
          </div>
        )}
      </div>
      
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{label}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
