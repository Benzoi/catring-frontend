import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { ConfirmationContext } from '../context/ConfirmationContext';
import './Dashboard.css';

const DapurDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const { showConfirmation } = useContext(ConfirmationContext);
  
  // State baru untuk penanda menu besar atau reguler (Tumpeng vs Nasi Kotak)
  const [isMenuBesar, setIsMenuBesar] = useState(false);
  
  const [myMenus, setMyMenus] = useState([]);
  const [formData, setFormData] = useState({
    nama_menu: '',
    deskripsi_menu: '',
    harga: '', // Sudah diubah dari harga_5_porsi
  });
  const [fotoMenu, setFotoMenu] = useState(null);

  const fetchMyMenus = async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dapur/menus`, config);
      setMyMenus(response.data);
    } catch (error) {
      console.error('Gagal mengambil menu:', error);
    }
  };

  useEffect(() => {
    fetchMyMenus();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFotoMenu(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    dataToSubmit.append('nama_menu', formData.nama_menu);
    dataToSubmit.append('deskripsi_menu', formData.deskripsi_menu);
    dataToSubmit.append('harga', formData.harga);
    
    // FormData hanya bisa mengirim string, jadi kita ubah boolean jadi string "true" / "false"
    dataToSubmit.append('is_menu_besar', String(isMenuBesar));

    if (fotoMenu) {
      dataToSubmit.append('foto_menu', fotoMenu);
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/dapur/menus`, dataToSubmit, config);
      showNotification('Menu berhasil ditambahkan!', 'success');
      
      // Refresh list dan bersihkan form
      fetchMyMenus();
      setFormData({ nama_menu: '', deskripsi_menu: '', harga: '' });
      setIsMenuBesar(false); // Kembalikan dropdown ke default
      setFotoMenu(null);
      document.getElementById('file-input').value = null;
    } catch (error) {
      showNotification('Gagal menambahkan menu.', 'error');
      console.error(error);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    showConfirmation(
      'Apakah Anda yakin ingin menghapus menu ini?',
      async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/dapur/menus/${menuId}`, config);
          showNotification('Menu berhasil dihapus.', 'success');
          fetchMyMenus();
        } catch (error) {
          showNotification('Gagal menghapus menu.', 'error');
          console.error('Error deleting menu:', error);
        }
      }
    );
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Dapur</h1>
      <p>Selamat datang, {user?.nama_lengkap}! Di sini Anda bisa mengelola menu Anda.</p>
      
      <div className="dashboard-content">
        <div className="form-section">
          <h3>Tambah Menu Baru</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Menu</label>
              <input 
                type="text" 
                name="nama_menu" 
                value={formData.nama_menu} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Deskripsi Menu</label>
              <textarea 
                name="deskripsi_menu" 
                value={formData.deskripsi_menu} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Harga per Porsi (Rp)</label>
              <input 
                type="number" 
                name="harga" 
                value={formData.harga} 
                onChange={handleInputChange} 
                placeholder="Contoh: 25000"
                required 
              />
            </div>

            <div className="form-group" style={{ marginTop: '15px', marginBottom: '15px' }}>
              <label>Kategori Porsi Pesanan</label>
              <select 
                value={isMenuBesar} 
                onChange={(e) => setIsMenuBesar(e.target.value === 'true')}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="false">🍱 Menu Reguler (Cth: Nasi Kotak - Min. Order 20)</option>
                <option value="true">👑 Menu Besar (Cth: Tumpeng - Min. Order 1)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Foto Menu</label>
              <input 
                type="file" 
                id="file-input" 
                name="foto_menu" 
                onChange={handleFileChange} 
              />
            </div>
            
            <button type="submit" style={{ width: '100%' }}>Tambah Menu</button>
          </form>
        </div>

        <div className="list-section">
          <h3>Menu Anda</h3>
          {myMenus.length > 0 ? (
            myMenus.map((menu) => (
              <div key={menu.id} className="menu-item-with-image">
                <img 
                  src={menu.foto_menu || 'https://placehold.co/100x100/FFDAB9/FF6347?text=CATring!'} 
                  alt={menu.nama_menu} 
                  className="menu-image"
                />
                <div className="menu-details">
                  <h4>{menu.nama_menu}</h4>
                  {/* Menampilkan label apakah ini menu besar atau reguler */}
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '3px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: menu.is_menu_besar ? '#FFEDD5' : '#E0E7FF',
                    color: menu.is_menu_besar ? '#C2410C' : '#4338CA',
                    display: 'inline-block',
                    marginBottom: '5px'
                  }}>
                    {menu.is_menu_besar ? '👑 Menu Besar' : '🍱 Menu Reguler'}
                  </span>
                  <p>Rp {Number(menu.harga).toLocaleString('id-ID')} / porsi</p>
                </div>
                <button onClick={() => handleDeleteMenu(menu.id)} className="delete-button-dapur">
                  Hapus
                </button>
              </div>
            ))
          ) : (
            <p>Anda belum memiliki menu.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DapurDashboard;