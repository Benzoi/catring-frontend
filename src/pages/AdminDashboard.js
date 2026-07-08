// src/pages/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { ConfirmationContext } from '../context/ConfirmationContext';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const { showConfirmation } = useContext(ConfirmationContext);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true); // Ubah nama state loading
  const [adminOrders, setAdminOrders] = useState([]); // State baru untuk pesanan admin
  const [loadingOrders, setLoadingOrders] = useState(true); // State loading untuk pesanan
  const [activeTab, setActiveTab] = useState('dapur'); // State untuk tab aktif: 'dapur', 'pembeli', 'admin', 'orders'

  // Fungsi untuk mengambil semua data user
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, config);
      setUsers(data);
    } catch (error) {
      console.error('Gagal mengambil data pengguna:', error);
      showNotification('Gagal mengambil data pengguna.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fungsi untuk mengambil semua data pesanan untuk admin
  const fetchAdminOrders = async () => {
    setLoadingOrders(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Endpoint baru yang perlu kita buat di backend
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`, config);
      setAdminOrders(data);
    } catch (error) {
      console.error('Gagal mengambil data pesanan admin:', error);
      showNotification('Gagal mengambil data pesanan admin.', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Jalankan saat komponen dimuat atau user berubah
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  // Jalankan saat tab berubah ke 'orders'
  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'orders') {
      fetchAdminOrders();
    }
  }, [user, activeTab]);

  // Fungsi untuk menghapus user
  const handleDeleteUser = async (userId, userName) => {
    showConfirmation(
      `Apakah Anda yakin ingin menghapus pengguna ${userName}?`,
      async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.delete(`http://5001/api/admin/users/${userId}`, config);
          showNotification('Pengguna berhasil dihapus.', 'success');
          fetchUsers();
        } catch (error) {
          showNotification('Gagal menghapus pengguna.', 'error');
          console.error('Error saat menghapus:', error);
        }
      }
    );
  };

  // Pisahkan user berdasarkan peran
  const dapurUsers = users.filter(u => u.role === 'dapur');
  const pembeliUsers = users.filter(u => u.role === 'pembeli');
  const adminUsers = users.filter(u => u.role === 'admin');

  return (
    <div className="dashboard-container">
      <h1>Dashboard Admin</h1>
      <p>Manajemen Sistem Katering</p>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '20px', borderBottom: '1px solid #eee' }}>
        <button 
          className={`tab-button ${activeTab === 'dapur' ? 'active' : ''}`} 
          onClick={() => setActiveTab('dapur')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: activeTab === 'dapur' ? '2px solid #FF6347' : 'none', fontWeight: activeTab === 'dapur' ? 'bold' : 'normal' }}
        >
          Pengguna Dapur
        </button>
        <button 
          className={`tab-button ${activeTab === 'pembeli' ? 'active' : ''}`} 
          onClick={() => setActiveTab('pembeli')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: activeTab === 'pembeli' ? '2px solid #FF6347' : 'none', fontWeight: activeTab === 'pembeli' ? 'bold' : 'normal' }}
        >
          Pengguna Pembeli
        </button>
        {adminUsers.length > 0 && (
          <button 
            className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`} 
            onClick={() => setActiveTab('admin')}
            style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: activeTab === 'admin' ? '2px solid #FF6347' : 'none', fontWeight: activeTab === 'admin' ? 'bold' : 'normal' }}
          >
            Pengguna Admin
          </button>
        )}
        {/* Tab baru untuk Pesanan */}
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} 
          onClick={() => setActiveTab('orders')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: activeTab === 'orders' ? '2px solid #FF6347' : 'none', fontWeight: activeTab === 'orders' ? 'bold' : 'normal' }}
        >
          Semua Pesanan
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'dapur' && (
          <div className="list-section">
            <h2>Pengguna Dapur ({dapurUsers.length})</h2>
            {loadingUsers ? <p>Memuat pengguna dapur...</p> : dapurUsers.length === 0 ? (
              <p>Tidak ada pengguna dapur terdaftar.</p>
            ) : (
              <div className="user-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Lengkap</th>
                      <th>Email</th>
                      <th>No. HP</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dapurUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nama_lengkap}</td>
                        <td>{u.email}</td>
                        <td>{u.no_hp || '-'}</td>
                        <td>
                          <button 
                            className="delete-button" 
                            onClick={() => handleDeleteUser(u.id, u.nama_lengkap)}
                            disabled={u.id === user.id}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pembeli' && (
          <div className="list-section">
            <h2>Pengguna Pembeli ({pembeliUsers.length})</h2>
            {loadingUsers ? <p>Memuat pengguna pembeli...</p> : pembeliUsers.length === 0 ? (
              <p>Tidak ada pengguna pembeli terdaftar.</p>
            ) : (
              <div className="user-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Lengkap</th>
                      <th>Email</th>
                      <th>No. HP</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pembeliUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nama_lengkap}</td>
                        <td>{u.email}</td>
                        <td>{u.no_hp || '-'}</td>
                        <td>
                          <button 
                            className="delete-button" 
                            onClick={() => handleDeleteUser(u.id, u.nama_lengkap)}
                            disabled={u.id === user.id}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && adminUsers.length > 0 && (
          <div className="list-section">
            <h2>Pengguna Admin ({adminUsers.length})</h2>
            {loadingUsers ? <p>Memuat pengguna admin...</p> : (
              <div className="user-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Lengkap</th>
                      <th>Email</th>
                      <th>No. HP</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nama_lengkap}</td>
                        <td>{u.email}</td>
                        <td>{u.no_hp || '-'}</td>
                        <td>
                          <button 
                            className="delete-button" 
                            onClick={() => handleDeleteUser(u.id, u.nama_lengkap)}
                            disabled={u.id === user.id} 
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Konten untuk Tab Semua Pesanan */}
        {activeTab === 'orders' && (
          <div className="list-section">
            <h2>Semua Pesanan ({adminOrders.length})</h2>
            {loadingOrders ? <p>Memuat semua pesanan...</p> : adminOrders.length === 0 ? (
              <p>Belum ada pesanan dalam sistem.</p>
            ) : (
              <div className="orders-list-admin" style={{ maxHeight: '500px', overflowY: 'auto' }}> {/* Tambahkan scroll jika banyak pesanan */}
                {adminOrders.map(order => (
                  <div key={order.id} className="order-card" style={{ marginBottom: '15px', border: '1px solid #eee', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div className="order-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <strong>Pesanan #{order.id}</strong>
                        <span className={`order-status ${order.status.toLowerCase()}`} style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', backgroundColor: order.status === 'Menunggu Konfirmasi' ? '#ffc107' : order.status === 'Selesai' ? '#28a745' : '#17a2b8', color: 'white' }}>{order.status}</span>
                      </div>
                      <span>{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="order-card-body">
                      <p><strong>Dapur:</strong> {order.dapur ? order.dapur.nama_dapur : 'N/A'}</p>
                      <p><strong>Pemesan:</strong> {order.pembeli ? order.pembeli.nama_lengkap : 'N/A'}</p>
                      <p><strong>Kontak Pembeli:</strong> {order.pembeli ? (order.pembeli.no_hp || 'Tidak ada') : 'N/A'}</p>
                      <p><strong>Alamat Pengiriman:</strong> {order.alamat_pengiriman || 'Tidak ada alamat.'}</p>
                      <p><strong>Tanggal Pengiriman:</strong> {new Date(order.delivery_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Jam Pengiriman:</strong> {order.delivery_time || 'Tidak ada jam.'}</p>
                      <p><strong>Catatan:</strong> {order.catatan || 'Tidak ada catatan.'}</p>
                      <strong>Item yang dipesan:</strong>
                      <ul>
                        {order.OrderItems && order.OrderItems.length > 0 ? (
                          order.OrderItems.map((item, index) => (
                            <li key={index}>{item.nama_menu_saat_order} (x{item.quantity})</li>
                          ))
                        ) : (
                          <li>Tidak ada item.</li>
                        )}
                      </ul>
                    </div>
                    <div className="order-card-footer" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', textAlign: 'right' }}>
                      <strong>Total: Rp {Number(order.total_harga).toLocaleString('id-ID')}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
