import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);

  // Kalkulasi harga menggunakan 'harga' biasa
  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.harga) * item.quantity,
    0
  );

  const handleCartInputChange = (id, isMenuBesar, e) => {
    const minOrder = isMenuBesar ? 1 : 20;
    const val = parseInt(e.target.value, 10);
    
    // Hanya update jika angka valid dan memenuhi batas minimal order
    if (!isNaN(val) && val >= minOrder) {
      updateQuantity(id, val);
    }
  };

  if (!isOpen) {
    return (
      <button className="cart-fab" onClick={() => setIsOpen(true)}>
        <span role="img" aria-label="cart">🛒</span>
        {cartItems.length > 0 && (
          <span className="cart-badge-fab">{cartItems.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className="cart-expanded">
      <div className="cart-header">
        <h3>Pesanan Anda</h3>
        <button className="close-cart-btn" onClick={() => setIsOpen(false)}>&times;</button>
      </div>
      <div className="cart-body">
        {cartItems.length === 0 ? (
          <p className="cart-empty-message">Keranjang Anda kosong.</p>
        ) : (
          cartItems.map(item => {
            const minOrder = item.is_menu_besar ? 1 : 20;
            return (
              <div key={item.id} className="cart-item">
                <img src={item.foto_menu || 'https://placehold.co/80x80/FFDAB9/FF6347?text=CATring!'} alt={item.nama_menu} />
                <div className="item-details">
                  <h4>{item.nama_menu}</h4>
                  
                  {/* Tampilkan harga per porsi */}
                  <p>Rp {Number(item.harga).toLocaleString('id-ID')} / porsi</p>
                  
                  <div className="cart-quantity-control" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(minOrder, item.quantity - 1))}
                    >-</button>
                    
                    {/* Input manual di dalam Cart */}
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleCartInputChange(item.id, item.is_menu_besar, e)}
                      style={{ width: '50px', textAlign: 'center' }}
                      min={minOrder}
                    />
                    
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">🗑️</button>
              </div>
            );
          })
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="total-price">
            <strong>Total:</strong>
            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <button className="checkout-button">Pesan Sekarang</button>
          <button onClick={clearCart} className="clear-cart-btn">Kosongkan</button>
        </div>
      )}
    </div>
  );
};

export default Cart;