import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';
import './Dashboard.css';
import './DapurDetailPage.css';

// Komponen input quantity yang sudah pintar
const QuantityInput = ({ onAddToCart, isMenuBesar }) => {
  const minOrder = isMenuBesar ? 1 : 20;
  const [quantity, setQuantity] = useState(minOrder);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantity(numValue);
    }
  };

  const handleBlur = () => {
    if (quantity === '' || quantity < minOrder) {
      setQuantity(minOrder);
    }
  };

  const handleAdd = () => {
    if (quantity < minOrder) {
      alert(`Minimal pesanan adalah ${minOrder} porsi.`);
      return;
    }
    onAddToCart(quantity);
  };

  return (
    <div className="quantity-control" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        onClick={() => setQuantity(q => Math.max(minOrder, q - 1))}
        style={{ padding: '5px 10px', cursor: 'pointer' }}
      >-</button>
      
      <input 
        type="number" 
        value={quantity} 
        onChange={handleInputChange} 
        onBlur={handleBlur}
        style={{ width: '60px', textAlign: 'center', padding: '5px' }}
      />
      
      <button 
        onClick={() => setQuantity(q => (q === '' ? minOrder : q + 1))}
        style={{ padding: '5px 10px', cursor: 'pointer' }}
      >+</button>
      
      <button className="order-button" onClick={handleAdd}>
        Pesan 🛒
      </button>
    </div>
  );
};


const DapurDetailPage = () => {
  const { id } = useParams();
  const [dapur, setDapur] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);

  const fetchDapurDetail = async () => {
    try {
      const config = {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      };
      const response = await axios.get(`http://localhost:5001/api/pembeli/dapurs/${id}`, config);
      setDapur(response.data);
    } catch (error) {
      console.error('Failed to fetch kitchen details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDapurDetail();
  }, [id]);

  const handleAdminDeleteMenu = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`http://localhost:5001/api/admin/menus/${menuId}`, config);
            showNotification('Menu deleted successfully.', 'success');
            fetchDapurDetail(); 
        } catch (error) {
            showNotification('Failed to delete menu.', 'error');
        }
    }
  }

  if (loading) return <p>Memuat...</p>;
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
            <div key={menu.id} className="menu-item-interactive">
              <img src={menu.foto_menu || 'https://placehold.co/100x100/FFDAB9/FF6347?text=CATring!'} alt={menu.nama_menu} className="menu-image"/>
              <div className="menu-details">
                <h4>{menu.nama_menu}</h4>
                
                {/* Badge Penanda Menu Besar/Reguler */}
                <span style={{ 
                  fontSize: '0.8rem', padding: '3px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '5px',
                  backgroundColor: menu.is_menu_besar ? '#FFEDD5' : '#E0E7FF',
                  color: menu.is_menu_besar ? '#C2410C' : '#4338CA'
                }}>
                  {menu.is_menu_besar ? '👑 Menu Besar (Min. 1)' : '🍱 Menu Reguler (Min. 20)'}
                </span>

                <p>{menu.deskripsi_menu || 'Tidak ada deskripsi menu.'}</p>
                
                {/* Label harga diubah */}
                <p>Rp {Number(menu.harga).toLocaleString('id-ID')} / porsi</p>
              </div>

              {user?.role === 'admin' ? (
                <button className="delete-button-menu" onClick={() => handleAdminDeleteMenu(menu.id)}>
                  Hapus Menu
                </button>
              ) : (
                <QuantityInput 
                  onAddToCart={(quantity) => addToCart(menu, quantity)} 
                  isMenuBesar={menu.is_menu_besar} 
                />
              )}
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