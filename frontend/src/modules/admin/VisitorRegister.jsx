import React, { useState, useEffect } from 'react';

const VisitorRegister = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    visitor_name: '',
    purpose: '',
    entry_time: '',
    exit_time: ''
  });

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const response = await fetch(`/api/visitors.php?firm_id=${user?.firm_id || 1}`);
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
      
      const response = await fetch('/api/visitors.php', {
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
          visitor_name: '',
          purpose: '',
          entry_time: '',
          exit_time: ''
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving entry', error);
    }
    setLoading(false);
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>Visitor Register</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Log all office visitors and their purpose</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Visitor</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Visitor Name</th>
                  <th>Purpose</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.length > 0 ? entries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td style={{ fontWeight: 600 }}>{entry.visitor_name}</td>
                    <td>{entry.purpose}</td>
                    <td>{entry.entry_time || '-'}</td>
                    <td>{entry.exit_time || '-'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No visitors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div className="card animate-fade-in" style={modalStyle}>
            <h3>Add Visitor Entry</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={gridStyle}>
                <div className="input-group">
                  <label className="label">Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label className="label">Visitor Name *</label>
                  <input type="text" name="visitor_name" value={formData.visitor_name} onChange={handleInputChange} required placeholder="Full Name" />
                </div>
                <div className="input-group">
                  <label className="label">Entry Time</label>
                  <input type="time" name="entry_time" value={formData.entry_time} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label className="label">Exit Time</label>
                  <input type="time" name="exit_time" value={formData.exit_time} onChange={handleInputChange} />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Purpose of Visit</label>
                  <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="Reason for visit..." />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Visitor'}
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

export default VisitorRegister;
