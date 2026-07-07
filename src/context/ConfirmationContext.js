import React, { createContext, useState, useCallback } from 'react';

const ConfirmationContext = createContext();

const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState(null);

  // Fungsi ini diupdate untuk menerima teks tombol kustom
  const showConfirmation = useCallback((message, onConfirm, onCancel, confirmText = 'Yakin', cancelText = 'Batal') => {
    setConfirmation({ message, onConfirm, onCancel, confirmText, cancelText });
  }, []);

  const hideConfirmation = () => {
    setConfirmation(null);
  };

  return (
    <ConfirmationContext.Provider value={{ confirmation, showConfirmation, hideConfirmation }}>
      {children}
    </ConfirmationContext.Provider>
  );
};

export { ConfirmationContext, ConfirmationProvider };
