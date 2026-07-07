import React, { useState } from 'react';
import './Form.css'; // Kita akan gunakan CSS yang sama untuk Login & Register

const RegisterPage = () => {
  // State untuk menampung data dari setiap inputan form
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    role: 'pembeli', // Nilai default
  });

  // Fungsi ini akan dijalankan setiap kali ada perubahan pada input form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi ini akan dijalankan saat tombol "Daftar" diklik
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah form untuk reload halaman
    console.log('Data yang akan dikirim:', formData);
    // Nanti di sini kita akan panggil API backend
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Daftar Akun Baru</h2>
        <div className="form-group">
          <label>Nama Lengkap</label>
          <input type="text" name="nama_lengkap" onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Saya ingin mendaftar sebagai:</label>
          <select name="role" onChange={handleInputChange}>
            <option value="pembeli">Pembeli</option>
            <option value="dapur">Dapur</option>
          </select>
        </div>
        <button type="submit">Daftar</button>
      </form>
    </div>
  );
};

export default RegisterPage;