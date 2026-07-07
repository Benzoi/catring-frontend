import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ConfirmationProvider } from './context/ConfirmationContext';
import { PaymentModalProvider } from './context/PaymentModalContext'; // Pastikan ini di-import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ConfirmationProvider>
          <CartProvider>
            <PaymentModalProvider> {/* Pastikan provider ini membungkus App */}
              <App />
            </PaymentModalProvider>
          </CartProvider>
        </ConfirmationProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
