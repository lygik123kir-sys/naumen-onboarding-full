import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, Plus, Edit2, Trash2, Send, Award, Medal, Sparkles, CheckCircle, X } from 'lucide-react';

const Contests = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [contests, setContests] = useState([]);
  const [myAnswers, setMyAnswers] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newContest, setNewContest] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0, prize: 100, deadline: '' });
  const [leaderboard, setLeaderboard] = useState([]);

  const isModerator = user?.role === 'HR_MANAGER' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    loadContests();
    loadLeaderboard();
  }, []);

  const loadContests = () => {
    const saved = localStorage.getItem('contests');
    if (saved) {
      setContests(JSON.parse(saved));
    } else {
      const defaultContests = [
        { id: 1, question: '🐕 Как зовут любимого корги начальника HR отдела?', options: ['Шарик', 'Бобик', 'Лорд', 'Рекс'], correctAnswer: 2, prize: 100, deadline: '2026-05-20', status: 'active', participants: 15, winners: [] },
        { id: 2, question: '🏢 В каком году основана компания Naumen?', options: ['1995', '2000', '2005', '2010'], correctAnswer: 0, prize: 150, deadline: '2026-05-25', status: 'active', participants: 8, winners: [] }
      ];
      setContests(defaultContests);
      localStorage.setItem('contests', JSON.stringify(defaultContests));
    }
  };

  const loadLeaderboard = () => {
    const saved = localStorage.getItem('contestLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    } else {
      const defaultLeaderboard = [
        { name: 'Александр П.', points: 450, wins: 3 },
        { name: 'Елена С.', points: 320, wins: 2 },
        { name: 'Дмитрий И.', points: 280, wins: 2 }
      ];
      setLeaderboard(defaultLeaderboard);
      localStorage.setItem('contestLeaderboard', JSON.stringify(defaultLeaderboard));
    }
  };

  const submitAnswer = (contestId, answerIndex) => {
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return;

    const isCorrect = answerIndex === contest.correctAnswer;
    setMyAnswers({ ...myAnswers, [contestId]: answerIndex });

    if (isCorrect) {
      const currentPoints = localStorage.getItem('activityPoints');
      const newPoints = (currentPoints ? parseInt(currentPoints) : 0) + contest.prize;
      localStorage.setItem('activityPoints', newPoints.toString());
      addNotification('success', `🎉 Правильно! +${contest.prize} баллов!`);

      const userName = user?.firstName || 'Участник';
      const existing = leaderboard.find(l => l.name === userName);
      if (existing) {
        const updated = leaderboard.map(l => l.name === userName ? { ...l, points: l.points + contest.prize, wins: l.wins + 1 } : l);
        setLeaderboard(updated);
        localStorage.setItem('contestLeaderboard', JSON.stringify(updated));
      } else {
        const newEntry = { name: userName, points: contest.prize, wins: 1 };
        const updated = [...leaderboard, newEntry].sort((a, b) => b.points - a.points);
        setLeaderboard(updated);
        localStorage.setItem('contestLeaderboard', JSON.stringify(updated));
      }
    } else {
      addNotification('error', '❌ Неверный ответ. Попробуйте в следующий раз!');
    }

    const updated = contests.map(c => c.id === contestId ? { ...c, participants: (c.participants || 0) + 1 } : c);
    setContests(updated);
    localStorage.setItem('contests', JSON.stringify(updated));
  };

  const addContest = () => {
    if (!newContest.question || newContest.options.some(opt => !opt)) return;
    const contest = {
      id: Date.now(),
      ...newContest,
      status: 'active',
      participants: 0,
      winners: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...contests, contest];
    setContests(updated);
    localStorage.setItem('contests', JSON.stringify(updated));
    setNewContest({ question: '', options: ['', '', '', ''], correctAnswer: 0, prize: 100, deadline: '' });
    setIsAdding(false);
    addNotification('success', 'Конкурс создан!');
  };

  const deleteContest = (id) => {
    if (window.confirm('Удалить конкурс?')) {
      const updated = contests.filter(c => c.id !== id);
      setContests(updated);
      localStorage.setItem('contests', JSON.stringify(updated));
      addNotification('success', 'Конкурс удалён');
    }
  };

  // Стили с поддержкой тёмной темы
  const styles = {
    container: { maxWidth: '900px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    leaderboardCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '24px', border: '1px solid var(--border-light)' },
    leaderboardTitle: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' },
    leaderboardItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid var(--border-light)` },
    medal: { width: '30px', fontSize: '20px', textAlign: 'center' },
    leaderboardName: { flex: 1, color: 'var(--text-secondary)' },
    leaderboardPoints: { color: '#F59E0B', fontWeight: '600' },
    leaderboardWins: { fontSize: '12px', color: 'var(--text-muted)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginBottom: '20px' },
    contestCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', marginBottom: '16px', border: '1px solid var(--border-light)', transition: 'all 0.2s' },
    contestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    contestQuestion: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    contestPrize: { padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(255,102,17,0.1)', color: '#FF6611', fontSize: '12px', fontWeight: '500' },
    optionsGrid: { display: 'grid', gap: '12px', marginBottom: '20px' },
    optionBtn: { padding: '14px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-secondary)' },
    optionBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    contestFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
    modalTitle: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none', resize: 'vertical' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Trophy size={28} color="#F59E0B" /> Конкурсы для новичков</h1>
        <p style={styles.subtitle}>Участвуйте, отвечайте на вопросы и попадайте в лидерборд!</p>
      </div>

      <div style={styles.leaderboardCard}>
        <div style={styles.leaderboardTitle}><Medal size={20} color="#F59E0B" /><span>🏆 Топ участников</span></div>
        {leaderboard.slice(0, 5).map((user, idx) => (
          <div key={idx} style={styles.leaderboardItem}>
            <div style={styles.medal}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}</div>
            <div style={styles.leaderboardName}>{user.name}</div>
            <div style={styles.leaderboardPoints}>{user.points} баллов</div>
            <div style={styles.leaderboardWins}>🏆 {user.wins}</div>
          </div>
        ))}
      </div>

      {isModerator && (
        <button onClick={() => setIsAdding(true)} style={styles.addBtn}>
          <Plus size={16} /> Создать конкурс
        </button>
      )}

      {contests.filter(c => c.status === 'active').map(contest => (
        <motion.div key={contest.id} style={styles.contestCard} whileHover={{ y: -2 }}>
          <div style={styles.contestHeader}>
            <span style={styles.contestQuestion}>{contest.question}</span>
            <span style={styles.contestPrize}>🎁 {contest.prize} баллов</span>
          </div>

          <div style={styles.optionsGrid}>
            {contest.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => submitAnswer(contest.id, idx)}
                disabled={myAnswers[contest.id] !== undefined}
                style={{
                  ...styles.optionBtn,
                  ...(myAnswers[contest.id] !== undefined && styles.optionBtnDisabled),
                  ...(myAnswers[contest.id] === idx && { borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,0.1)' })
                }}
              >
                {opt}
                {myAnswers[contest.id] === idx && <CheckCircle size={16} style={{ float: 'right', color: '#22C55E' }} />}
              </button>
            ))}
          </div>

          <div style={styles.contestFooter}>
            <span>👥 {contest.participants || 0} участников</span>
            <span>📅 До {contest.deadline}</span>
          </div>

          {isModerator && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => deleteContest(contest.id)} style={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </motion.div>
      ))}

      {contests.filter(c => c.status === 'active').length === 0 && !isModerator && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Нет активных конкурсов. Загляните позже!</div>
      )}

      {/* Модальное окно добавления конкурса */}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создать конкурс</h2>

            <textarea rows={2} placeholder="Вопрос" value={newContest.question} onChange={e => setNewContest({...newContest, question: e.target.value})} style={styles.textarea} />

            {newContest.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Вариант ответа ${idx + 1}`}
                value={opt}
                onChange={e => {
                  const newOpts = [...newContest.options];
                  newOpts[idx] = e.target.value;
                  setNewContest({...newContest, options: newOpts});
                }}
                style={styles.input}
              />
            ))}

            <button
              onClick={() => setNewContest({...newContest, options: [...newContest.options, '']})}
              style={{ fontSize: '12px', marginBottom: '16px', background: 'none', border: 'none', color: '#FF6611', cursor: 'pointer', textAlign: 'left' }}
            >
              + Добавить вариант
            </button>

            <select
              value={newContest.correctAnswer}
              onChange={e => setNewContest({...newContest, correctAnswer: parseInt(e.target.value)})}
              style={styles.select}
            >
              {newContest.options.map((_, idx) => (
                <option key={idx} value={idx}>Правильный ответ: вариант {idx + 1}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Призовые баллы"
              value={newContest.prize}
              onChange={e => setNewContest({...newContest, prize: parseInt(e.target.value)})}
              style={styles.input}
            />

            <input
              type="date"
              placeholder="Дата окончания"
              value={newContest.deadline}
              onChange={e => setNewContest({...newContest, deadline: e.target.value})}
              style={styles.input}
            />

            <div style={styles.modalButtons}>
              <button onClick={addContest} style={styles.saveBtn}>Создать</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contests;