import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, CheckCircle, TrendingUp } from 'lucide-react';

const Achievements = () => {
  const { isDark } = useTheme();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ total: 0, earned: 0, totalXp: 0 });

  useEffect(() => {
    const data = [
      { id: 1, name: 'Первый шаг', description: 'Завершена первая задача', icon: '🌱', earned: true, date: '2026-04-15', xp: 50, category: 'onboarding' },
      { id: 2, name: 'Социальный бабочка', description: 'Познакомился с 10 коллегами', icon: '🦋', earned: true, date: '2026-04-18', xp: 100, category: 'social' },
      { id: 3, name: 'Стрелок', description: '7-дневный стрик', icon: '🔥', earned: true, date: '2026-04-20', xp: 150, category: 'streak' },
      { id: 4, name: 'Помощник', description: 'Помог другому новичку', icon: '🤝', earned: false, progress: '2/5', xp: 200, category: 'social' },
      { id: 5, name: 'Эксперт', description: 'Завершён этап погружения', icon: '🎓', earned: false, progress: '4/6', xp: 300, category: 'onboarding' },
      { id: 6, name: 'Ментор', description: 'Стань наставником', icon: '⭐', earned: false, progress: '0/1', xp: 500, category: 'leadership' },
      { id: 7, name: 'Код-мастер', description: '10 код-ревью', icon: '💻', earned: false, progress: '3/10', xp: 250, category: 'technical' },
      { id: 8, name: 'Документалист', description: '5 статей в вики', icon: '📝', earned: false, progress: '1/5', xp: 150, category: 'knowledge' }
    ];
    setAchievements(data);
    setStats({
      total: data.length,
      earned: data.filter(a => a.earned).length,
      totalXp: data.reduce((acc, a) => acc + (a.earned ? a.xp : 0), 0)
    });
  }, []);

  const categories = ['all', 'onboarding', 'social', 'streak', 'technical', 'knowledge', 'leadership'];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const filtered = achievements.filter(a => selectedCategory === 'all' || a.category === selectedCategory);

  const getCategoryName = (cat) => {
    const names = { onboarding: 'Онбординг', social: 'Социальные', streak: 'Активность', technical: 'Технические', knowledge: 'Знания', leadership: 'Лидерство' };
    return names[cat] || cat;
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', textAlign: 'center', border: '1px solid var(--border-light)' },
    statValue: { fontSize: '32px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' },
    statLabel: { fontSize: '12px', color: 'var(--text-muted)' },
    categoryBar: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    categoryBtn: { padding: '8px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-muted)' },
    categoryBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1', color: 'white' },
    achievementsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
    achievementCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', transition: 'all 0.3s' },
    achievementEarned: { borderColor: '#F59E0B' },
    achievementIcon: { fontSize: '48px', marginBottom: '12px' },
    achievementName: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' },
    achievementDesc: { fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' },
    achievementXp: { fontSize: '12px', color: '#F59E0B', marginBottom: '8px' },
    progressBar: { height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' },
    progressFill: { height: '100%', backgroundColor: '#22C55E', borderRadius: '2px' },
    earnedBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '12px', fontSize: '11px', color: '#22C55E' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Trophy size={28} color="#F59E0B" /> Достижения</h1>
        <p style={styles.subtitle}>Собирайте XP и открывайте новые награды</p>
      </div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><div style={styles.statValue}>{stats.earned}/{stats.total}</div><div style={styles.statLabel}>Получено</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{Math.round((stats.earned/stats.total)*100)}%</div><div style={styles.statLabel}>Прогресс</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{stats.totalXp}</div><div style={styles.statLabel}>Всего XP</div></div>
      </div>
      <div style={styles.categoryBar}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ ...styles.categoryBtn, ...(selectedCategory === cat && styles.categoryBtnActive) }}>
            {cat === 'all' ? 'Все' : getCategoryName(cat)}
          </button>
        ))}
      </div>
      <div style={styles.achievementsGrid}>
        {filtered.map(ach => (
          <motion.div key={ach.id} style={{ ...styles.achievementCard, ...(ach.earned && styles.achievementEarned) }} whileHover={{ y: -2 }}>
            <div style={styles.achievementIcon}>{ach.icon}</div>
            <div style={styles.achievementName}>{ach.name}</div>
            <div style={styles.achievementDesc}>{ach.description}</div>
            <div style={styles.achievementXp}>+{ach.xp} XP</div>
            {ach.earned ? (
              <div style={styles.earnedBadge}><CheckCircle size={12} /> Получено {ach.date}</div>
            ) : ach.progress ? (
              <>
                <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${(parseInt(ach.progress.split('/')[0]) / parseInt(ach.progress.split('/')[1])) * 100}%` }} /></div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Прогресс: {ach.progress}</div>
              </>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}><Lock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Ещё не получено</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;