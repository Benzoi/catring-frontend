import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useContext(NotificationContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
    } else {
      // Menunggu animasi selesai sebelum menghapus dari DOM
      setTimeout(() => setVisible(false), 300); 
    }
  }, [notification]);

  if (!notification && !visible) return null;

  return (
    <div className={`notification-container ${notification ? 'show' : ''} ${notification?.type}`}>
      <p>{notification?.message}</p>
    </div>
  );
};

export default Notification;
