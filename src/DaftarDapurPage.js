import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DaftarDapurPage.css';

const DaftarDapurPage = () => {
  const [dapurs, setDapurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDapurs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pembeli/dapurs`);
        setDapurs(response.data);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDapurs();
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat data dapur...</p>;
  }

  return (
    <div className="dapur-list-container">
      <h1>Dapur Katering yang Terdaftar</h1>
      <div className="dapur-grid">
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
