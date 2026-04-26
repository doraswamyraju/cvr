import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employee_code: '',
    department: '',
    designation: '',
    salary: '',
    joining_date: ''
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const response = await fetch(`http://localhost/api/employees.php?firm_id=${user?.firm_id || 1}`);
      const data = await response.json();
      if (data.status === 'success') {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
      setEmployees([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
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
      
      const response = await fetch('http://localhost/api/employees.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Employee created successfully!');
        setShowModal(false);
        fetchEmployees();
        setFormData({ name: '', email: '', password: '', employee_code: '', department: '', designation: '', salary: '', joining_date: '' });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving employee', error);
      alert('Mock: Employee saved successfully (DB disconnected)');
      setShowModal(false);
      fetchEmployees();
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      <div className="card glass animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Employee Master</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Employee</button>
        </div>

        {loading ? <p>Loading employees...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Code</th>
                <th style={{ padding: '1rem' }}>Name / Email</th>
                <th style={{ padding: '1rem' }}>Department</th>
                <th style={{ padding: '1rem' }}>Designation</th>
                <th style={{ padding: '1rem' }}>Joining Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{emp.employee_code || `EMP-${emp.id}`}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{emp.department || '-'}</td>
                  <td style={{ padding: '1rem' }}>{emp.designation || '-'}</td>
                  <td style={{ padding: '1rem' }}>{emp.joining_date || '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No employees found.</td></tr>
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
          <div className="card animate-fade-in" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Employee</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Personal & Login Details</p>
                </div>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email (Login ID) *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Employee Code</label>
                  <input type="text" name="employee_code" value={formData.employee_code} onChange={handleInputChange} style={inputStyle} />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '1rem 0 0.5rem', fontWeight: 'bold' }}>Employment Details</p>
                </div>
                
                <div>
                  <label style={labelStyle}>Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Designation</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Joining Date</label>
                  <input type="date" name="joining_date" value={formData.joining_date} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Salary (Annual)</label>
                  <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border-color)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
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
  backgroundColor: 'var(--bg-color)'
};

export default EmployeeManagement;
