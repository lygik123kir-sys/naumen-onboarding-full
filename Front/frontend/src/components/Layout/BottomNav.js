import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Home, User, Map, Users, MessageSquare, MessageCircle,
  Trophy, BookOpen, Target, ShoppingBag, Calendar, BarChart3, Award, Heart,
  ChevronUp, ChevronDown
} from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryItems = [
    { path: '/dashboard', icon: Home, label: 'Главная' },
    { path: '/roadmap', icon: Map, label: 'Маршрут' },
    { path: '/directory', icon: Users, label: 'Команда' },
    { path: '/feedback', icon: MessageSquare, label: 'Опрос' }
  ];

  const secondaryItems = [
    { path: '/assistant', icon: MessageCircle, label: 'Ассистент' },
    { path: '/achievements', icon: Trophy, label: 'Достижения' },
    { path: '/glossary', icon: BookOpen, label: 'Словарь' },
    { path: '/knowledge', icon: BookOpen, label: 'База знаний' },
    { path: '/daily-tasks', icon: Target, label: 'Задания' },
    { path: '/shop', icon: ShoppingBag, label: 'Магазин' },
    { path: '/contests', icon: Trophy, label: 'Конкурсы' },
    { path: '/events', icon: Calendar, label: 'События' },
    { path: '/polls', icon: BarChart3, label: 'Опросы' },
    { path: '/leaderboard', icon: Award, label: 'Доска почёта' },
    { path: '/pet', icon: Heart, label: 'Панда' },
    { path: '/profile', icon: User, label: 'Профиль' }
  ];

  const isActive = (path) => location.pathname === path;

  const styles = {
    container: {
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    toggleButton: {
      width: '44px',
      height: '44px',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      border: `1px solid ${isDark ? 'rgba(255, 102, 17, 0.3)' : '#E2E8F0'}`,
      borderRadius: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      marginBottom: '8px',
      color: '#FF6611'
    },
    tabBar: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '28px',
      border: `1px solid ${isDark ? 'rgba(255, 102, 17, 0.2)' : '#E2E8F0'}`,
      padding: '12px',
      width: '100%',
      transition: 'all 0.3s ease',
      maxHeight: isExpanded ? '400px' : '0px',
      opacity: isExpanded ? 1 : 0,
      overflow: 'hidden'
    },
    primaryContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    secondaryContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      paddingTop: '16px',
      borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`
    },
    tabItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '20px',
      transition: 'all 0.2s',
      flex: 1,
      minWidth: '56px'
    },
    tabItemActive: {
      backgroundColor: isDark ? 'rgba(255, 102, 17, 0.15)' : 'rgba(255, 102, 17, 0.1)'
    },
    tabLabel: {
      fontSize: '10px',
      fontWeight: '500',
      color: isDark ? '#64748B' : '#475569',
      whiteSpace: 'nowrap'
    },
    tabLabelActive: {
      color: '#FF6611'
    },
    tabIcon: {
      color: isDark ? '#64748B' : '#475569'
    },
    tabIconActive: {
      color: '#FF6611'
    },
    secondaryItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '16px',
      transition: 'all 0.2s',
      width: '100%'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toggleButton} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>

      <div style={styles.tabBar}>
        <div style={styles.primaryContainer}>
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.tabItem,
                  ...(active && styles.tabItemActive)
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.5}
                  style={active ? styles.tabIconActive : styles.tabIcon}
                />
                <span style={{
                  ...styles.tabLabel,
                  ...(active && styles.tabLabelActive)
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={styles.secondaryContainer}>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.secondaryItem,
                  ...(active && styles.tabItemActive)
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 1.5}
                  style={active ? styles.tabIconActive : styles.tabIcon}
                />
                <span style={{
                  ...styles.tabLabel,
                  fontSize: '10px',
                  ...(active && styles.tabLabelActive)
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;