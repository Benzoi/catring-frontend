import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DaftarDapurPage.css';

const DaftarDapurPage = () => {
  const [dapurs, setDapurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State baru untuk istilah pencarian

  // Fungsi untuk mengambil semua data dapur, sekarang dengan parameter pencarian
  const fetchDapurs = async (term = '') => {
    setLoading(true); // Set loading true setiap kali fetch dimulai
    try {
      // Tambahkan parameter query 'search' ke URL
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pembeli/dapurs?search=${term}`);
      setDapurs(response.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan saat komponen dimuat atau searchTerm berubah
  useEffect(() => {
    // Debounce search input untuk menghindari terlalu banyak request
    const delayDebounceFn = setTimeout(() => {
      fetchDapurs(searchTerm);
    }, 500); // Tunda 500ms setelah user berhenti mengetik

    return () => clearTimeout(delayDebounceFn); // Cleanup timer
  }, [searchTerm]); // Panggil ulang saat searchTerm berubah

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="dapur-list-container">
        <h1>Dapur Katering yang Terdaftar</h1>
        <div className="search-bar-container" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Cari dapur atau menu..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <p>Memuat data dapur...</p>
      </div>
    );
  }

  return (
    <div className="dapur-list-container">
      <h1>Dapur Katering yang Terdaftar</h1>
      
      {/* Search Bar */}
      <div className="search-bar-container" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Cari dapur atau menu..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div className="dapur-grid">
        {dapurs.length === 0 && !loading && (
          <p>Tidak ada dapur yang ditemukan.</p>
        )}
        {dapurs.map(dapur => (
          <Link to={`/dapurs/${dapur.id}`} key={dapur.id} className="dapur-card-link">
            <div className="dapur-card">
              <h3>{dapur.nama_dapur}</h3>
              <p>{dapur.alamat || 'Alamat belum diatur'}</p>
              <small>Oleh: {dapur.User ? dapur.User.nama_lengkap : 'Admin'}</small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DaftarDapurPage;
