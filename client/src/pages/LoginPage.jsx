// /client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- Style Objects (Keep these as they are) ---
const containerStyle = {
  maxWidth: '400px',
  margin: '100px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontFamily: 'sans-serif',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
};
const disabledButtonStyle = { // <-- NEW: Style for the disabled button
  ...buttonStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed',
};
const errorStyle = { color: 'red', textAlign: 'center', marginBottom: '10px' };
// --- End Style Objects ---

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <-- 1. ADD LOADING STATE
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // <-- 2. SET LOADING TO TRUE

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/admin'); // Redirect to the admin dashboard
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false); // <-- 3. SET LOADING BACK TO FALSE
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            type="email"
            id="email"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading} // <-- 4. DISABLE INPUTS WHILE LOADING
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            type="password"
            id="password"
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading} // <-- 4. DISABLE INPUTS WHILE LOADING
          />
        </div>
        {error && <p style={errorStyle}>{error}</p>}
        <button 
          type="submit" 
          style={loading ? disabledButtonStyle : buttonStyle} // <-- 5. CHANGE STYLE BASED ON LOADING
          disabled={loading} // <-- 5. DISABLE BUTTON WHILE LOADING
        >
          {loading ? 'Signing in...' : 'Login'} {/* <-- 5. CHANGE TEXT BASED ON LOADING */}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;