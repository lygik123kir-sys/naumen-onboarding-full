import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    // Проверяем, проходил ли пользователь уже онбординг
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';

    if (onboardingCompleted) {
      // Если онбординг уже завершён, сразу перенаправляем на дашборд
      navigate('/dashboard');
      return;
    }

    // Если онбординг не завершён, показываем приветствие
    setIsFirstTime(true);
  }, [navigate]);

  const handleStart = async () => {
    setIsLoading(true);
    await completeOnboarding({});
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/dashboard');
    setIsLoading(false);
  };

  // Если онбординг уже был пройден, редирект уже произошёл выше
  if (!isFirstTime) {
    return null; // или лоадер
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emoji}>🎉</div>
        <h1 style={styles.title}>Добро пожаловать в Naumen!</h1>
        <p style={styles.subtitle}>
          Давайте настроим ваш профиль и начнём путь адаптации
        </p>
        <button onClick={handleStart} disabled={isLoading} style={styles.button}>
          {isLoading ? 'Загрузка...' : 'Начать путь →'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
  },
  card: {
    textAlign: 'center',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    padding: '48px',
    border: '1px solid var(--border-light)',
    maxWidth: '500px',
    width: '100%'
  },
  emoji: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    marginBottom: '32px',
    lineHeight: 1.5
  },
  button: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #FF6611, #E55A0E)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default Welcome;