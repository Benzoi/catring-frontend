import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import Contexts
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';
import ConfirmationModal from './components/ConfirmationModal';
import PaymentModal from './components/PaymentModal';

// Import Pages
import HomePage from './pages/HomePage';
import DaftarDapurPage from './pages/DaftarDapurPage';
import DapurDetailPage from './pages/DapurDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DapurDashboard from './pages/DapurDashboard';
import PembeliDashboard from './pages/PembeliDashboard';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import DapurOrdersPage from './pages/DapurOrdersPage';

import './App.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-brand">
        <Link to="/">CATring! 🐾</Link>
      </div>
      <div className="nav-links">
        {user?.role === 'dapur' ? (
          <>
            <Link to="/dapur">Kelola Dapur</Link>
            <Link to="/dapur/orders">Pesanan</Link>
          </>
        ) : (
          <Link to="/dapurs">Lihat Dapur</Link>
        )}
        
        {user && user.role === 'admin' && <Link to="/admin">Dashboard</Link>}
        
        {user ? (
          <>
            <Link to="/profile" className="user-greeting"> Halo, {user.nama_lengkap}</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/register">Daftar</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {(!user || user.role === 'pembeli') && (
          <Link to="/cart" className="cart-link">
            🛒
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Notification />
        <ConfirmationModal />
        <PaymentModal />
        <header>
          <Navigation />
        </header>
        <main>
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dapurs" element={<DaftarDapurPage />} />
            <Route path="/dapurs/:id" element={<DapurDetailPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Rute yang Dilindungi */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dapur" 
              element={
                <ProtectedRoute>
                  <DapurDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pembeli" 
              element={
                <ProtectedRoute>
                  <PembeliDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dapur/orders" 
              element={
                <ProtectedRoute>
                  <DapurOrdersPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
