import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Flame, Zap, Menu, X, Sun, Moon, Home, Map, Users, MessageSquare, MessageCircle, User, Wifi, WifiOff, LogOut, Clock } from 'lucide-react';
import BottomNav from './BottomNav';

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [xpProgress, setXpProgress] = useState({ current: 0, nextLevel: 1500, level: 1, streak: 0 });

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const searchInputRef = useRef(null);
  const notificationsRef = useRef(null);

  // Загрузка реального прогресса из localStorage
  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem('onboardingProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setXpProgress({
          current: parsed.xpEarned || 0,
          nextLevel: parsed.xpNextLevel || 1500,
          level: parsed.level || 1,
          streak: parsed.streak || 0
        });
      } else {
        // Демо-данные для первого запуска
        setXpProgress({
          current: 0,
          nextLevel: 1500,
          level: 1,
          streak: 0
        });
      }
    };
    loadProgress();
    // Обновляем при изменении в localStorage
    const interval = setInterval(loadProgress, 2000);
    return () => clearInterval(interval);
  }, []);

  // Часы и приветствие
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Доброе утро');
    else if (hour >= 12 && hour < 17) setGreeting('Добрый день');
    else if (hour >= 17 && hour < 22) setGreeting('Добрый вечер');
    else setGreeting('Доброй ночи');
  }, [currentTime]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const items = [
        { id: 1, title: 'Дашборд', path: '/dashboard', icon: Home },
        { id: 2, title: 'Маршрут адаптации', path: '/roadmap', icon: Map },
        { id: 3, title: 'Справочник сотрудников', path: '/directory', icon: Users },
        { id: 4, title: 'Pulse Check', path: '/feedback', icon: MessageSquare },
        { id: 5, title: 'AI Ассистент', path: '/assistant', icon: MessageCircle },
        { id: 6, title: 'Достижения', path: '/achievements', icon: '🏆' },
        { id: 7, title: 'Профиль', path: '/profile', icon: User }
      ];
      setSearchResults(items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const percentToNext = ((xpProgress.current || 0) / (xpProgress.nextLevel || 1500)) * 100;

  const mobileMenuItems = [
    { path: '/dashboard', label: 'Главная' },
    { path: '/roadmap', label: 'Маршрут' },
    { path: '/directory', label: 'Команда' },
    { path: '/feedback', label: 'Опрос' },
    { path: '/assistant', label: 'Ассистент' },
    { path: '/achievements', label: 'Достижения' },
    { path: '/glossary', label: 'Словарь' },
    { path: '/knowledge', label: 'База знаний' },
    { path: '/daily-tasks', label: 'Задания' },
    { path: '/shop', label: 'Магазин' },
    { path: '/contests', label: 'Конкурсы' },
    { path: '/events', label: 'События' },
    { path: '/polls', label: 'Опросы' },
    { path: '/leaderboard', label: 'Доска почёта' },
    { path: '/pet', label: 'Панда' },
    { path: '/profile', label: 'Профиль' }
  ];

  const styles = {
    app: { minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingBottom: '80px' },
    header: { position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'var(--bg-secondary)', borderBottom: `1px solid var(--border-light)`, transition: 'all 0.3s ease' },
    headerScrolled: { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' },
    headerContent: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', maxWidth: '1400px', margin: '0 auto' },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoIcon: { width: '34px', height: '34px', background: 'linear-gradient(135deg, #FF6611, #E55A0E)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'white' },
    logoText: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', display: 'none' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-primary)', padding: '8px 16px', borderRadius: '12px', border: `1px solid var(--border-light)`, width: '280px', cursor: 'pointer' },
    searchShortcut: { fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '6px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    clock: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' },
    streakBadge: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '20px' },
    streakCount: { fontSize: '14px', fontWeight: '600', color: '#F59E0B' },
    iconButton: { position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' },
    notificationBadge: { position: 'absolute', top: '2px', right: '2px', backgroundColor: '#EF4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', minWidth: '16px' },
    avatar: { width: '36px', height: '36px', backgroundColor: '#FF6611', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    logoutButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' },
    mobileMenuBtn: { display: 'flex', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' },
    xpBarContainer: { padding: '8px 20px', borderTop: `1px solid var(--border-light)` },
    xpBarInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' },
    xpLevel: { display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' },
    xpNumbers: { color: 'var(--text-muted)' },
    xpBarTrack: { height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' },
    xpBarFill: { height: '100%', width: `${Math.min(percentToNext, 100)}%`, background: 'linear-gradient(90deg, #FF6611, #E55A0E)', borderRadius: '2px', transition: 'width 0.5s ease' },
    mobileMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-secondary)', borderBottom: `1px solid var(--border-light)`, padding: '12px', zIndex: 40 },
    mobileMenuItem: { display: 'block', width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '16px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer' },
    mobileMenuItemActive: { backgroundColor: '#FF6611', color: 'white' },
    main: { maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 20px 20px', minHeight: 'calc(100vh - 180px)' },
    content: { minWidth: 0 },
    welcomeSection: { marginBottom: '24px' },
    welcomeTitle: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
    welcomeSubtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    searchModal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px' },
    searchModalContent: { width: '600px', maxWidth: '90%', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', overflow: 'hidden', border: `1px solid var(--border-light)` },
    searchModalHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid var(--border-light)` },
    searchModalInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '16px' },
    searchResultsList: { maxHeight: '400px', overflowY: 'auto' },
    searchResultItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', cursor: 'pointer', transition: 'all 0.2s', borderBottom: `1px solid var(--border-light)` },
    searchResultIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    notificationsDropdown: { position: 'absolute', top: '100%', right: 0, width: '320px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: `1px solid var(--border-light)`, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', marginTop: '8px', zIndex: 100, maxHeight: '400px', overflow: 'hidden' },
    notificationsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid var(--border-light)` },
    notificationsList: { maxHeight: '350px', overflowY: 'auto' },
    notificationItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: `1px solid var(--border-light)`, cursor: 'pointer', transition: 'background 0.2s' },
    notificationUnread: { backgroundColor: 'rgba(255, 102, 17, 0.05)' },
    notificationIcon: { fontSize: '20px' },
    notificationContent: { flex: 1 },
    notificationMessage: { fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' },
    notificationTime: { fontSize: '11px', color: 'var(--text-muted)' }
  };

  return (
    <div style={styles.app}>
      <header style={{ ...styles.header, ...(scrolled && styles.headerScrolled) }}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/dashboard')}>
            <span style={styles.logoIcon}>Н</span>
            <span style={styles.logoText}>Naumen.Onboard</span>
          </div>

          <div style={styles.searchBar} onClick={() => setSearchOpen(true)}>
            <Search size={18} color="var(--text-muted)" />
            <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '14px' }}>Поиск...</span>
            <span style={styles.searchShortcut}>⌘K</span>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.clock}>
              <Clock size={14} />
              <span>{currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div style={styles.streakBadge}>
              <Flame size={16} color="#F59E0B" />
              <span style={styles.streakCount}>{xpProgress.streak}</span>
            </div>

            <button onClick={toggleTheme} style={styles.iconButton}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div style={{ position: 'relative' }} ref={notificationsRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={styles.iconButton}>
                <Bell size={20} />
                {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div style={styles.notificationsDropdown}>
                  <div style={styles.notificationsHeader}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Уведомления</span>
                    <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: '#FF6611', fontSize: '12px', cursor: 'pointer' }}>Прочитать все</button>
                  </div>
                  <div style={styles.notificationsList}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Нет уведомлений</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} onClick={() => handleNotificationClick(notif.id)} style={{ ...styles.notificationItem, ...(!notif.read && styles.notificationUnread) }}>
                          <div style={styles.notificationIcon}>{notif.type === 'success' ? '✅' : notif.type === 'task' ? '📋' : notif.type === 'achievement' ? '🏆' : notif.type === 'warning' ? '⚠️' : '🔔'}</div>
                          <div style={styles.notificationContent}>
                            <div style={styles.notificationMessage}>{notif.message}</div>
                            <div style={styles.notificationTime}>{new Date(notif.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.avatar} onClick={() => navigate('/profile')}>
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>

            <button onClick={logout} style={styles.logoutButton} title="Выйти">
              <LogOut size={18} />
            </button>

            <button style={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div style={styles.xpBarContainer}>
          <div style={styles.xpBarInfo}>
            <div style={styles.xpLevel}>
              <Zap size={14} color="#F59E0B" />
              <span>Уровень {xpProgress.level}</span>
            </div>
            <div style={styles.xpNumbers}>{xpProgress.current} / {xpProgress.nextLevel} XP</div>
          </div>
          <div style={styles.xpBarTrack}>
            <div style={styles.xpBarFill} />
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {mobileMenuItems.map(item => (
            <button
              key={item.path}
              style={{ ...styles.mobileMenuItem, ...(location.pathname === item.path && styles.mobileMenuItemActive) }}
              onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>{greeting}, {user?.firstName || 'друг'}! 👋</h1>
            <p style={styles.welcomeSubtitle}>До завершения испытательного срока: 68 дней</p>
          </div>
          {children}
        </div>
      </main>

      <BottomNav />

      {!isOnline && (
        <div className="offline-indicator">
          <WifiOff size={14} /> Нет подключения к интернету
        </div>
      )}

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.searchModal} onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }} style={styles.searchModalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.searchModalHeader}>
                <Search size={18} color="var(--text-muted)" />
                <input ref={searchInputRef} type="text" placeholder="Поиск страниц..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={styles.searchModalInput} />
                <span style={styles.searchShortcut}>ESC</span>
              </div>
              <div style={styles.searchResultsList}>
                {searchResults.map(r => (
                  <div key={r.id} style={styles.searchResultItem} onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }}>
                    <div style={styles.searchResultIcon}>
                      {typeof r.icon === 'string' ? <span style={{ fontSize: '16px' }}>{r.icon}</span> : <r.icon size={16} color="#FF6611" />}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{r.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Страница</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>↵</span>
                  </div>
                ))}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Ничего не найдено</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeLayout;