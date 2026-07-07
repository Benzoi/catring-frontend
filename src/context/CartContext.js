import React, { createContext, useState, useEffect, useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import { ConfirmationContext } from './ConfirmationContext';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { showNotification } = useContext(NotificationContext);
  const { showConfirmation } = useContext(ConfirmationContext);
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Gagal mem-parsing data keranjang dari localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    // Jika user belum login, tampilkan modal khusus
    if (!user) {
      showConfirmation(
        'Kamu belum login, login dulu yuk!',
        null,    // onConfirm akan ditangani oleh modal
        null,    // onCancel tidak ada
        'Oke!',  // Teks untuk tombol konfirmasi
        null     // Teks untuk tombol batal (null berarti tidak ditampilkan)
      );
      return; // Hentikan fungsi di sini
    }

    // Logika jika user sudah login
    setCartItems((prevItems) => {
      if (prevItems.length > 0 && prevItems[0].dapur_id !== item.dapur_id) {
        showConfirmation(
          'Keranjang Anda berisi pesanan dari dapur lain. Yakin mau ganti?',
          () => { // Fungsi onConfirm
            setCartItems([{ ...item, quantity }]);
            showNotification(`${item.nama_menu} (x${quantity}) berhasil ditambahkan!`, 'success');
          },
          null,    // onCancel
          'Yakin', // confirmText
          'Batal'  // cancelText
        );
        return prevItems; // Tunggu konfirmasi
      }

      const isItemInCart = prevItems.find((cartItem) => cartItem.id === item.id);
      if (isItemInCart) {
        showNotification(`Jumlah ${item.nama_menu} di keranjang ditambah!`, 'info');
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      showNotification(`${item.nama_menu} (x${quantity}) berhasil ditambahkan!`, 'success');
      return [...prevItems, { ...item, quantity }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? {...item, quantity: newQuantity} : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
