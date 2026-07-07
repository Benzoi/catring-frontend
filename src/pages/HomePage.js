import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; 
import maskotImg from './maskot.png';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Nantinya ini bisa disambungkan ke fitur pencarian sungguhan
    navigate('/dapurs'); 
  };

  return (
    <div className="home-container">
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">CATring! 🐾</h1>
          <p className="hero-subtitle">
            Masakan rumahan premium, diantar secepat kilat dengan kualitas higienis terjamin.
          </p>
          <h2 className="hero-question">Mau pesan apa hari ini?</h2>

          <form className="search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Cari nasi kotak, tumpeng, atau nama dapur..." 
              className="search-input" 
            />
            <button type="submit" className="search-button">
              🔍 Cari
            </button>
          </form>
        </div>

        <div className="hero-image-container">
          <img src={maskotImg} alt="Maskot CATring Koki" className="hero-mascot" />
        </div>
      </section>

      {/* --- POPULAR KITCHENS SECTION --- */}
      <section className="popular-section">
        <h3 className="section-title">Dapur Terpopuler Minggu Ini 🌟</h3>
        
        <div className="kitchen-grid">
          {/* Kartu Dummy 1 */}
          <div className="kitchen-card" onClick={() => navigate('/dapurs')}>
            <div className="kitchen-image bg-gradient-1"></div>
            <div className="kitchen-info">
              <h4>Dapur Ibu Ani</h4>
              <p className="rating">⭐ 4.9 (120 ulasan)</p>
              <span className="badge">Higienis Terverifikasi</span>
            </div>
          </div>

          {/* Kartu Dummy 2 */}
          <div className="kitchen-card" onClick={() => navigate('/dapurs')}>
            <div className="kitchen-image bg-gradient-2"></div>
            <div className="kitchen-info">
              <h4>Healthy Bite Catering</h4>
              <p className="rating">⭐ 4.8 (85 ulasan)</p>
              <span className="badge diet-badge">Spesialis Diet</span>
            </div>
          </div>

          {/* Kartu Dummy 3 */}
          <div className="kitchen-card" onClick={() => navigate('/dapurs')}>
            <div className="kitchen-image bg-gradient-3"></div>
            <div className="kitchen-info">
              <h4>Rasa Nusantara</h4>
              <p className="rating">⭐ 4.9 (200 ulasan)</p>
              <span className="badge premium-badge">Nasi Kotak Premium</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;