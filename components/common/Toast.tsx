import React, { useEffect } from 'react';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <div
      className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white bg-green-500 dark:bg-green-600 transition-transform duration-300 ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <CheckCircleIcon className="w-6 h-6" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default Toast;
