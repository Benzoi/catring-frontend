import React, { useState, useContext } from 'react';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Form.css';

const RegisterPage = () => {
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    role: 'pembeli',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/auth/register', formData);
      showNotification('Registrasi berhasil! Silakan login.', 'success');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
      showNotification(message, 'error');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Daftar Akun Baru</h2>
        {/* ... (semua form-group tidak berubah) ... */}
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Saya ingin mendaftar sebagai:</label>
          <select name="role" value={formData.role} onChange={handleInputChange}>
            <option value="pembeli">Pembeli</option>
            <option value="dapur">Dapur</option>
          </select>
        </div>
        <button type="submit">Daftar</button>
      </form>
      {/* Tambahkan link di bawah form */}
      <p className="form-link-text">
        Sudah punya akun? <Link to="/login">Login aja!</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
