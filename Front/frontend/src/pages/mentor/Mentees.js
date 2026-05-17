import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Calendar, TrendingUp, Star, MessageCircle, ChevronRight, Clock } from 'lucide-react';
import ProgressSyncService from '../../services/progressSync';

const Mentees = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadMentees();
    loadTasks();
  }, []);

  const loadMentees = () => {
    const data = ProgressSyncService.getAllEmployeesWithProgress();
    setMentees(data);
  };

  const loadTasks = () => {
    const saved = localStorage.getItem('mentorTasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  };

  const getTaskCount = (menteeId) => {
    return tasks.filter(t => t.assignedToId === menteeId && t.status !== 'completed').length;
  };

  const getStatusColor = (progress) => {
    if (progress >= 100) return '#22C55E';
    if (progress >= 60) return '#818CF8';
    if (progress >= 30) return '#F59E0B';
    return '#EF4444';
  };

  const getMoodIcon = (mood) => {
    switch(mood) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😫';
      default: return '😐';
    }
  };

  const filtered = mentees.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '12px 16px', marginBottom: '24px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' },
    menteeCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)', transition: 'all 0.2s' },
    menteeName: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    menteeRole: { fontSize: '13px', color: '#FF6611' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Star size={28} color="#FF6611" /> Мои подопечные</h1>
        <p style={styles.subtitle}>Управление и отслеживание прогресса</p>
      </div>
      <div style={styles.searchBox}>
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Поиск по имени..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
      </div>
      {filtered.map(m => (
        <div key={m.id} style={styles.menteeCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
            <div><div style={styles.menteeName}>{m.name}</div><div style={styles.menteeRole}>{m.role}</div></div>
            <span style={{ fontSize: '24px' }}>{getMoodIcon(m.mood)}</span>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Прогресс адаптации</span><span style={{ color: getStatusColor(m.progress || 0) }}>{m.progress || 0}%</span></div>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${m.progress || 0}%`, height: '100%', backgroundColor: '#FF6611', borderRadius: '3px', transition: 'width 0.5s' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span><Mail size={14} style={{ marginRight: '4px' }} /> {m.email}</span>
            <span><Calendar size={14} style={{ marginRight: '4px' }} /> Начало: {m.startDate}</span>
            <span><Clock size={14} style={{ marginRight: '4px' }} /> Заданий: {getTaskCount(m.id)}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={() => navigate(`/mentor/tasks?mentee=${m.id}`)} style={{ flex: 1, padding: '10px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><MessageCircle size={14} /> Задания</button>
            <button onClick={() => navigate('/mentor/schedule')} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Calendar size={14} /> Назначить встречу</button>
          </div>
        </div>
      ))}
      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Нет подопечных</div>}
    </div>
  );
};

export default Mentees;