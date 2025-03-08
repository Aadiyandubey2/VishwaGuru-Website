import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000); // Remove after 5 seconds
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center p-4 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              } text-white min-w-[300px] max-w-md`}
            >
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
              {notification.type === 'info' && <Info className="w-5 h-5 mr-2" />}
              <p className="flex-1">{notification.message}</p>
              <button
                onClick={() => setNotifications(prev => 
                  prev.filter(n => n.id !== notification.id)
                )}
                className="ml-2 text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}; 