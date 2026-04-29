import React, { useState, useEffect } from 'react';

const MasterManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMaster, setActiveMaster] = useState('bank');
  const [showModal, setShowModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ id: '', name: '', status: 'active' });

  const masterTypes = [
    { id: 'bank', name: 'Banks', icon: '🏦' },
    { id: 'area', name: 'Areas', icon: '📍' },
    { id: 'unit', name: 'Units', icon: '📏' },
    { id: 'department', name: 'Departments', icon: '🏢' },
    { id: 'designation', name: 'Designations', icon: '🎖️' },
    { id: 'service_group', name: 'Service Groups', icon: '📁' },
    { id: 'service_category', name: 'Service Categories', icon: '🏷️' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'occupation', name: 'Occupations', icon: '💼' },
    { id: 'religion', name: 'Religion/Caste', icon: '🛐' },
    { id: 'relation', name: 'Relations', icon: '👨‍👩‍👧' }
  ];

  const fetchItems = async (type) => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const firmId = user?.firm_id || 1;
      
      const response = await fetch(`http://localhost:8000/api/masters.php?type=${type}&firm_id=${firmId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setItems(data.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch master items', error);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(activeMaster);
  }, [activeMaster]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const firmId = user?.firm_id || 1;

      const method = currentEntry.id ? 'PUT' : 'POST';
      const payload = { ...currentEntry, firm_id: firmId };

      const response = await fetch(`http://localhost:8000/api/masters.php?type=${activeMaster}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setShowModal(false);
        setCurrentEntry({ id: '', name: '', status: 'active' });
        fetchItems(activeMaster);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving entry', error);
      alert('Failed to save. Check API connection.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/masters.php?type=${activeMaster}&id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchItems(activeMaster);
      }
    } catch (error) {
      console.error('Error deleting entry', error);
    }
  };

  const openEdit = (item) => {
    setCurrentEntry(item);
    setShowModal(true);
  };

  return (
    <div className="module-container" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem' }}>
      
      {/* Sidebar for Master Types */}
      <div className="card glass" style={{ padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Master Types</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {masterTypes.map(m => (
            <div 
              key={m.id}
              onClick={() => setActiveMaster(m.id)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: activeMaster === m.id ? 'var(--primary-color)' : 'transparent',
                color: activeMaster === m.id ? 'white' : 'inherit',
                transition: 'all 0.2s'
              }}
            >
              <span>{m.icon}</span>
              <span style={{ fontSize: '0.9rem' }}>{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{masterTypes.find(m => m.id === activeMaster)?.name} Management</h2>
          <button className="btn btn-primary" onClick={() => { setCurrentEntry({ id: '', name: '', status: 'active' }); setShowModal(true); }}>
            + Add New
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{item.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem',
                      backgroundColor: item.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: item.status === 'active' ? '#166534' : '#991b1b'
                    }}>
                      {item.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn" onClick={() => openEdit(item)} style={{ padding: '0.4rem 0.6rem', marginRight: '0.5rem', fontSize: '0.85rem' }}>Edit</button>
                    <button className="btn" onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.6rem', color: '#dc2626', fontSize: '0.85rem' }}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No entries found for this master.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card animate-fade-in" style={{ width: '400px', padding: '1.5rem' }}>
            <h3>{currentEntry.id ? 'Edit Entry' : 'Add New Entry'}</h3>
            <form onSubmit={handleSave} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name</label>
                <input 
                  type="text" 
                  value={currentEntry.name} 
                  onChange={(e) => setCurrentEntry({...currentEntry, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  placeholder="Enter name..."
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Status</label>
                <select 
                  value={currentEntry.status} 
                  onChange={(e) => setCurrentEntry({...currentEntry, status: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterManagement;
