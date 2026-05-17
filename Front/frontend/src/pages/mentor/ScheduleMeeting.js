import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Calendar, Clock, Users, Plus, Trash2, CheckCircle, Search, X, Edit2, Save } from 'lucide-react';

const ScheduleMeeting = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    menteeId: '',
    date: '',
    time: '',
    duration: '1',
    type: 'online',
    link: ''
  });

  useEffect(() => {
    loadMeetings();
    loadMentees();
  }, []);

  const loadMeetings = () => {
    const saved = localStorage.getItem('mentorMeetings');
    if (saved && JSON.parse(saved).length > 0) {
      setMeetings(JSON.parse(saved));
    } else {
      const defaultMeetings = [
        {
          id: 1,
          title: 'Вводная встреча',
          description: 'Знакомство с командой и планом адаптации',
          menteeId: 1,
          menteeName: 'Александр Петров',
          date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
          time: '11:00',
          duration: '1',
          type: 'online',
          link: 'https://zoom.us/meeting/123',
          status: 'scheduled',
          createdAt: new Date().toISOString().split('T')[0]
        },
        {
          id: 2,
          title: 'Код-ревью',
          description: 'Разбор первого pull request',
          menteeId: 2,
          menteeName: 'Елена Смирнова',
          date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
          time: '15:00',
          duration: '1',
          type: 'offline',
          link: '',
          status: 'scheduled',
          createdAt: new Date().toISOString().split('T')[0]
        }
      ];
      setMeetings(defaultMeetings);
      localStorage.setItem('mentorMeetings', JSON.stringify(defaultMeetings));
    }
  };

  const loadMentees = () => {
    const menteesData = [
      { id: 1, name: 'Александр Петров', role: 'DevOps Engineer', email: 'a.petrov@naumen.ru' },
      { id: 2, name: 'Елена Смирнова', role: 'Backend Developer', email: 'e.smirnova@naumen.ru' }
    ];
    setMentees(menteesData);
  };

  const addMeeting = () => {
    if (!newMeeting.title || !newMeeting.menteeId || !newMeeting.date || !newMeeting.time) {
      addNotification('error', 'Заполните все обязательные поля');
      return;
    }
    const mentee = mentees.find(m => m.id === parseInt(newMeeting.menteeId));
    const meeting = {
      id: Date.now(),
      ...newMeeting,
      menteeName: mentee?.name,
      status: 'scheduled',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [meeting, ...meetings];
    setMeetings(updated);
    localStorage.setItem('mentorMeetings', JSON.stringify(updated));
    setIsAdding(false);
    setNewMeeting({ title: '', description: '', menteeId: '', date: '', time: '', duration: '1', type: 'online', link: '' });
    addNotification('success', 'Встреча назначена');
  };

  const updateMeeting = () => {
    if (!editingMeeting) return;
    const updated = meetings.map(m => m.id === editingMeeting.id ? editingMeeting : m);
    setMeetings(updated);
    localStorage.setItem('mentorMeetings', JSON.stringify(updated));
    setIsEditing(false);
    setEditingMeeting(null);
    addNotification('success', 'Встреча обновлена');
  };

  const startEdit = (meeting) => {
    setEditingMeeting({ ...meeting });
    setIsEditing(true);
  };

  const cancelMeeting = (id) => {
    if (window.confirm('Отменить встречу?')) {
      const updated = meetings.filter(m => m.id !== id);
      setMeetings(updated);
      localStorage.setItem('mentorMeetings', JSON.stringify(updated));
      addNotification('success', 'Встреча отменена');
    }
  };

  const completeMeeting = (id) => {
    const meeting = meetings.find(m => m.id === id);
    const updated = meetings.map(m =>
      m.id === id ? { ...m, status: 'completed', completedAt: new Date().toISOString() } : m
    );
    setMeetings(updated);
    localStorage.setItem('mentorMeetings', JSON.stringify(updated));
    addNotification('success', `Встреча "${meeting?.title}" отмечена как проведённая!`);

    const currentPoints = localStorage.getItem('activityPoints');
    const newPoints = (currentPoints ? parseInt(currentPoints) : 0) + 30;
    localStorage.setItem('activityPoints', newPoints.toString());
  };

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.menteeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '12px', marginBottom: '20px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginBottom: '20px' },
    meetingCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)' },
    meetingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' },
    meetingTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    meetingInfo: { display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap', marginBottom: '12px' },
    meetingDescription: { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', padding: '10px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' },
    meetingActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', transition: 'all 0.2s' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '550px', width: '90%' },
    modalTitle: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical', outline: 'none' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' },
    row: { display: 'flex', gap: '12px' },
    half: { flex: 1 },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Calendar size={28} color="#FF6611" /> Расписание встреч</h1>
        <p style={styles.subtitle}>Назначайте, редактируйте и отменяйте встречи с подопечными</p>
      </div>

      <div style={styles.searchBox}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Поиск встреч..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <button onClick={() => setIsAdding(true)} style={styles.addBtn}>
        <Plus size={16} /> Назначить встречу
      </button>

      {filteredMeetings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Нет запланированных встреч</p>
          <button onClick={() => setIsAdding(true)} style={{ ...styles.addBtn, marginTop: '16px', display: 'inline-flex' }}>Назначить первую встречу</button>
        </div>
      ) : (
        filteredMeetings.map(meeting => (
          <div key={meeting.id} style={styles.meetingCard}>
            <div style={styles.meetingHeader}>
              <span style={styles.meetingTitle}>{meeting.title}</span>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                backgroundColor: meeting.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(255,102,17,0.1)',
                color: meeting.status === 'completed' ? '#22C55E' : '#FF6611'
              }}>
                {meeting.status === 'completed' ? 'Проведена' : 'Запланирована'}
              </span>
            </div>
            <div style={styles.meetingInfo}>
              <span><Users size={14} /> {meeting.menteeName}</span>
              <span><Calendar size={14} /> {meeting.date}</span>
              <span><Clock size={14} /> {meeting.time}</span>
              <span>⏱️ {meeting.duration === '0.5' ? '30 мин' : meeting.duration === '1' ? '1 час' : meeting.duration === '1.5' ? '1.5 часа' : '2 часа'}</span>
              <span>{meeting.type === 'online' ? '💻 Онлайн' : '📍 Офлайн'}</span>
            </div>
            {meeting.description && <div style={styles.meetingDescription}>{meeting.description}</div>}
            {meeting.link && (
              <div style={{ fontSize: '12px', color: '#FF6611', marginBottom: '8px' }}>
                🔗 <a href={meeting.link} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6611' }}>{meeting.link}</a>
              </div>
            )}
            <div style={styles.meetingActions}>
              {meeting.status !== 'completed' && (
                <>
                  <button onClick={() => startEdit(meeting)} style={{ ...styles.actionBtn, color: '#FF6611' }}><Edit2 size={14} /> Редактировать</button>
                  <button onClick={() => completeMeeting(meeting.id)} style={{ ...styles.actionBtn, color: '#22C55E' }}><CheckCircle size={14} /> Проведена</button>
                  <button onClick={() => cancelMeeting(meeting.id)} style={{ ...styles.actionBtn, color: '#EF4444' }}><Trash2 size={14} /> Отменить</button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {/* Модальное окно создания встречи */}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Назначить встречу</h2>
            <input placeholder="Тема встречи *" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} style={styles.input} />
            <textarea placeholder="Описание" rows={2} value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} style={styles.textarea} />
            <select value={newMeeting.menteeId} onChange={e => setNewMeeting({...newMeeting, menteeId: e.target.value})} style={styles.select}>
              <option value="">Выберите подопечного *</option>
              {mentees.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div style={styles.row}>
              <div style={styles.half}><input type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} placeholder="Дата *" style={styles.input} /></div>
              <div style={styles.half}><input type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} placeholder="Время *" style={styles.input} /></div>
            </div>
            <div style={styles.row}>
              <div style={styles.half}>
                <select value={newMeeting.duration} onChange={e => setNewMeeting({...newMeeting, duration: e.target.value})} style={styles.select}>
                  <option value="0.5">30 минут</option>
                  <option value="1">1 час</option>
                  <option value="1.5">1.5 часа</option>
                  <option value="2">2 часа</option>
                </select>
              </div>
              <div style={styles.half}>
                <select value={newMeeting.type} onChange={e => setNewMeeting({...newMeeting, type: e.target.value})} style={styles.select}>
                  <option value="online">💻 Онлайн</option>
                  <option value="offline">📍 Офлайн</option>
                </select>
              </div>
            </div>
            {newMeeting.type === 'online' && (
              <input placeholder="Ссылка на встречу" value={newMeeting.link} onChange={e => setNewMeeting({...newMeeting, link: e.target.value})} style={styles.input} />
            )}
            <div style={styles.modalButtons}>
              <button onClick={addMeeting} style={styles.saveBtn}>Назначить</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {isEditing && editingMeeting && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Редактировать встречу</h2>
            <input placeholder="Тема встречи" value={editingMeeting.title} onChange={e => setEditingMeeting({...editingMeeting, title: e.target.value})} style={styles.input} />
            <textarea placeholder="Описание" rows={2} value={editingMeeting.description} onChange={e => setEditingMeeting({...editingMeeting, description: e.target.value})} style={styles.textarea} />
            <div style={styles.row}>
              <div style={styles.half}><input type="date" value={editingMeeting.date} onChange={e => setEditingMeeting({...editingMeeting, date: e.target.value})} style={styles.input} /></div>
              <div style={styles.half}><input type="time" value={editingMeeting.time} onChange={e => setEditingMeeting({...editingMeeting, time: e.target.value})} style={styles.input} /></div>
            </div>
            <div style={styles.row}>
              <div style={styles.half}>
                <select value={editingMeeting.duration} onChange={e => setEditingMeeting({...editingMeeting, duration: e.target.value})} style={styles.select}>
                  <option value="0.5">30 минут</option>
                  <option value="1">1 час</option>
                  <option value="1.5">1.5 часа</option>
                  <option value="2">2 часа</option>
                </select>
              </div>
              <div style={styles.half}>
                <select value={editingMeeting.type} onChange={e => setEditingMeeting({...editingMeeting, type: e.target.value})} style={styles.select}>
                  <option value="online">💻 Онлайн</option>
                  <option value="offline">📍 Офлайн</option>
                </select>
              </div>
            </div>
            {editingMeeting.type === 'online' && (
              <input placeholder="Ссылка на встречу" value={editingMeeting.link} onChange={e => setEditingMeeting({...editingMeeting, link: e.target.value})} style={styles.input} />
            )}
            <div style={styles.modalButtons}>
              <button onClick={updateMeeting} style={styles.saveBtn}>Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;