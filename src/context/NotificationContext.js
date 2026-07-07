import React, { createContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

let notificationTimeout;

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    
    setNotification({ message, type });

    notificationTimeout = setTimeout(() => {
      setNotification(null);
    }, 4000); // Notifikasi akan hilang setelah 4 detik
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
