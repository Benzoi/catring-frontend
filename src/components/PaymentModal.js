import React, { useContext, useState } from 'react';
import axios from 'axios';
import { PaymentModalContext } from '../context/PaymentModalContext';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import './ConfirmationModal.css';

const PaymentModal = () => {
  const { isOpen, total, hidePaymentModal } = useContext(PaymentModalContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);

  // State untuk alamat pengiriman, catatan, tanggal pengiriman, dan jam pengiriman
  const [alamatPengiriman, setAlamatPengiriman] = useState('');
  const [catatan, setCatatan] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState(''); // State baru untuk jam pengiriman

  if (!isOpen) {
    return null;
  }

  const handlePayment = async () => {
    try {
      if (!user || !user.token) {
        showNotification('Anda harus login untuk menyelesaikan pesanan.', 'error');
        hidePaymentModal();
        return;
      }

      // Validasi alamat pengiriman
      if (!alamatPengiriman.trim()) {
        showNotification('Alamat pengiriman tidak boleh kosong.', 'error');
        return;
      }

      // Validasi tanggal pengiriman
      if (!deliveryDate) {
        showNotification('Tanggal pengiriman harus dipilih.', 'error');
        return;
      }

      const selectedDate = new Date(deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset waktu ke awal hari untuk perbandingan

      const minDeliveryDate = new Date(today);
      minDeliveryDate.setDate(today.getDate() + 5); // Minimal 5 hari dari sekarang

      if (selectedDate < minDeliveryDate) {
        showNotification('Tanggal pengiriman minimal 5 hari dari sekarang. Beri dapur waktu untuk persiapan, ya!', 'error');
        return;
      }

      // Validasi jam pengiriman
      if (!deliveryTime) {
        showNotification('Jam pengiriman harus dipilih.', 'error');
        return;
      }

      const orderData = {
        cartItems: cartItems.map(item => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
        totalHarga: total,
        alamatPengiriman: alamatPengiriman,
        catatan: catatan,
        deliveryDate: deliveryDate,
        deliveryTime: deliveryTime, // Tambahkan jam pengiriman
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/pembeli/orders`, orderData, config);

      if (response.status === 201) {
        showNotification('Pembayaran berhasil! Pesanan Anda telah dibuat.', 'success');
        clearCart();
        // Reset form setelah sukses
        setAlamatPengiriman('');
        setCatatan('');
        setDeliveryDate('');
        setDeliveryTime(''); // Reset jam pengiriman
      } else {
        showNotification(response.data.message || 'Gagal membuat pesanan. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      console.error("Error saat memproses pembayaran:", error);
      showNotification(error.response?.data?.message || 'Terjadi kesalahan saat memproses pembayaran.', 'error');
    } finally {
      hidePaymentModal();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Konfirmasi Pembayaran</h3>
        <p>Anda akan melakukan pembayaran sebesar:</p>
        <h2 className="payment-total">Rp {total.toLocaleString('id-ID')}</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="alamat">Alamat Pengiriman:</label>
          <input 
            type="text" 
            id="alamat" 
            placeholder="Masukkan alamat lengkap Anda" 
            value={alamatPengiriman} 
            onChange={(e) => setAlamatPengiriman(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="deliveryDate">Tanggal Pengiriman:</label>
          <input 
            type="date" 
            id="deliveryDate" 
            value={deliveryDate} 
            onChange={(e) => setDeliveryDate(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="deliveryTime">Jam Pengiriman:</label>
          <input 
            type="time" 
            id="deliveryTime" 
            value={deliveryTime} 
            onChange={(e) => setDeliveryTime(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="catatan">Catatan (opsional):</label>
          <textarea 
            id="catatan" 
            placeholder="Contoh: Jangan terlalu pedas, antar jam 1 siang" 
            value={catatan} 
            onChange={(e) => setCatatan(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          ></textarea>
        </div>

        <div className="modal-actions">
          <button onClick={hidePaymentModal} className="modal-button cancel">Batal</button>
          <button onClick={handlePayment} className="modal-button confirm">Bayar Sekarang</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
