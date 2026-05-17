import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Users, Calendar, Target, LogOut, Sun, Moon } from 'lucide-react';

const MentorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/mentor/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
    { path: '/mentor/mentees', icon: Users, label: 'Подопечные' },
    { path: '/mentor/schedule', icon: Calendar, label: 'Расписание' },
    { path: '/mentor/tasks', icon: Target, label: 'Задания' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <aside style={{ width: '260px', backgroundColor: 'var(--bg-secondary)', borderRight: `1px solid var(--border-light)`, padding: '24px 16px', position: 'fixed', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '0 12px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #FF6611, #E55A0E)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Н</div>
          <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Naumen.Mentor</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: active ? '#FF6611' : 'var(--text-muted)', backgroundColor: active ? 'rgba(255,102,17,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                <Icon size={18} />
                <span style={{ fontSize: '14px', fontWeight: active ? '600' : '400' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: `1px solid var(--border-light)` }}>
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span style={{ fontSize: '14px' }}>{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
          </button>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', marginTop: '8px' }}>
            <LogOut size={18} />
            <span style={{ fontSize: '14px' }}>Выйти</span>
          </button>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>{user?.email}</div>
        </div>
      </aside>
      <main style={{ marginLeft: '260px', flex: 1, padding: '24px' }}>{children}</main>
    </div>
  );
};

export default MentorLayout;