import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Функция для воспроизведения звука/вибрации
const notifySound = (type) => {
  // Вибрация для мобильных устройств
  if (window.navigator && window.navigator.vibrate) {
    if (type === 'error' || type === 'warning') {
      window.navigator.vibrate([200, 100, 200]);
    } else {
      window.navigator.vibrate(100);
    }
  }

  // Звук через Web Audio API (простой "бип")
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = type === 'error' ? 440 : 880;
    gainNode.gain.value = 0.1;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);

    setTimeout(() => audioContext.close(), 1000);
  } catch (e) {
    console.log('Audio not supported');
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } else {
        // Тестовые уведомления для демо
        const defaultNotifications = [
          { id: 1, type: 'success', message: 'Добро пожаловать в Naumen.Onboard!', read: false, createdAt: new Date().toISOString() },
          { id: 2, type: 'task', message: 'Новая задача: Познакомиться с командой', read: false, createdAt: new Date().toISOString() },
          { id: 3, type: 'achievement', message: 'Получено достижение "Первый шаг"', read: false, createdAt: new Date().toISOString() }
        ];
        setNotifications(defaultNotifications);
        setUnreadCount(3);
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Эмуляция WebSocket для реальных уведомлений
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.85) {
        const mockNotifications = [
          { type: 'task', message: '⏰ Напоминание: сегодня встреча с наставником в 15:00' },
          { type: 'achievement', message: '🏆 Поздравляем! Вы получили +50 XP за активность' },
          { type: 'feedback', message: '📊 Не забудьте заполнить еженедельный Pulse Check' },
          { type: 'info', message: '📚 Новая документация добавлена в раздел "Регламенты"' }
        ];
        const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotif.type, randomNotif.message);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback(async (type, message, data = null) => {
    // Воспроизводим звук/вибрацию
    notifySound(type);

    const newNotification = {
      id: Date.now(),
      type,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50);
      localStorage.setItem('notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });

    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.custom((t) => (
          <div style={{
            backgroundColor: '#F59E0B',
            color: '#0F172A',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            ⚠️ {message}
          </div>
        ));
        break;
      default:
        toast(message, {
          icon: '🔔',
          style: {
            background: '#1E293B',
            color: '#F1F5F9',
            border: '1px solid #334155'
          }
        });
    }

    return newNotification.id;
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      setUnreadCount(0);
      return updated;
    });
    toast.success('Все уведомления прочитаны');
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.filter(notif => notif.id !== notificationId);
      localStorage.setItem('notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
    setUnreadCount(0);
    toast.success('Все уведомления удалены');
  }, []);

  const requestPushPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addNotification('success', 'Уведомления включены');
      }
    }
  }, [addNotification]);

  const sendBrowserNotification = useCallback((title, body, icon = null) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon });
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    requestPushPermission,
    sendBrowserNotification,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;