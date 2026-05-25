import React, { useState, useCallback } from 'react';
import { ToastContext } from '../../contexts/ToastContext';
import { Toast } from './Toast';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Portal Area */}
      <div 
        aria-live="assertive" 
        className="fixed inset-0 z-[100] flex px-4 py-6 pointer-events-none sm:p-6 sm:items-start flex-col gap-2 items-center justify-start sm:justify-start"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
