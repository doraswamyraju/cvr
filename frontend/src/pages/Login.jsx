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
        // Store user data and token in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
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
      // Fallback for demonstration purposes if DB is not connected
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
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="card glass animate-fade-in" style={{ width: '400px', textAlign: 'center', padding: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>CVR ERP</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to your account</p>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              style={inputStyle} 
              placeholder="Enter your email"
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              style={inputStyle} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: '0.95rem'
};

export default Login;
