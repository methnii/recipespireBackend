import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title, message) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((title, message) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const showWarning = useCallback((title, message) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((title, message) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};