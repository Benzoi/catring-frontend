import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Form.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      login(response.data);
      showNotification('Login berhasil!', 'success');
      
      const userRole = response.data.role;
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'dapur') navigate('/dapur');
      else navigate('/');

    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat login.';
      showNotification(message, 'error');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {/* Tambahkan link di bawah form */}
      <p className="form-link-text">
        Belum punya akun? <Link to="/register">Yuk, daftar!</Link>
      </p>
    </div>
  );
};

export default LoginPage;
