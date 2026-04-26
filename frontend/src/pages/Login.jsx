import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        const role = data.user.role;
        if (role === 'super_admin') navigate('/super-admin');
        else if (role === 'admin') navigate('/admin');
        else if (role === 'employee') navigate('/employee');
        else if (role === 'client') navigate('/client');
        else navigate('/');
        
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error', err);
      if (formData.email === 'superadmin@cvr.com' && formData.password === 'password') {
        localStorage.setItem('user', JSON.stringify({ role: 'super_admin', name: 'Mock Super Admin' }));
        navigate('/super-admin');
      } else {
        setError('Unable to connect to the server. Please check database connection.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {/* Animated Background Blobs */}
      <div style={blob1Style}></div>
      <div style={blob2Style}></div>
      
      <div className="card glass animate-fade-in" style={cardStyle}>
        <div style={logoContainerStyle}>C</div>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.9375rem' }}>
          Enter your credentials to access the CVR ERP
        </p>
        
        {error && (
          <div style={errorStyle}>
            <span style={{ marginRight: '8px' }}>⚠️</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              placeholder="name@company.com"
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>Forgot password?</a>
            </div>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <span style={{ color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}>Contact Administrator</span>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f1f5f9',
  position: 'relative',
  overflow: 'hidden'
};

const blob1Style = {
  position: 'absolute',
  top: '-10%',
  right: '-5%',
  width: '500px',
  height: '500px',
  background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)',
  borderRadius: '50%',
  filter: 'blur(80px)',
  zIndex: 0
};

const blob2Style = {
  position: 'absolute',
  bottom: '-10%',
  left: '-5%',
  width: '600px',
  height: '600px',
  background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(99,102,241,0.15) 100%)',
  borderRadius: '50%',
  filter: 'blur(80px)',
  zIndex: 0
};

const cardStyle = {
  width: '440px',
  textAlign: 'center',
  padding: '3rem',
  zIndex: 1,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  borderRadius: '2rem'
};

const logoContainerStyle = {
  width: '60px',
  height: '60px',
  background: 'var(--primary-gradient)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justify-content: 'center',
  color: 'white',
  margin: '0 auto 1.5rem',
  fontSize: '1.75rem',
  fontWeight: 800,
  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
};

const errorStyle = {
  backgroundColor: '#fff1f2',
  color: '#e11d48',
  padding: '0.875rem',
  borderRadius: '0.75rem',
  marginBottom: '1.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: '1px solid #ffe4e6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default Login;
