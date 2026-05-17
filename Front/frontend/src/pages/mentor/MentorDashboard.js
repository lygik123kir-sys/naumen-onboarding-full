import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, Calendar, Star, ChevronRight } from 'lucide-react';
// Импортируем наш сетевой сервис
import apiService from '../../services/apiService';

const MentorDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, atRisk: 0, avgProgress: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenteesData();
  }, []);

  const loadMenteesData = async () => {
    try {
      setIsLoading(true);
      // Стучимся к NestJS за реальными людьми из базы Neon
      const data = await apiService.getEmployees();
      const loadedMentees = Array.isArray(data) ? data : (data.users || []);

      setMentees(loadedMentees);

      // Живой математический пересчет карточек статистики наставника
      if (loadedMentees.length > 0) {
        const total = loadedMentees.length;
        const completed = loadedMentees.filter(m => (m.progress !== undefined ? m.progress : 25) >= 100).length;
        const atRisk = loadedMentees.filter(m => (m.progress !== undefined ? m.progress : 25) < 30).length;
        const totalProgress = loadedMentees.reduce((acc, m) => acc + (m.progress !== undefined ? m.progress : 25), 0);
        const avgProgress = Math.round(totalProgress / total);

        setStats({ total, completed, atRisk, avgProgress });
      } else {
        setStats({ total: 0, completed: 0, atRisk: 0, avgProgress: 0 });
      }
    } catch (err) {
      console.error('Ошибка при загрузке дашборда наставника:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (progress) => {
    if (progress >= 100) return '#6366F1'; // Завершил
    if (progress < 30) return '#EF4444';  // В зоне риска
    return '#22C55E';                     // Активен
  };

  const getMoodIcon = (mood) => {
    switch(String(mood).toLowerCase()) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😫';
      default: return '😊';
    }
  };

  const handleViewDetails = (mentee) => {
    const name = mentee.name || `${mentee.firstName || ''} ${mentee.lastName || ''}`.trim();
    alert(`Подробнее о ${name}:\n\nПрогресс: ${mentee.progress !== undefined ? mentee.progress : 25}%\nДолжность: ${mentee.role || 'devops'}\nEmail: ${mentee.email || '—'}`);
  };

  const handleSendMessage = (mentee) => {
    const name = mentee.name || `${mentee.firstName || ''} ${mentee.lastName || ''}`.trim();
    alert(`Чат с ${name} откроется здесь. В реальном приложении будет переход в мессенджер.`);
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)` },
    statValue: { fontSize: '32px', fontWeight: '700', color: '#FF6611', marginBottom: '4px' },
    statLabel: { fontSize: '13px', color: 'var(--text-muted)' },
    menteeCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: `1px solid var(--border-light)`, transition: 'all 0.2s' },
    menteeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    menteeName: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    menteeRole: { fontSize: '13px', color: '#FF6611' },
    progressSection: { marginBottom: '16px' },
    progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' },
    progressBar: { height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, #FF6611, #E55A0E)', borderRadius: '3px', transition: 'width 0.5s' },
    menteeFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid var(--border-light)`, flexWrap: 'wrap', gap: '12px' },
    messageBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' },
    detailsBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-primary)', padding: '40px', textAlign: 'center' }}>Загрузка панели наставника...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Star size={28} color="#FF6611" />
          Панель наставника
        </h1>
        <p style={styles.subtitle}>Управление подопечными и отслеживание прогресса</p>
      </div>

      {/* Верхние инфоблоки */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Подопечных</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.completed}</div>
          <div style={styles.statLabel}>Завершили ИС</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.atRisk}</div>
          <div style={styles.statLabel}>Требуют внимания</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.avgProgress}%</div>
          <div style={styles.statLabel}>Средний прогресс</div>
        </div>
      </div>

      {/* Список реальных карточек подопечных */}
      <div>
        {mentees.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>Подопечные не найдены в базе данных</div>
        ) : (
          mentees.map(mentee => {
            const menteeName = mentee.name || `${mentee.firstName || ''} ${mentee.lastName || ''}` || 'Неизвестный';
            const menteeProgress = mentee.progress !== undefined ? mentee.progress : 25;

            return (
              <motion.div key={mentee.id} style={styles.menteeCard} whileHover={{ y: -2 }}>
                <div style={styles.menteeHeader}>
                  <div>
                    <div style={styles.menteeName}>{menteeName}</div>
                    <div style={styles.menteeRole}>{mentee.role || 'devops'} • Начало: {mentee.startDate || '2026-05-17'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{getMoodIcon(mentee.mood || 'good')}</span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      backgroundColor: `${getStatusColor(menteeProgress)}20`,
                      color: getStatusColor(menteeProgress)
                    }}>
                      {menteeProgress >= 100 ? 'Завершил' : menteeProgress < 30 ? 'В зоне риска' : 'Активен'}
                    </span>
                  </div>
                </div>

                <div style={styles.progressSection}>
                  <div style={styles.progressLabel}>
                    <span>Прогресс адаптации</span>
                    <span>{menteeProgress}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${menteeProgress}%` }} />
                  </div>
                </div>

                <div style={styles.menteeFooter}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> Последний фидбек: {mentee.lastFeedback || '2026-05-17'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Следующая встреча: {mentee.nextMeeting || '2026-05-22'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSendMessage(mentee)} style={styles.messageBtn}><MessageCircle size={14} /> Написать</button>
                    <button onClick={() => handleViewDetails(mentee)} style={styles.detailsBtn}>Подробнее <ChevronRight size={14} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;