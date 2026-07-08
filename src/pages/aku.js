// src/pages/DapurDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook untuk mengambil ID dari URL
import axios from 'axios';
import './Dashboard.css'; // Kita bisa pakai style yang sama

const DapurDetailPage = () => {
  const { id } = useParams(); // Ambil ID dapur dari URL
  const [dapur, setDapur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDapurDetail = async () => {
      try {
        // Panggil API untuk mendapatkan detail satu dapur berdasarkan ID
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pembeli/dapurs/${id}`);
        setDapur(response.data);
      } catch (error) {
        console.error('Gagal mengambil detail dapur', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDapurDetail();
  }, [id]); // Jalankan lagi jika ID berubah

  if (loading) return <p>Loading...</p>;
  if (!dapur) return <p>Dapur tidak ditemukan.</p>;

  return (
    <div className="dashboard-container">
      <h1>{dapur.nama_dapur}</h1>
      <p>{dapur.deskripsi || 'Tidak ada deskripsi.'}</p>
      <p><strong>Alamat:</strong> {dapur.alamat || 'Tidak ada alamat.'}</p>

      <div className="list-section" style={{ marginTop: '2rem' }}>
        <h3>Menu yang Tersedia</h3>
        {dapur.Menus && dapur.Menus.length > 0 ? (
          dapur.Menus.map((menu) => (
            <div key={menu.id} className="menu-item">
              <h4>{menu.nama_menu}</h4>
              <p>Rp {Number(menu.harga_5_porsi).toLocaleString('id-ID')} / 5 porsi</p>
            </div>
          ))
        ) : (
          <p>Dapur ini belum memiliki menu.</p>
        )}
      </div>
    </div>
  );
};

export default DapurDetailPage;