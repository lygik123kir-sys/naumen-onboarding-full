import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, Users, CheckCircle, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';

const Polls = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [showResults, setShowResults] = useState({});

  const isModerator = user?.role === 'HR_MANAGER' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    loadPolls();
    loadVotes();
  }, []);

  const loadPolls = () => {
    const saved = localStorage.getItem('companyPolls');
    if (saved) {
      setPolls(JSON.parse(saved));
    } else {
      const defaultPolls = [
        { id: 1, question: 'Какой формат обучения вам удобнее?', options: ['Онлайн-вебинары', 'Очные семинары', 'Самостоятельное изучение', 'С наставником'], votes: [12, 8, 15, 10], totalVotes: 45, status: 'active', endDate: '2026-06-01', createdBy: 'HR' },
        { id: 2, question: 'Какое время для встреч удобнее?', options: ['10:00', '12:00', '15:00', '17:00'], votes: [18, 12, 8, 7], totalVotes: 45, status: 'active', endDate: '2026-05-25', createdBy: 'HR' }
      ];
      setPolls(defaultPolls);
      localStorage.setItem('companyPolls', JSON.stringify(defaultPolls));
    }
  };

  const loadVotes = () => {
    const saved = localStorage.getItem('userVotes');
    setUserVotes(saved ? JSON.parse(saved) : {});
  };

  const vote = (pollId, optionIndex) => {
    if (userVotes[pollId]) {
      addNotification('warning', 'Вы уже голосовали в этом опросе');
      return;
    }

    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex]++;
        return { ...poll, votes: newVotes, totalVotes: poll.totalVotes + 1 };
      }
      return poll;
    });
    setPolls(updatedPolls);
    localStorage.setItem('companyPolls', JSON.stringify(updatedPolls));

    const newVotes = { ...userVotes, [pollId]: optionIndex };
    setUserVotes(newVotes);
    localStorage.setItem('userVotes', JSON.stringify(newVotes));

    // Начисляем баллы за участие
    const currentPoints = localStorage.getItem('activityPoints');
    const newPoints = (currentPoints ? parseInt(currentPoints) : 0) + 20;
    localStorage.setItem('activityPoints', newPoints.toString());

    addNotification('success', 'Ваш голос учтён! +20 баллов');
  };

  const toggleResults = (pollId) => {
    setShowResults({ ...showResults, [pollId]: !showResults[pollId] });
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    pollCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid var(--border-light)' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' },
    optionBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' },
    voteCount: { fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' },
    progressBar: { height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', borderRadius: '3px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><BarChart3 size={28} color="#818CF8" /> Опросы и голосования</h1>
        <p>Ваше мнение важно для развития компании</p>
      </div>

      {polls.filter(p => p.status === 'active').map(poll => {
        const hasVoted = userVotes[poll.id] !== undefined;
        const showResult = showResults[poll.id];

        return (
          <motion.div key={poll.id} style={styles.pollCard} whileHover={{ y: -2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>{poll.question}</div>
              <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: '12px', color: '#818CF8' }}>До {poll.endDate}</span>
            </div>

            <div style={styles.optionsList}>
              {poll.options.map((opt, idx) => {
                const percentage = calculatePercentage(poll.votes[idx], poll.totalVotes);
                return (
                  <div key={idx}>
                    {!hasVoted && !showResult ? (
                      <button onClick={() => vote(poll.id, idx)} style={styles.optionBtn}>
                        <span>{opt}</span>
                      </button>
                    ) : (
                      <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{opt}</span>
                          <span style={{ fontSize: '12px', color: '#F59E0B' }}>{percentage}% ({poll.votes[idx]} голосов)</span>
                        </div>
                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>👥 {poll.totalVotes} участников</span>
              <button onClick={() => toggleResults(poll.id)} style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: '12px', cursor: 'pointer' }}>
                {showResult ? 'Скрыть результаты' : (hasVoted ? 'Показать результаты' : 'Посмотреть результаты')}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Polls;