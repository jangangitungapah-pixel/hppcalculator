import React, { useCallback } from 'react';
import { ToastContext } from '../../contexts/ToastContext';
import { Toaster, toast as sonnerToast } from 'sonner';

export const ToastProvider = ({ children }) => {
  const addToast = useCallback(({ type = 'info', title, message, action, duration = 3000 }) => {
    const options = { description: message, duration };
    if (action) {
      options.action = action;
    }
    if (type === 'success') {
      sonnerToast.success(title, options);
    } else if (type === 'error' || type === 'danger' || type === 'loss') {
      sonnerToast.error(title, options);
    } else if (type === 'warning' || type === 'low') {
      sonnerToast.warning(title, options);
    } else {
      sonnerToast.info(title, options);
    }
  }, []);

  const removeToast = useCallback(() => {
    sonnerToast.dismiss();
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toaster position="top-center" richColors theme="light" expand={false} className="z-[100]" />
    </ToastContext.Provider>
  );
};
