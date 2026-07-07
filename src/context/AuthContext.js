import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Fungsi baru untuk update data user
  const updateUser = (updatedData) => {
    // Gabungkan data lama dengan data baru
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('userInfo', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}> {/* Tambahkan updateUser */}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
