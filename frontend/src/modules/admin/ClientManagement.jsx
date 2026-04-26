import React, { useState, useEffect } from 'react';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    status: 'active',
    services: []
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      // In production, pass the token and the backend will extract firm_id.
      // Here we just mock or pass firm_id for demonstration if needed.
      
      const response = await fetch(`http://localhost/api/clients.php?firm_id=${user?.firm_id || 1}`);
      const data = await response.json();
      if (data.status === 'success') {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
      setClients([
        { id: 1, company_name: 'TechCorp Solutions', contact_person: 'Alice Smith', email: 'alice@techcorp.com', phone: '123-456-7890', status: 'active' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, services: [...prev.services, value] }));
    } else {
      setFormData(prev => ({ ...prev, services: prev.services.filter(s => s !== value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const payload = { ...formData, firm_id: user?.firm_id || 1 };
      
      const response = await fetch('http://localhost/api/clients.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Client saved successfully!');
        setView('list');
        fetchClients();
        setFormData({ company_name: '', contact_person: '', email: '', phone: '', address: '', industry: '', status: 'active', services: [] });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving client', error);
      alert('Mock: Client saved successfully (DB disconnected)');
      setView('list');
      fetchClients();
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      {view === 'list' ? (
        <div className="card glass animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Client Master</h2>
            <button className="btn btn-primary" onClick={() => setView('form')}>+ Add New Client</button>
          </div>

          {loading ? <p>Loading clients...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Company Name</th>
                  <th style={{ padding: '1rem' }}>Contact Person</th>
                  <th style={{ padding: '1rem' }}>Email / Phone</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? clients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{client.id}</td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{client.company_name}</td>
                    <td style={{ padding: '1rem' }}>{client.contact_person}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem' }}>{client.email}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{client.phone}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem',
                        backgroundColor: client.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: client.status === 'active' ? '#166534' : '#991b1b'
                      }}>
                        {client.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No clients found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{formData.id ? 'Edit Client' : 'Add New Client'}</h2>
            <button className="btn" onClick={() => setView('list')} style={{ border: '1px solid var(--border-color)' }}>Back to List</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
              <div 
                onClick={() => setActiveTab('general')} 
                style={{ ...tabStyle, borderBottom: activeTab === 'general' ? '2px solid var(--primary-color)' : 'none', color: activeTab === 'general' ? 'var(--primary-color)' : 'inherit' }}
              >General Info</div>
              <div 
                onClick={() => setActiveTab('contact')} 
                style={{ ...tabStyle, borderBottom: activeTab === 'contact' ? '2px solid var(--primary-color)' : 'none', color: activeTab === 'contact' ? 'var(--primary-color)' : 'inherit' }}
              >Contact Details</div>
              <div 
                onClick={() => setActiveTab('services')} 
                style={{ ...tabStyle, borderBottom: activeTab === 'services' ? '2px solid var(--primary-color)' : 'none', color: activeTab === 'services' ? 'var(--primary-color)' : 'inherit' }}
              >Services Opted</div>
            </div>

            {/* Form Content */}
            <div style={{ padding: '2rem' }}>
              
              {/* General Tab */}
              <div style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Company Name *</label>
                    <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Tab */}
              <div style={{ display: activeTab === 'contact' ? 'block' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Primary Contact Person</label>
                    <input type="text" name="contact_person" value={formData.contact_person} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Primary Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Billing/Office Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} style={{...inputStyle, height: '80px', resize: 'vertical'}} />
                  </div>
                </div>
              </div>

              {/* Services Tab */}
              <div style={{ display: activeTab === 'services' ? 'block' : 'none' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Select the services this client is enrolled in:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Tax Filing', 'Audit', 'Payroll Processing', 'Bookkeeping', 'Legal Advisory'].map(service => (
                    <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        value={service} 
                        checked={formData.services.includes(service)}
                        onChange={handleServiceChange}
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
            
            {/* Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--bg-color)' }}>
              <button type="button" className="btn" onClick={() => setView('list')} style={{ border: '1px solid var(--border-color)' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const tabStyle = {
  padding: '1rem 1.5rem',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.95rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  color: 'var(--text-secondary)'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  outline: 'none',
  fontFamily: 'inherit',
  backgroundColor: 'var(--surface-color)'
};

export default ClientManagement;
