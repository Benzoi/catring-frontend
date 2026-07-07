import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { PaymentModalContext } from '../context/PaymentModalContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const { showPaymentModal } = useContext(PaymentModalContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.harga_5_porsi) * item.quantity,
    0
  );

  const handleCheckout = () => {
    showPaymentModal(totalPrice);
  };

  return (
    <div className="cart-page-container">
      <h1>Keranjang Belanja Anda</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Keranjang Anda masih kosong.</p>
          <Link to="/dapurs" className="button-primary">Mulai Belanja</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-page-item">
                <img src={item.foto_menu || 'https://placehold.co/100x100/FFDAB9/FF6347?text=CATring!'} alt={item.nama_menu} />
                <div className="item-info">
                  <h4>{item.nama_menu}</h4>
                  <p>Rp {Number(item.harga_5_porsi).toLocaleString('id-ID')} / 5 porsi</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">
                  Rp {(Number(item.harga_5_porsi) * item.quantity).toLocaleString('id-ID')}
                </div>
                <button onClick={() => removeFromCart(item.id)} className="item-remove">
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Ringkasan Pesanan</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-button-full">Lanjutkan ke Pembayaran</button>
            <button onClick={clearCart} className="clear-cart-button-full">Kosongkan Keranjang</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
