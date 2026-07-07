import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationContext } from '../context/ConfirmationContext';
import './ConfirmationModal.css';

const ConfirmationModal = () => {
  const { confirmation, hideConfirmation } = useContext(ConfirmationContext);
  const navigate = useNavigate();

  if (!confirmation) {
    return null;
  }

  const handleConfirm = () => {
    // Jika teks tombol adalah "Oke!" atau "Login", arahkan ke halaman login
    if (confirmation.confirmText === 'Oke!' || confirmation.confirmText === 'Login') {
      navigate('/login');
    } else if (confirmation.onConfirm) {
      // Jalankan fungsi onConfirm jika ada (untuk kasus lain)
      confirmation.onConfirm();
    }
    hideConfirmation();
  };
  
  const handleCancel = () => {
    // Jika teks tombol adalah "Daftar", arahkan ke halaman registrasi
    if (confirmation.cancelText === 'Daftar') {
        navigate('/register');
    } else if (confirmation.onCancel) {
      confirmation.onCancel();
    }
    hideConfirmation();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{confirmation.message}</p>
        <div className="modal-actions">
          {/* Tampilkan tombol Batal hanya jika ada teksnya */}
          {confirmation.cancelText && (
            <button onClick={handleCancel} className="modal-button cancel">
              {confirmation.cancelText}
            </button>
          )}
          <button onClick={handleConfirm} className="modal-button confirm">
            {confirmation.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
