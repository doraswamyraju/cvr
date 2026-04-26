import React, { useState, useEffect } from 'react';

const IncomingRegister = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sender_name: '',
    received_by: '',
    description: '',
    status: 'received'
  });

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const response = await fetch(`/api/incoming.php?firm_id=${user?.firm_id || 1}`);
      const data = await response.json();
      if (data.status === 'success') {
        setEntries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const payload = { ...formData, firm_id: user?.firm_id || 1 };
      
      const response = await fetch('/api/incoming.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setShowModal(false);
        fetchEntries();
        setFormData({
          date: new Date().toISOString().split('T')[0],
          sender_name: '',
          received_by: '',
          description: '',
          status: 'received'
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving entry', error);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received': return <span className="badge badge-info">Received</span>;
      case 'processed': return <span className="badge badge-warning">Processed</span>;
      case 'delivered': return <span className="badge badge-success">Delivered</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>Incoming Register</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track all incoming documents and packages</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Entry</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender Name</th>
                  <th>Received By</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.length > 0 ? entries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td style={{ fontWeight: 600 }}>{entry.sender_name}</td>
                    <td>{entry.received_by}</td>
                    <td>{entry.description}</td>
                    <td>{getStatusBadge(entry.status)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No entries found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div className="card animate-fade-in" style={modalStyle}>
            <h3>Add Incoming Entry</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={gridStyle}>
                <div className="input-group">
                  <label className="label">Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label className="label">Sender Name *</label>
                  <input type="text" name="sender_name" value={formData.sender_name} onChange={handleInputChange} required placeholder="Who sent it?" />
                </div>
                <div className="input-group">
                  <label className="label">Received By</label>
                  <input type="text" name="received_by" value={formData.received_by} onChange={handleInputChange} placeholder="Who received it?" />
                </div>
                <div className="input-group">
                  <label className="label">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="received">Received</option>
                    <option value="processed">Processed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Description / Notes</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Additional details..."></textarea>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
  backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
};

const modalStyle = {
  width: '500px', maxWidth: '95vw'
};

const gridStyle = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'
};

export default IncomingRegister;
