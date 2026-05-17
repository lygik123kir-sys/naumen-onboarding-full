import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Award, Users, ThumbsUp, Calendar, Filter, User } from 'lucide-react';

const Leaderboard = () => {
  const { isDark } = useTheme();
  const [winners, setWinners] = useState([]);
  const [period, setPeriod] = useState('month');
  const [likedWinners, setLikedWinners] = useState([]);

  useEffect(() => {
    loadWinners();
    loadLikes();
  }, []);

  const loadWinners = () => {
    const saved = localStorage.getItem('honorBoard');
    if (saved) {
      setWinners(JSON.parse(saved));
    } else {
      const defaultWinners = [
        { id: 1, name: 'Александр Петров', position: 'DevOps Engineer', achievement: 'Лучший новичок месяца', points: 450, likes: 23, avatar: 'А', photo: null, date: '2026-04', badge: '🥇', reason: 'За быструю адаптацию и помощь команде' },
        { id: 2, name: 'Елена Смирнова', position: 'Backend Developer', achievement: 'Прорыв месяца', points: 320, likes: 18, avatar: 'Е', photo: null, date: '2026-04', badge: '🥈', reason: 'За успешный запуск нового модуля' },
        { id: 3, name: 'Дмитрий Иванов', position: 'QA Engineer', achievement: 'Качество месяца', points: 280, likes: 15, avatar: 'Д', photo: null, date: '2026-04', badge: '🥉', reason: 'За найденные критические баги' }
      ];
      setWinners(defaultWinners);
      localStorage.setItem('honorBoard', JSON.stringify(defaultWinners));
    }
  };

  const loadLikes = () => {
    const saved = localStorage.getItem('likedWinners');
    setLikedWinners(saved ? JSON.parse(saved) : []);
  };

  const addLike = (winnerId) => {
    if (likedWinners.includes(winnerId)) return;

    const updated = [...likedWinners, winnerId];
    setLikedWinners(updated);
    localStorage.setItem('likedWinners', JSON.stringify(updated));

    const updatedWinners = winners.map(w => w.id === winnerId ? { ...w, likes: w.likes + 1 } : w);
    setWinners(updatedWinners);
    localStorage.setItem('honorBoard', JSON.stringify(updatedWinners));
  };

  const getBadgeStyle = (badge) => {
    switch(badge) {
      case '🥇': return { color: '#FFD700', bg: 'rgba(255,215,0,0.15)' };
      case '🥈': return { color: '#C0C0C0', bg: 'rgba(192,192,192,0.15)' };
      case '🥉': return { color: '#CD7F32', bg: 'rgba(205,127,50,0.15)' };
      default: return { color: '#818CF8', bg: 'rgba(99,102,241,0.1)' };
    }
  };

  const filteredWinners = winners.filter(w => {
    if (period === 'month') return w.date === '2026-04';
    return true;
  });

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    periodBtns: { display: 'flex', gap: '8px', marginBottom: '24px' },
    periodBtn: { padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-muted)', transition: 'all 0.2s' },
    periodBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1', color: 'white' },
    winnerCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)', transition: 'all 0.2s' },
    winnerHeader: { display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' },
    winnerAvatar: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      flexShrink: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    winnerInfo: { flex: 1, minWidth: '200px' },
    winnerName: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' },
    winnerPosition: { fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' },
    badgeContainer: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    badgeIcon: { fontSize: '24px' },
    achievementBox: {
      padding: '12px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '12px',
      marginBottom: '12px',
      borderLeft: `3px solid #F59E0B`
    },
    achievementTitle: { fontSize: '14px', fontWeight: '600', color: '#F59E0B', marginBottom: '4px' },
    achievementReason: { fontSize: '13px', color: 'var(--text-secondary)' },
    winnerFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid var(--border-light)` },
    points: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#F59E0B' },
    likes: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' },
    likeBtn: {
      padding: '6px 16px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    emptyState: { textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Trophy size={28} color="#F59E0B" /> Доска почёта</h1>
        <p style={styles.subtitle}>Лучшие сотрудники месяца по версии коллег</p>
      </div>

      <div style={styles.periodBtns}>
        <button onClick={() => setPeriod('month')} style={{ ...styles.periodBtn, ...(period === 'month' && styles.periodBtnActive) }}>Этот месяц</button>
        <button onClick={() => setPeriod('all')} style={{ ...styles.periodBtn, ...(period === 'all' && styles.periodBtnActive) }}>За всё время</button>
      </div>

      {filteredWinners.length === 0 ? (
        <div style={styles.emptyState}>Пока нет победителей</div>
      ) : (
        filteredWinners.map((winner, idx) => {
          const badgeStyle = getBadgeStyle(winner.badge);
          return (
            <motion.div key={winner.id} style={styles.winnerCard} whileHover={{ y: -2 }}>
              <div style={styles.winnerHeader}>
                <div style={{
                  ...styles.winnerAvatar,
                  backgroundImage: winner.photo ? `url(${winner.photo})` : 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                }}>
                  {!winner.photo && winner.avatar}
                </div>
                <div style={styles.winnerInfo}>
                  <div style={styles.winnerName}>{winner.name}</div>
                  <div style={styles.winnerPosition}>{winner.position}</div>
                  <div style={styles.badgeContainer}>
                    <span style={styles.badgeIcon}>{winner.badge}</span>
                    <span style={{ fontSize: '13px', color: badgeStyle.color }}>{winner.achievement}</span>
                  </div>
                </div>
              </div>

              <div style={styles.achievementBox}>
                <div style={styles.achievementTitle}>📌 Причина победы</div>
                <div style={styles.achievementReason}>{winner.reason}</div>
              </div>

              <div style={styles.winnerFooter}>
                <div style={styles.points}>
                  <Star size={14} color="#F59E0B" />
                  {winner.points} баллов
                </div>
                <div style={styles.likes}>
                  <ThumbsUp size={14} />
                  {winner.likes}
                </div>
                <button
                  onClick={() => addLike(winner.id)}
                  disabled={likedWinners.includes(winner.id)}
                  style={{
                    ...styles.likeBtn,
                    backgroundColor: likedWinners.includes(winner.id) ? 'var(--bg-tertiary)' : '#6366F1',
                    color: likedWinners.includes(winner.id) ? 'var(--text-muted)' : 'white',
                    cursor: likedWinners.includes(winner.id) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ThumbsUp size={14} />
                  {likedWinners.includes(winner.id) ? 'Поддержали' : 'Поддержать'}
                </button>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default Leaderboard;