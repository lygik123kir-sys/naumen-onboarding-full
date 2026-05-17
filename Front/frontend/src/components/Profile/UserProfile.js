import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

function UserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    position: '',
    shop: ''
  });
  const [stats, setStats] = useState({
    totalRepairs: 0,
    avgWear: 0,
    lowStockCount: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Механик Цеха №5';
    const repairs = JSON.parse(localStorage.getItem('repairLogs')) || [];
    const parts = JSON.parse(localStorage.getItem('spareParts')) || [];
    const lowStock = parts.filter(p => p.stock < p.minRequired).length;
    const avgWear = repairs.length > 0
      ? (repairs.reduce((sum, r) => sum + (parseFloat(r.paramX) || 0), 0) / repairs.length).toFixed(1)
      : 0;

    setUserData({
      name: name,
      phone: '+7 (495) 123-45-67',
      position: 'Ведущий механик',
      shop: 'Цех №5, НПЗ'
    });
    setStats({
      totalRepairs: repairs.length,
      avgWear: avgWear,
      lowStockCount: lowStock
    });
    setEditedName(name);
  }, []);

  const handleSaveName = () => {
    setUserData({...userData, name: editedName});
    localStorage.setItem('userName', editedName);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('repairLogs');
    localStorage.removeItem('spareParts');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F8FC',
      paddingBottom: '80px'
    }}>
      <Header />

      <div style={{
        paddingTop: '20px',
        paddingBottom: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0054A6, #0078D4)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '24px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'white',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: '#0054A6',
            fontWeight: 'bold',
            border: '4px solid white'
          }}>
            {userData.name[0]}
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '18px', outline: 'none', color: '#333' }} />
              <button onClick={handleSaveName} style={{ padding: '8px 20px', backgroundColor: 'white', color: '#0054A6', border: 'none', borderRadius: '20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Сохранить</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{userData.name}</h1>
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✎</button>
            </div>
          )}
          <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>{userData.position}</p>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>{userData.shop}</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,84,166,0.05)' }}>
          <h2 style={{ fontSize: '18px', color: '#0054A6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📞</span> Контактные данные
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F0F5FA', borderRadius: '12px' }}>
              <span>📱</span> <span>{userData.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F0F5FA', borderRadius: '12px' }}>
              <span>🏭</span> <span>{userData.shop}</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,84,166,0.05)' }}>
          <h2 style={{ fontSize: '18px', color: '#0054A6', marginBottom: '16px' }}>📊 Моя статистика</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#F0F5FA', borderRadius: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0054A6' }}>{stats.totalRepairs}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Проведено ремонтов</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#F0F5FA', borderRadius: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0054A6' }}>{stats.avgWear}%</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Средний износ (X)</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#F0F5FA', borderRadius: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: stats.lowStockCount > 0 ? '#e74c3c' : '#0054A6' }}>{stats.lowStockCount}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Позиций с дефицитом</div>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} style={{
          width: '100%', padding: '16px', backgroundColor: 'white', color: '#0054A6', border: '2px solid #0054A6', borderRadius: '16px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0054A6'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#0054A6'; }}>
          Выйти из системы
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;