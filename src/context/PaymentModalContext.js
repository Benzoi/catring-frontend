import React, { createContext, useState, useCallback } from 'react';

const PaymentModalContext = createContext();

const PaymentModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const showPaymentModal = useCallback((totalAmount) => {
    setTotal(totalAmount);
    setIsOpen(true);
  }, []);

  const hidePaymentModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <PaymentModalContext.Provider value={{ isOpen, total, showPaymentModal, hidePaymentModal }}>
      {children}
    </PaymentModalContext.Provider>
  );
};

export { PaymentModalContext, PaymentModalProvider };
