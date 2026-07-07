import React, { useState, useEffect, useContext, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import './DapurOrdersPage.css';

const DapurOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pindahkan fetchOrders ke luar useEffect dan bungkus dengan useCallback
  const fetchOrders = useCallback(async () => {
    if (!user) return; // Pastikan user ada sebelum fetch
    setLoading(true); // Set loading true saat memulai fetch
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5001/api/dapur/orders', config);
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      showNotification('Gagal mengambil data pesanan.', 'error');
    } finally {
      setLoading(false); // Set loading false setelah selesai
    }
  }, [user, showNotification]); // Tambahkan user dan showNotification ke dependency array

  // Panggil fetchOrders saat komponen dimuat atau user berubah
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Tambahkan fetchOrders ke dependency array

  // Fungsi untuk mengubah status pesanan
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      };
      await axios.put(`http://localhost:5001/api/dapur/orders/${orderId}/status`, { status: newStatus }, config);
      showNotification(`Status pesanan #${orderId} berhasil diubah menjadi ${newStatus}.`, 'success');
      fetchOrders(); // Panggil fetchOrders untuk me-refresh daftar pesanan
    } catch (error) {
      console.error("Gagal mengubah status pesanan:", error);
      showNotification('Gagal mengubah status pesanan.', 'error');
    }
  };

  if (loading) {
    return (
        <div className="orders-page-container">
            <h1>Pesanan Masuk</h1>
            <p>Memuat pesanan...</p>
        </div>
    );
  }

  return (
    <div className="orders-page-container">
      <h1>Pesanan Masuk</h1>
      {orders.length === 0 ? (
        <p>Belum ada pesanan yang masuk.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <strong>Pesanan #{order.id}</strong>
                  <span className={`order-status ${order.status.toLowerCase().replace(/\s/g, '')}`} style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', backgroundColor: order.status === 'Menunggu Konfirmasi' ? '#ffc107' : order.status === 'Diproses' ? '#17a2b8' : order.status === 'Diantarkan' ? '#6c757d' : order.status === 'Selesai' ? '#28a745' : '#dc3545', color: 'white' }}>{order.status}</span>
                </div>
                <span>{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="order-card-body">
                <p><strong>Pemesan:</strong> {order.pembeli.nama_lengkap}</p>
                <p><strong>Kontak:</strong> {order.pembeli.no_hp || 'Tidak ada'}</p>
                <p><strong>Alamat Pengiriman:</strong> {order.alamat_pengiriman || 'Tidak ada alamat.'}</p>
                <p><strong>Tanggal Pengiriman:</strong> {new Date(order.delivery_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Jam Pengiriman:</strong> {order.delivery_time || 'Tidak ada jam.'}</p>
                <p><strong>Catatan:</strong> {order.catatan || 'Tidak ada catatan.'}</p>
                <strong>Item yang dipesan:</strong>
                <ul>
                  {order.OrderItems.map((item, index) => (
                    <li key={index}>{item.nama_menu_saat_order} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
              <div className="order-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <strong>Total: Rp {Number(order.total_harga).toLocaleString('id-ID')}</strong>
                <div className="status-actions">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                  >
                    <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Diantarkan">Diantarkan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DapurOrdersPage;
