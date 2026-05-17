import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InviteAccept = () => {
  const navigate = useNavigate();
  const { acceptInvite } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!formData.password) newErrors.password = 'Введите пароль';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть минимум 6 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Создаём email из имени и фамилии
      const email = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@naumen.ru`;
      await acceptInvite('mock-token', { ...formData, email });
      navigate('/welcome');
    } catch (error) {
      setErrors({ submit: 'Ошибка при активации аккаунта' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '500px', width: '100%', backgroundColor: '#1E293B', borderRadius: '32px', padding: '40px', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px', color: 'white' }}>Н</div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#F1F5F9', textAlign: 'center', marginBottom: '8px' }}>Присоединяйтесь к Naumen</h1>
        <p style={{ fontSize: '14px', color: '#94A3B8', textAlign: 'center', marginBottom: '32px' }}>Создайте аккаунт, чтобы начать ваше приключение</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Имя"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                style={{ width: '100%', padding: '14px', backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#F1F5F9', outline: 'none' }}
              />
              {errors.firstName && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.firstName}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Фамилия"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                style={{ width: '100%', padding: '14px', backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#F1F5F9', outline: 'none' }}
              />
              {errors.lastName && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.lastName}</span>}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ width: '100%', padding: '14px', backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#F1F5F9', outline: 'none' }}
            />
            {errors.password && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.password}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{ width: '100%', padding: '14px', backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#F1F5F9', outline: 'none' }}
            />
            {errors.confirmPassword && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.confirmPassword}</span>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="tel"
              placeholder="Телефон (опционально)"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ width: '100%', padding: '14px', backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#F1F5F9', outline: 'none' }}
            />
          </div>

          {errors.submit && (
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#FCA5A5', marginBottom: '20px', fontSize: '13px' }}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Создаём аккаунт...' : 'Начать путь →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748B' }}>
          Уже есть аккаунт? <a href="/login" style={{ color: '#818CF8', textDecoration: 'none' }}>Войти</a>
        </p>
      </div>
    </div>
  );
};

export default InviteAccept;