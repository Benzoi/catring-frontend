// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Jika tidak ada user yang login, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  // Jika ada user yang login, tampilkan halaman yang seharusnya
  return children;
};

export default ProtectedRoute;