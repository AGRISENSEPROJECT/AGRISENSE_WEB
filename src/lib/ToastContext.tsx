import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto relative group overflow-hidden"
            >
              <div className={`
                flex items-center gap-4 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-md border
                ${toast.type === 'error' ? 'bg-white/95 border-red-100' : ''}
                ${toast.type === 'success' ? 'bg-white/95 border-green-100' : ''}
                ${toast.type === 'info' ? 'bg-white/95 border-blue-100' : ''}
              `}>
                <div className={`
                  p-2 rounded-xl
                  ${toast.type === 'error' ? 'bg-red-50 text-red-500' : ''}
                  ${toast.type === 'success' ? 'bg-green-50 text-green-500' : ''}
                  ${toast.type === 'info' ? 'bg-blue-50 text-blue-500' : ''}
                `}>
                  {toast.type === 'error' && <AlertCircle size={24} />}
                  {toast.type === 'success' && <CheckCircle size={24} />}
                  {toast.type === 'info' && <Info size={24} />}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-base">
                    {toast.type === 'error' ? 'Error Occurred' : toast.type === 'success' ? 'Success' : 'Message'}
                  </h4>
                  <p className="text-gray-600 text-sm mt-0.5 leading-relaxed font-medium">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Progress Bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className={`
                    absolute bottom-0 left-0 h-1
                    ${toast.type === 'error' ? 'bg-red-500' : ''}
                    ${toast.type === 'success' ? 'bg-green-500' : ''}
                    ${toast.type === 'info' ? 'bg-blue-500' : ''}
                  `}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
