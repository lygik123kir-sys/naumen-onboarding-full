import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle, Sun, Moon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'HR_MANAGER') {
          navigate('/hr/dashboard');
        } else if (user?.role === 'MENTOR') {
          navigate('/mentor/dashboard');
        } else {
          const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted') === 'true';
          navigate(hasCompletedOnboarding ? '/dashboard' : '/welcome');
        }
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа. Проверьте email и пароль');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await login(demoEmail, demoPassword);
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'HR_MANAGER') {
          navigate('/hr/dashboard');
        } else if (user?.role === 'MENTOR') {
          navigate('/mentor/dashboard');
        } else {
          const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted') === 'true';
          navigate(hasCompletedOnboarding ? '/dashboard' : '/welcome');
        }
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Кнопка переключения темы */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '10px 16px',
          cursor: 'pointer',
          color: '#1E293B',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        <span>{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
      </button>

      {/* Форма входа */}
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '32px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E2E8F0',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #FF6611, #E55A0E)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white'
          }}>Н</div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Naumen.Onboard</h1>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: '8px' }}>Добро пожаловать</h2>
        <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '32px' }}>Войдите в систему адаптации новых сотрудников</p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '13px', color: '#DC2626', flex: 1 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              <Mail size={16} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@naumen.ru"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                color: '#0F172A',
                fontSize: '14px',
                outline: 'none'
              }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
              <Lock size={16} />
              <span>Пароль</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  color: '#0F172A',
                  fontSize: '14px',
                  outline: 'none',
                  paddingRight: '40px'
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #FF6611, #E55A0E)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Вход...' : <><LogIn size={18} /> Войти</>}
          </button>
        </form>

        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Демо-доступ (нажмите на роль для быстрого входа):</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleQuickDemo('demo@naumen.ru', 'demo123')}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#FF6611',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
            >
              👤 Сотрудник: demo@naumen.ru / demo123
            </button>
            <button
              onClick={() => handleQuickDemo('hr@naumen.ru', 'demo123')}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#FF6611',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
            >
              👔 HR: hr@naumen.ru / demo123
            </button>
            <button
              onClick={() => handleQuickDemo('mentor@naumen.ru', 'demo123')}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#FF6611',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
            >
              ⭐ Наставник: mentor@naumen.ru / demo123
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <span style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ fontSize: '12px', color: '#64748B' }}>или</span>
          <span style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginBottom: '20px' }}>
          У вас есть приглашение?
          <Link to="/invite/accept" style={{ color: '#FF6611', textDecoration: 'none', marginLeft: '6px' }}>Принять приглашение</Link>
        </p>

        <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>Naumen.Onboard v1.0.0 • Enterprise Onboarding Platform</div>
      </div>
    </div>
  );
};

export default Login;