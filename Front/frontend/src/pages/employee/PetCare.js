import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePet } from '../../context/PetContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import PetAnimation from '../../components/Pet/PetAnimation';
import { Heart, Droplet, Battery, Star, TrendingUp, Award, ShoppingBag, Gamepad2, Bed, Apple, Coffee } from 'lucide-react';

const PetCare = () => {
  const { isDark } = useTheme();
  const { pet, petState, petEffect, feed, water, play, rest } = usePet();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('care');

  const getStatusColor = (value) => {
    if (value > 70) return '#22C55E';
    if (value > 30) return '#F59E0B';
    return '#EF4444';
  };

  const getProgressAnimation = (value) => ({
    width: `${value}%`,
    transition: { duration: 0.5, ease: 'easeOut' }
  });

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    petCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '28px', padding: '32px', marginBottom: '24px', textAlign: 'center', border: '1px solid var(--border-light)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' },
    statCard: { backgroundColor: 'var(--bg-primary)', borderRadius: '20px', padding: '16px' },
    statHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
    statValue: { fontSize: '24px', fontWeight: '700' },
    progressBar: { height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' },
    actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
    actionBtn: { padding: '14px', backgroundColor: '#6366F1', border: 'none', borderRadius: '16px', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' },
    levelCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)' },
    levelProgress: { height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
    tab: { padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-muted)' },
    tabActive: { backgroundColor: '#6366F1', borderColor: '#6366F1', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🐾 Naumen Pet</h1>
        <p style={styles.subtitle}>Заботьтесь о своём виртуальном питомце и получайте награды</p>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('care')} style={{ ...styles.tab, ...(activeTab === 'care' && styles.tabActive) }}><Heart size={16} /> Уход</button>
        <button onClick={() => setActiveTab('shop')} style={{ ...styles.tab, ...(activeTab === 'shop' && styles.tabActive) }}><ShoppingBag size={16} /> Магазин</button>
        <button onClick={() => setActiveTab('achievements')} style={{ ...styles.tab, ...(activeTab === 'achievements' && styles.tabActive) }}><Award size={16} /> Достижения</button>
      </div>

      {activeTab === 'care' && (
        <>
          <div style={styles.petCard}>
            <PetAnimation state={petState} skin={pet.skin} accessories={pet.accessories} size={150} />
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>Уровень {pet.level}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{petEffect.message}</div>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statHeader}><span>🍖 Сытость</span><span>{pet.hunger}%</span></div>
              <div style={styles.progressBar}><div style={{ ...getProgressAnimation(pet.hunger), backgroundColor: getStatusColor(pet.hunger) }} /></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statHeader}><span>💧 Жажда</span><span>{pet.thirst}%</span></div>
              <div style={styles.progressBar}><div style={{ ...getProgressAnimation(pet.thirst), backgroundColor: getStatusColor(pet.thirst) }} /></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statHeader}><span>😊 Настроение</span><span>{pet.happiness}%</span></div>
              <div style={styles.progressBar}><div style={{ ...getProgressAnimation(pet.happiness), backgroundColor: getStatusColor(pet.happiness) }} /></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statHeader}><span>⚡ Энергия</span><span>{pet.energy}%</span></div>
              <div style={styles.progressBar}><div style={{ ...getProgressAnimation(pet.energy), backgroundColor: getStatusColor(pet.energy) }} /></div>
            </div>
          </div>

          <div style={styles.actionGrid}>
            <button onClick={() => feed()} style={styles.actionBtn}><Apple size={18} /> Кормить</button>
            <button onClick={() => water()} style={styles.actionBtn}><Coffee size={18} /> Поить</button>
            <button onClick={() => play()} style={styles.actionBtn}><Gamepad2 size={18} /> Играть</button>
            <button onClick={() => rest()} style={styles.actionBtn}><Bed size={18} /> Отдых</button>
          </div>

          <div style={styles.levelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>⭐ Прогресс до уровня {pet.level + 1}</span>
              <span>{pet.exp}/{pet.expToNext} XP</span>
            </div>
            <div style={styles.levelProgress}>
              <div style={{ width: `${(pet.exp / pet.expToNext) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)', borderRadius: '4px' }} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'shop' && (
        <div style={styles.levelCard}>
          <h3 style={{ marginBottom: '16px' }}>🛒 Магазин аксессуаров</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>🎩</div>
              <div>Шляпа</div>
              <div style={{ color: '#F59E0B' }}>100 баллов</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>🕶️</div>
              <div>Очки</div>
              <div style={{ color: '#F59E0B' }}>150 баллов</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>🧣</div>
              <div>Шарф</div>
              <div style={{ color: '#F59E0B' }}>200 баллов</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>🐉</div>
              <div>Скин "Дракон"</div>
              <div style={{ color: '#F59E0B' }}>500 баллов</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div style={styles.levelCard}>
          <h3 style={{ marginBottom: '16px' }}>🏆 Достижения питомца</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
              <span style={{ fontSize: '28px' }}>🍖</span>
              <div><div style={{ fontWeight: '600' }}>Заботливый хозяин</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Покормить питомца 10 раз</div></div>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#F59E0B' }}>3/10</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
              <span style={{ fontSize: '28px' }}>🎾</span>
              <div><div style={{ fontWeight: '600' }}>Лучший друг</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Поиграть с питомцем 20 раз</div></div>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#F59E0B' }}>1/20</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
              <span style={{ fontSize: '28px' }}>⭐</span>
              <div><div style={{ fontWeight: '600' }}>Повелитель зверей</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Достичь 5 уровня</div></div>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#F59E0B' }}>Уровень {pet.level}/5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetCare;