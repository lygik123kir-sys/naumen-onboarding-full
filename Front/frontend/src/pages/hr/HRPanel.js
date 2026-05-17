import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import {
  Calendar, BarChart3, Award, Plus, Edit2, Trash2, X,
  Save, Calendar as CalendarIcon, Users, Settings,
  Trophy, Gift, Star, CheckCircle, AlertCircle,
  BookOpen, FileText, Upload, Globe, Link as LinkIcon,
  Video, Music, Gamepad, Coffee, Heart, Smile, Zap, Flame
} from 'lucide-react';

const HRPanel = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [polls, setPolls] = useState([]);
  const [winners, setWinners] = useState([]);
  const [contests, setContests] = useState([]);
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState([]);

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingPoll, setIsAddingPoll] = useState(false);
  const [isAddingWinner, setIsAddingWinner] = useState(false);
  const [isAddingContest, setIsAddingContest] = useState(false);
  const [isAddingGlossary, setIsAddingGlossary] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [isEditingWinner, setIsEditingWinner] = useState(false);
  const [isEditingGlossary, setIsEditingGlossary] = useState(false);
  const [isEditingKnowledge, setIsEditingKnowledge] = useState(false);
  const [editWinner, setEditWinner] = useState(null);
  const [editingGlossary, setEditingGlossary] = useState(null);
  const [editingKnowledge, setEditingKnowledge] = useState(null);

  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', location: '', type: 'social', maxParticipants: 50, points: 50 });
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''], endDate: '' });
  const [newWinner, setNewWinner] = useState({
    name: '', position: '', achievement: '', reason: '', points: 100, badge: '🥇', photo: null
  });
  const [newContest, setNewContest] = useState({
    question: '', options: ['', '', '', ''], correctAnswer: 0, prize: 100, deadline: ''
  });
  const [newGlossary, setNewGlossary] = useState({ term: '', definition: '', category: '', example: '' });
  const [newKnowledge, setNewKnowledge] = useState({ title: '', content: '', category: '', type: 'article', file: null });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    loadEvents();
    loadPolls();
    loadWinners();
    loadContests();
    loadGlossary();
    loadKnowledge();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('companyEvents');
    setEvents(saved ? JSON.parse(saved) : []);
  };

  const loadPolls = () => {
    const saved = localStorage.getItem('companyPolls');
    setPolls(saved ? JSON.parse(saved) : []);
  };

  const loadWinners = () => {
    const saved = localStorage.getItem('honorBoard');
    setWinners(saved ? JSON.parse(saved) : []);
  };

  const loadContests = () => {
    const saved = localStorage.getItem('contests');
    setContests(saved ? JSON.parse(saved) : []);
  };

  const loadGlossary = () => {
    const saved = localStorage.getItem('glossaryTerms');
    setGlossaryTerms(saved ? JSON.parse(saved) : []);
  };

  const loadKnowledge = () => {
    const saved = localStorage.getItem('knowledgeBase');
    setKnowledgeArticles(saved ? JSON.parse(saved) : []);
  };

  const buttonStyles = {
    primary: {
      backgroundColor: '#FF6611',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: '12px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s'
    },
    danger: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    success: {
      backgroundColor: '#22C55E',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  };

  // ========== СОБЫТИЯ ==========
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event = { id: Date.now(), ...newEvent, registered: 0 };
    const updated = [...events, event];
    setEvents(updated);
    localStorage.setItem('companyEvents', JSON.stringify(updated));
    setIsAddingEvent(false);
    setNewEvent({ title: '', description: '', date: '', time: '', location: '', type: 'social', maxParticipants: 50, points: 50 });
    addNotification('success', 'Событие создано!');
  };

  const deleteEvent = (id) => {
    if (window.confirm('Удалить событие?')) {
      const updated = events.filter(e => e.id !== id);
      setEvents(updated);
      localStorage.setItem('companyEvents', JSON.stringify(updated));
      addNotification('success', 'Событие удалено');
    }
  };

  // ========== ОПРОСЫ ==========
  const addPoll = () => {
    if (!newPoll.question || newPoll.options.some(opt => !opt)) return;
    const poll = { id: Date.now(), ...newPoll, votes: new Array(newPoll.options.length).fill(0), totalVotes: 0, status: 'active', createdBy: user?.email };
    const updated = [...polls, poll];
    setPolls(updated);
    localStorage.setItem('companyPolls', JSON.stringify(updated));
    setIsAddingPoll(false);
    setNewPoll({ question: '', options: ['', ''], endDate: '' });
    addNotification('success', 'Опрос создан!');
  };

  const deletePoll = (id) => {
    if (window.confirm('Удалить опрос?')) {
      const updated = polls.filter(p => p.id !== id);
      setPolls(updated);
      localStorage.setItem('companyPolls', JSON.stringify(updated));
      addNotification('success', 'Опрос удалён');
    }
  };

  // ========== ДОСКА ПОЧЁТА ==========
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setNewWinner({ ...newWinner, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addWinner = () => {
    if (!newWinner.name || !newWinner.achievement) return;
    const winner = {
      id: Date.now(),
      ...newWinner,
      likes: 0,
      avatar: newWinner.name.charAt(0),
      date: new Date().toISOString().slice(0,7),
      photo: newWinner.photo || null
    };
    const updated = [...winners, winner];
    setWinners(updated);
    localStorage.setItem('honorBoard', JSON.stringify(updated));
    setIsAddingWinner(false);
    setNewWinner({ name: '', position: '', achievement: '', reason: '', points: 100, badge: '🥇', photo: null });
    setPhotoPreview(null);
    addNotification('success', 'Победитель добавлен на доску почёта!');
  };

  const deleteWinner = (id) => {
    if (window.confirm('Удалить запись?')) {
      const updated = winners.filter(w => w.id !== id);
      setWinners(updated);
      localStorage.setItem('honorBoard', JSON.stringify(updated));
      addNotification('success', 'Запись удалена');
    }
  };

  // ========== КОНКУРСЫ ==========
  const addContest = () => {
    if (!newContest.question || newContest.options.some(opt => !opt)) {
      addNotification('error', 'Заполните все поля!');
      return;
    }
    const contest = {
      id: Date.now(),
      ...newContest,
      status: 'active',
      participants: 0,
      winners: [],
      createdBy: user?.email,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...contests, contest];
    setContests(updated);
    localStorage.setItem('contests', JSON.stringify(updated));
    setIsAddingContest(false);
    setNewContest({ question: '', options: ['', '', '', ''], correctAnswer: 0, prize: 100, deadline: '' });
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

  // ========== ГЛОССАРИЙ ==========
  const addGlossaryTerm = () => {
    if (!newGlossary.term || !newGlossary.definition) {
      addNotification('error', 'Заполните термин и определение');
      return;
    }
    const term = {
      id: Date.now(),
      ...newGlossary,
      createdBy: user?.email,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...glossaryTerms, term];
    setGlossaryTerms(updated);
    localStorage.setItem('glossaryTerms', JSON.stringify(updated));
    setIsAddingGlossary(false);
    setNewGlossary({ term: '', definition: '', category: '', example: '' });
    addNotification('success', 'Термин добавлен в глоссарий!');
  };

  const updateGlossaryTerm = () => {
    if (!editingGlossary) return;
    const updated = glossaryTerms.map(t => t.id === editingGlossary.id ? editingGlossary : t);
    setGlossaryTerms(updated);
    localStorage.setItem('glossaryTerms', JSON.stringify(updated));
    setIsEditingGlossary(false);
    setEditingGlossary(null);
    addNotification('success', 'Термин обновлён');
  };

  const deleteGlossaryTerm = (id) => {
    if (window.confirm('Удалить термин?')) {
      const updated = glossaryTerms.filter(t => t.id !== id);
      setGlossaryTerms(updated);
      localStorage.setItem('glossaryTerms', JSON.stringify(updated));
      addNotification('success', 'Термин удалён');
    }
  };

  // ========== БАЗА ЗНАНИЙ ==========
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setNewKnowledge({ ...newKnowledge, file: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const addKnowledgeArticle = () => {
    if (!newKnowledge.title || !newKnowledge.content) {
      addNotification('error', 'Заполните заголовок и содержание');
      return;
    }
    const article = {
      id: Date.now(),
      ...newKnowledge,
      views: 0,
      likes: 0,
      createdBy: user?.email,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...knowledgeArticles, article];
    setKnowledgeArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    setIsAddingKnowledge(false);
    setNewKnowledge({ title: '', content: '', category: '', type: 'article', file: null });
    setFilePreview(null);
    addNotification('success', 'Статья добавлена в базу знаний!');
  };

  const updateKnowledgeArticle = () => {
    if (!editingKnowledge) return;
    const updated = knowledgeArticles.map(a => a.id === editingKnowledge.id ? editingKnowledge : a);
    setKnowledgeArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    setIsEditingKnowledge(false);
    setEditingKnowledge(null);
    addNotification('success', 'Статья обновлена');
  };

  const deleteKnowledgeArticle = (id) => {
    if (window.confirm('Удалить статью?')) {
      const updated = knowledgeArticles.filter(a => a.id !== id);
      setKnowledgeArticles(updated);
      localStorage.setItem('knowledgeBase', JSON.stringify(updated));
      addNotification('success', 'Статья удалена');
    }
  };

  const categories = [
    { id: 'hr', name: 'HR' },
    { id: 'it', name: 'IT' },
    { id: 'learning', name: 'Обучение' },
    { id: 'rules', name: 'Регламенты' },
    { id: 'faq', name: 'ЧаВо' }
  ];

  const glossaryCategories = ['Технические', 'Бизнес', 'HR', 'Общие', 'Процессы'];

  const styles = {
    container: { maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', flexWrap: 'wrap' },
    tab: { padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { backgroundColor: '#FF6611', color: 'white' },
    card: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '16px', marginBottom: '12px', border: '1px solid var(--border-light)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
    cardTitle: { fontWeight: '600', color: 'var(--text-primary)' },
    cardSubtitle: { fontSize: '12px', color: 'var(--text-muted)' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '550px', width: '90%', maxHeight: '85vh', overflow: 'auto' },
    modalTitle: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical', outline: 'none' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' },
    fileUpload: { width: '100%', padding: '20px', backgroundColor: 'var(--bg-primary)', border: '2px dashed var(--border-light)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    chartBars: { display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '20px 0', marginBottom: '20px' },
    bar: { flex: 1, backgroundColor: '#FF6611', borderRadius: '8px', transition: 'height 0.5s ease', cursor: 'pointer' },
    barLabel: { fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }
  };

  const weeklyData = [
    { week: 'Неделя 1', value: 65 },
    { week: 'Неделя 2', value: 72 },
    { week: 'Неделя 3', value: 68 },
    { week: 'Неделя 4', value: 78 },
    { week: 'Неделя 5', value: 82 },
    { week: 'Неделя 6', value: 85 },
    { week: 'Неделя 7', value: 88 }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎮 Панель управления</h1>
        <p style={styles.subtitle}>Управление всеми модулями платформы</p>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('events')} style={{ ...styles.tab, ...(activeTab === 'events' && styles.tabActive) }}>
          <Calendar size={16} /> События
        </button>
        <button onClick={() => setActiveTab('polls')} style={{ ...styles.tab, ...(activeTab === 'polls' && styles.tabActive) }}>
          <BarChart3 size={16} /> Опросы
        </button>
        <button onClick={() => setActiveTab('leaderboard')} style={{ ...styles.tab, ...(activeTab === 'leaderboard' && styles.tabActive) }}>
          <Award size={16} /> Доска почёта
        </button>
        <button onClick={() => setActiveTab('contests')} style={{ ...styles.tab, ...(activeTab === 'contests' && styles.tabActive) }}>
          <Trophy size={16} /> Конкурсы
        </button>
        <button onClick={() => setActiveTab('glossary')} style={{ ...styles.tab, ...(activeTab === 'glossary' && styles.tabActive) }}>
          <BookOpen size={16} /> Глоссарий
        </button>
        <button onClick={() => setActiveTab('knowledge')} style={{ ...styles.tab, ...(activeTab === 'knowledge' && styles.tabActive) }}>
          <FileText size={16} /> База знаний
        </button>
      </div>

      {/* Вкладка СОБЫТИЯ */}
      {activeTab === 'events' && (
        <>
          <button onClick={() => setIsAddingEvent(true)} style={buttonStyles.primary}>
            <Plus size={16} /> Создать событие
          </button>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Нет событий. Создайте первое!</div>
          ) : (
            events.map(event => (
              <div key={event.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{event.title}</span>
                  <button onClick={() => deleteEvent(event.id)} style={buttonStyles.danger}>
                    <Trash2 size={14} /> Удалить
                  </button>
                </div>
                <div style={styles.cardSubtitle}>{event.date} {event.time} • {event.location}</div>
                <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>
                  👥 {event.registered || 0}/{event.maxParticipants} • +{event.points} баллов
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Вкладка ОПРОСЫ */}
      {activeTab === 'polls' && (
        <>
          <button onClick={() => setIsAddingPoll(true)} style={buttonStyles.primary}>
            <Plus size={16} /> Создать опрос
          </button>
          {polls.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Нет опросов. Создайте первый!</div>
          ) : (
            polls.map(poll => (
              <div key={poll.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{poll.question}</span>
                  <button onClick={() => deletePoll(poll.id)} style={buttonStyles.danger}>
                    <Trash2 size={14} /> Удалить
                  </button>
                </div>
                <div style={styles.cardSubtitle}>📊 {poll.totalVotes} участников • До {poll.endDate}</div>
              </div>
            ))
          )}
        </>
      )}

      {/* Вкладка ДОСКА ПОЧЁТА */}
      {activeTab === 'leaderboard' && (
        <>
          <button onClick={() => setIsAddingWinner(true)} style={buttonStyles.primary}>
            <Plus size={16} /> Добавить победителя
          </button>
          {winners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Нет победителей. Добавьте первого!</div>
          ) : (
            winners.map(winner => (
              <div key={winner.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {winner.photo ? (
                      <img src={winner.photo} alt={winner.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6611, #E55A0E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{winner.avatar}</div>
                    )}
                    <span style={styles.cardTitle}>{winner.name} - {winner.achievement}</span>
                  </div>
                  <button onClick={() => deleteWinner(winner.id)} style={buttonStyles.danger}>
                    <Trash2 size={14} /> Удалить
                  </button>
                </div>
                <div style={styles.cardSubtitle}>{winner.reason}</div>
                <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>🏆 {winner.points} баллов • 👍 {winner.likes || 0}</div>
              </div>
            ))
          )}
        </>
      )}

      {/* Вкладка КОНКУРСЫ */}
      {activeTab === 'contests' && (
        <>
          <button onClick={() => setIsAddingContest(true)} style={buttonStyles.primary}>
            <Plus size={16} /> Создать конкурс
          </button>
          {contests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Нет конкурсов. Создайте первый!</div>
          ) : (
            contests.map(contest => (
              <div key={contest.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{contest.question}</span>
                  <button onClick={() => deleteContest(contest.id)} style={buttonStyles.danger}>
                    <Trash2 size={14} /> Удалить
                  </button>
                </div>
                <div style={styles.cardSubtitle}>🎁 Приз: {contest.prize} баллов • Участников: {contest.participants || 0}</div>
                <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-muted)' }}>📅 До {contest.deadline}</div>
              </div>
            ))
          )}
        </>
      )}

      {/* Вкладка ГЛОССАРИЙ */}
      {activeTab === 'glossary' && (
        <>
          <button onClick={() => setIsAddingGlossary(true)} style={buttonStyles.primary}>
            <Plus size={16} /> Добавить термин
          </button>
          {glossaryTerms.map(term => (
            <div key={term.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>📖 {term.term}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setEditingGlossary(term); setIsEditingGlossary(true); }} style={buttonStyles.secondary}>
                    <Edit2 size={14} /> Редактировать
                  </button>
                  <button onClick={() => deleteGlossaryTerm(term.id)} style={buttonStyles.danger}>
                    <Trash2 size={14} /> Удалить
                  </button>
                </div>
              </div>
              <div style={styles.cardSubtitle}>{term.definition}</div>
              {term.example && <div style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-muted)' }}>📌 Пример: {term.example}</div>}
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#FF6611' }}>📁 {term.category || 'Без категории'}</div>
            </div>
          ))}
        </>
      )}

      {/* Вкладка БАЗА ЗНАНИЙ */}
      {activeTab === 'knowledge' && (
        <>
          <button onClick={() => setIsAddingKnowledge(true)} style={buttonStyles.primary}>
            <Plus size={16} /> Добавить статью
          </button>
          {knowledgeArticles.map(article => (
            <div key={article.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>📄 {article.title}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setEditingKnowledge(article); setIsEditingKnowledge(true); }} style={buttonStyles.secondary}>
                    <Edit2 size={14} /> Редактировать
                  </button>
                  <button onClick={() => deleteKnowledgeArticle(article.id)} style={buttonStyles.danger}>
                    <Trash2 size={14} /> Удалить
                  </button>
                </div>
              </div>
              <div style={styles.cardSubtitle}>{article.content.substring(0, 100)}...</div>
              <div style={{ fontSize: '11px', marginTop: '4px', display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                <span>👁️ {article.views || 0} просмотров</span>
                <span>📁 {article.category}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Модальное окно редактирования глоссария */}
      {isEditingGlossary && editingGlossary && (
        <div style={styles.modalOverlay} onClick={() => setIsEditingGlossary(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Редактировать термин</h2>
            <input placeholder="Термин" value={editingGlossary.term} onChange={e => setEditingGlossary({...editingGlossary, term: e.target.value})} style={styles.input} />
            <textarea placeholder="Определение" rows={3} value={editingGlossary.definition} onChange={e => setEditingGlossary({...editingGlossary, definition: e.target.value})} style={styles.textarea} />
            <select value={editingGlossary.category} onChange={e => setEditingGlossary({...editingGlossary, category: e.target.value})} style={styles.select}>
              <option value="">Выберите категорию</option>
              {glossaryCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <textarea placeholder="Пример использования" rows={2} value={editingGlossary.example} onChange={e => setEditingGlossary({...editingGlossary, example: e.target.value})} style={styles.textarea} />
            <div style={styles.modalButtons}>
              <button onClick={updateGlossaryTerm} style={buttonStyles.success}>Сохранить</button>
              <button onClick={() => setIsEditingGlossary(false)} style={buttonStyles.secondary}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования базы знаний */}
      {isEditingKnowledge && editingKnowledge && (
        <div style={styles.modalOverlay} onClick={() => setIsEditingKnowledge(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Редактировать статью</h2>
            <input placeholder="Заголовок" value={editingKnowledge.title} onChange={e => setEditingKnowledge({...editingKnowledge, title: e.target.value})} style={styles.input} />
            <select value={editingKnowledge.type} onChange={e => setEditingKnowledge({...editingKnowledge, type: e.target.value})} style={styles.select}>
              <option value="article">📄 Статья</option>
              <option value="video">🎥 Видео</option>
              <option value="link">🔗 Ссылка</option>
            </select>
            <select value={editingKnowledge.category} onChange={e => setEditingKnowledge({...editingKnowledge, category: e.target.value})} style={styles.select}>
              <option value="">Выберите категорию</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
            <textarea placeholder="Содержание" rows={5} value={editingKnowledge.content} onChange={e => setEditingKnowledge({...editingKnowledge, content: e.target.value})} style={styles.textarea} />
            <div style={styles.modalButtons}>
              <button onClick={updateKnowledgeArticle} style={buttonStyles.success}>Сохранить</button>
              <button onClick={() => setIsEditingKnowledge(false)} style={buttonStyles.secondary}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления события */}
      {isAddingEvent && (
        <div style={styles.modalOverlay} onClick={() => setIsAddingEvent(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создать событие</h2>
            <input placeholder="Название" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.input} />
            <textarea placeholder="Описание" rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} style={styles.textarea} />
            <input placeholder="Дата (ГГГГ-ММ-ДД)" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={styles.input} />
            <input placeholder="Время" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} style={styles.input} />
            <input placeholder="Место" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} style={styles.input} />
            <input placeholder="Макс. участников" type="number" value={newEvent.maxParticipants} onChange={e => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value)})} style={styles.input} />
            <input placeholder="Баллов за участие" type="number" value={newEvent.points} onChange={e => setNewEvent({...newEvent, points: parseInt(e.target.value)})} style={styles.input} />
            <div style={styles.modalButtons}>
              <button onClick={addEvent} style={buttonStyles.success}>Создать</button>
              <button onClick={() => setIsAddingEvent(false)} style={buttonStyles.secondary}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления опроса */}
      {isAddingPoll && (
        <div style={styles.modalOverlay} onClick={() => setIsAddingPoll(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создать опрос</h2>
            <input placeholder="Вопрос" value={newPoll.question} onChange={e => setNewPoll({...newPoll, question: e.target.value})} style={styles.input} />
            {newPoll.options.map((opt, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <input placeholder={`Вариант ${idx + 1}`} value={opt} onChange={e => { const newOpts = [...newPoll.options]; newOpts[idx] = e.target.value; setNewPoll({...newPoll, options: newOpts}); }} style={styles.input} />
              </div>
            ))}
            <button onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})} style={{ fontSize: '12px', marginBottom: '12px', background: 'none', border: 'none', color: '#FF6611', cursor: 'pointer' }}>+ Добавить вариант</button>
            <input placeholder="Дата окончания" value={newPoll.endDate} onChange={e => setNewPoll({...newPoll, endDate: e.target.value})} style={styles.input} />
            <div style={styles.modalButtons}>
              <button onClick={addPoll} style={buttonStyles.success}>Создать</button>
              <button onClick={() => setIsAddingPoll(false)} style={buttonStyles.secondary}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления победителя */}
      {isAddingWinner && (
        <div style={styles.modalOverlay} onClick={() => setIsAddingWinner(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Добавить победителя</h2>
            <label style={styles.fileUpload}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto', display: 'block' }} />
              ) : (
                <>
                  <Upload size={24} color="var(--text-muted)" />
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>Загрузить фото</div>
                </>
              )}
            </label>
            <input placeholder="Имя" value={newWinner.name} onChange={e => setNewWinner({...newWinner, name: e.target.value})} style={styles.input} />
            <input placeholder="Должность" value={newWinner.position} onChange={e => setNewWinner({...newWinner, position: e.target.value})} style={styles.input} />
            <input placeholder="Достижение" value={newWinner.achievement} onChange={e => setNewWinner({...newWinner, achievement: e.target.value})} style={styles.input} />
            <textarea placeholder="Причина" rows={3} value={newWinner.reason} onChange={e => setNewWinner({...newWinner, reason: e.target.value})} style={styles.textarea} />
            <input placeholder="Баллов" type="number" value={newWinner.points} onChange={e => setNewWinner({...newWinner, points: parseInt(e.target.value)})} style={styles.input} />
            <select value={newWinner.badge} onChange={e => setNewWinner({...newWinner, badge: e.target.value})} style={styles.select}>
              <option value="🥇">🥇 Золото</option>
              <option value="🥈">🥈 Серебро</option>
              <option value="🥉">🥉 Бронза</option>
            </select>
            <div style={styles.modalButtons}>
              <button onClick={addWinner} style={buttonStyles.success}>Добавить</button>
              <button onClick={() => setIsAddingWinner(false)} style={buttonStyles.secondary}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления конкурса */}
      {isAddingContest && (
        <div style={styles.modalOverlay} onClick={() => setIsAddingContest(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создать конкурс</h2>
            <textarea rows={3} placeholder="Вопрос конкурса" value={newContest.question} onChange={e => setNewContest({...newContest, question: e.target.value})} style={styles.textarea} />
            {newContest.options.map((opt, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <input placeholder={`Вариант ${idx + 1}`} value={opt} onChange={e => { const newOpts = [...newContest.options]; newOpts[idx] = e.target.value; setNewContest({...newContest, options: newOpts}); }} style={styles.input} />
              </div>
            ))}
            <button onClick={() => setNewContest({...newContest, options: [...newContest.options, '']})} style={{ fontSize: '12px', marginBottom: '12px', background: 'none', border: 'none', color: '#FF6611', cursor: 'pointer' }}>+ Добавить вариант</button>
            <select value={newContest.correctAnswer} onChange={e => setNewContest({...newContest, correctAnswer: parseInt(e.target.value)})} style={styles.select}>
              {newContest.options.map((_, idx) => <option key={idx} value={idx}>Правильный ответ: вариант {idx + 1}</option>)}
            </select>
            <input type="number" placeholder="Количество баллов" value={newContest.prize} onChange={e => setNewContest({...newContest, prize: parseInt(e.target.value)})} style={styles.input} />
            <input type="date" placeholder="Дата окончания" value={newContest.deadline} onChange={e => setNewContest({...newContest, deadline: e.target.value})} style={styles.input} />
            <div style={styles.modalButtons}>
              <button onClick={addContest} style={buttonStyles.success}>Создать конкурс</button>
              <button onClick={() => setIsAddingContest(false)} style={buttonStyles.secondary}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRPanel;