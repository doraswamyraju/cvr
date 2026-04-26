import React, { useState, useEffect } from 'react';

const FirmManagement = () => {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firm_name: '',
    firm_email: '',
    firm_phone: '',
    admin_name: '',
    admin_email: '',
    admin_password: ''
  });

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/firms.php'); // Mock URL, adjust in production
      const data = await response.json();
      if (data.status === 'success') {
        setFirms(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch firms', error);
      // Mock data for UI demonstration without DB
      setFirms([
        { id: 1, name: 'ABC Associates', email: 'contact@abc.com', admin_name: 'John Doe', admin_email: 'john@abc.com', status: 'active', created_at: '2026-04-26' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/firms.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setShowModal(false);
        setFormData({ firm_name: '', firm_email: '', firm_phone: '', admin_name: '', admin_email: '', admin_password: '' });
        fetchFirms();
        alert('Firm created successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating firm', error);
      // Mock success for demonstration
      alert('Mock: Firm created successfully (DB disconnected)');
      setShowModal(false);
      fetchFirms();
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      <div className="card glass animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Firm Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add New Firm</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Firm Name</th>
                <th style={{ padding: '1rem' }}>Admin Name</th>
                <th style={{ padding: '1rem' }}>Admin Email</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {firms.length > 0 ? firms.map(firm => (
                <tr key={firm.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{firm.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{firm.name}</td>
                  <td style={{ padding: '1rem' }}>{firm.admin_name || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{firm.admin_email || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.8rem',
                      backgroundColor: firm.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: firm.status === 'active' ? '#166534' : '#991b1b'
                    }}>
                      {firm.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No firms found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New CA Firm</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Firm Name *</label>
                <input type="text" name="firm_name" value={formData.firm_name} onChange={handleInputChange} required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Firm Email</label>
                  <input type="email" name="firm_email" value={formData.firm_email} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Firm Phone</label>
                  <input type="text" name="firm_phone" value={formData.firm_phone} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Primary Admin Details</h4>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Admin Name *</label>
                <input type="text" name="admin_name" value={formData.admin_name} onChange={handleInputChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Admin Email (Login) *</label>
                <input type="email" name="admin_email" value={formData.admin_email} onChange={handleInputChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password *</label>
                <input type="password" name="admin_password" value={formData.admin_password} onChange={handleInputChange} required style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Firm & Admin'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  outline: 'none',
  fontFamily: 'inherit'
};

export default FirmManagement;
