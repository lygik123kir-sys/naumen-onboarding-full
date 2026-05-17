import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Trophy, Star, Heart, Zap, Award, Medal, Sparkles, Flame, Smile, Book, Coffee, Camera, Music, Gamepad, Briefcase, CheckCircle } from 'lucide-react';

const iconOptions = [
  { name: '🌱', value: '🌱', category: 'nature' },
  { name: '🦋', value: '🦋', category: 'nature' },
  { name: '🔥', value: '🔥', category: 'energy' },
  { name: '🤝', value: '🤝', category: 'social' },
  { name: '🎓', value: '🎓', category: 'education' },
  { name: '⭐', value: '⭐', category: 'reward' },
  { name: '💻', value: '💻', category: 'work' },
  { name: '📝', value: '📝', category: 'work' },
  { name: '🏆', value: '🏆', category: 'reward' },
  { name: '🎯', value: '🎯', category: 'goal' },
  { name: '💡', value: '💡', category: 'idea' },
  { name: '🚀', value: '🚀', category: 'growth' },
  { name: '🎨', value: '🎨', category: 'creative' },
  { name: '📚', value: '📚', category: 'learning' },
  { name: '🎵', value: '🎵', category: 'music' },
  { name: '⚡', value: '⚡', category: 'energy' },
  { name: '💪', value: '💪', category: 'strength' },
  { name: '🌟', value: '🌟', category: 'star' }
];

const AchievementsManager = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [achievements, setAchievements] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    name: '',
    description: '',
    icon: '🏆',
    category: 'onboarding',
    xp: 100,
    requiredCount: 1,
    isActive: true
  });
  const [editAchievement, setEditAchievement] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const saved = localStorage.getItem('customAchievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      const defaultAchievements = [
        { id: 1, name: 'Первый шаг', description: 'Завершена первая задача', icon: '🌱', category: 'onboarding', xp: 50, requiredCount: 1, isActive: true, createdAt: '2026-01-01' },
        { id: 2, name: 'Социальный бабочка', description: 'Познакомился с 10 коллегами', icon: '🦋', category: 'social', xp: 100, requiredCount: 10, isActive: true, createdAt: '2026-01-01' },
        { id: 3, name: 'Стрелок', description: '7-дневный стрик', icon: '🔥', category: 'streak', xp: 150, requiredCount: 7, isActive: true, createdAt: '2026-01-01' },
        { id: 4, name: 'Помощник', description: 'Помог другому новичку', icon: '🤝', category: 'social', xp: 200, requiredCount: 5, isActive: true, createdAt: '2026-01-01' },
        { id: 5, name: 'Эксперт', description: 'Завершён этап погружения', icon: '🎓', category: 'onboarding', xp: 300, requiredCount: 1, isActive: true, createdAt: '2026-01-01' }
      ];
      setAchievements(defaultAchievements);
      localStorage.setItem('customAchievements', JSON.stringify(defaultAchievements));
    }
  };

  const addAchievement = () => {
    if (!newAchievement.name || !newAchievement.description) {
      addNotification('error', 'Заполните название и описание');
      return;
    }
    const achievement = {
      id: Date.now(),
      ...newAchievement,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...achievements, achievement];
    setAchievements(updated);
    localStorage.setItem('customAchievements', JSON.stringify(updated));
    setIsAdding(false);
    setNewAchievement({
      name: '',
      description: '',
      icon: '🏆',
      category: 'onboarding',
      xp: 100,
      requiredCount: 1,
      isActive: true
    });
    addNotification('success', 'Достижение создано!');
  };

  const updateAchievement = () => {
    if (!editAchievement) return;
    const updated = achievements.map(a => a.id === editAchievement.id ? editAchievement : a);
    setAchievements(updated);
    localStorage.setItem('customAchievements', JSON.stringify(updated));
    setIsEditing(false);
    setEditAchievement(null);
    addNotification('success', 'Достижение обновлено!');
  };

  const deleteAchievement = (id) => {
    if (window.confirm('Удалить достижение?')) {
      const updated = achievements.filter(a => a.id !== id);
      setAchievements(updated);
      localStorage.setItem('customAchievements', JSON.stringify(updated));
      addNotification('success', 'Достижение удалено');
    }
  };

  const startEdit = (achievement) => {
    setEditAchievement({ ...achievement });
    setIsEditing(true);
  };

  const categories = [
    { id: 'onboarding', name: 'Онбординг', icon: '🎓' },
    { id: 'social', name: 'Социальные', icon: '👥' },
    { id: 'streak', name: 'Активность', icon: '🔥' },
    { id: 'technical', name: 'Технические', icon: '💻' },
    { id: 'knowledge', name: 'Знания', icon: '📚' },
    { id: 'leadership', name: 'Лидерство', icon: '👑' }
  ];

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginBottom: '20px' },
    card: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
    cardTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '85vh', overflow: 'auto' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px' },
    iconGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '16px' },
    iconOption: { fontSize: '28px', padding: '8px', textAlign: 'center', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s', backgroundColor: 'var(--bg-primary)' },
    iconSelected: { backgroundColor: '#FF6611', transform: 'scale(1.05)' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' },
    editBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#FF6611', marginRight: '8px', padding: '4px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Trophy size={28} color="#FF6611" /> Управление достижениями</h1>
        <p style={styles.subtitle}>Создавайте, редактируйте и удаляйте достижения для сотрудников</p>
      </div>

      <button onClick={() => setIsAdding(true)} style={styles.addBtn}>
        <Plus size={16} /> Создать достижение
      </button>

      {achievements.map(ach => (
        <div key={ach.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{ach.icon}</span>
              <span style={styles.cardTitle}>{ach.name}</span>
            </div>
            <div>
              <button onClick={() => startEdit(ach)} style={styles.editBtn}><Edit2 size={16} /></button>
              <button onClick={() => deleteAchievement(ach.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}><Trash2 size={16} /></button>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{ach.description}</div>
          <div style={{ fontSize: '12px', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>📁 {categories.find(c => c.id === ach.category)?.name || ach.category}</span>
            <span>⭐ +{ach.xp} XP</span>
            <span>🎯 {ach.requiredCount} {ach.requiredCount === 1 ? 'раз' : 'раз'}</span>
            {ach.isActive && <span style={{ color: '#22C55E' }}>● Активно</span>}
          </div>
        </div>
      ))}

      {/* Модальное окно добавления */}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Создать достижение</h2>
            <input placeholder="Название" value={newAchievement.name} onChange={e => setNewAchievement({...newAchievement, name: e.target.value})} style={styles.input} />
            <textarea placeholder="Описание" rows={2} value={newAchievement.description} onChange={e => setNewAchievement({...newAchievement, description: e.target.value})} style={styles.textarea} />
            <div style={styles.iconGrid}>
              {iconOptions.map(icon => (
                <div key={icon.value} onClick={() => setNewAchievement({...newAchievement, icon: icon.value})} style={{ ...styles.iconOption, ...(newAchievement.icon === icon.value && styles.iconSelected) }}>{icon.value}</div>
              ))}
            </div>
            <select value={newAchievement.category} onChange={e => setNewAchievement({...newAchievement, category: e.target.value})} style={styles.select}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
            </select>
            <input type="number" placeholder="XP за достижение" value={newAchievement.xp} onChange={e => setNewAchievement({...newAchievement, xp: parseInt(e.target.value)})} style={styles.input} />
            <input type="number" placeholder="Требуется выполнений" value={newAchievement.requiredCount} onChange={e => setNewAchievement({...newAchievement, requiredCount: parseInt(e.target.value)})} style={styles.input} />
            <div style={styles.modalButtons}>
              <button onClick={addAchievement} style={styles.saveBtn}>Создать</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {isEditing && editAchievement && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Редактировать достижение</h2>
            <input placeholder="Название" value={editAchievement.name} onChange={e => setEditAchievement({...editAchievement, name: e.target.value})} style={styles.input} />
            <textarea placeholder="Описание" rows={2} value={editAchievement.description} onChange={e => setEditAchievement({...editAchievement, description: e.target.value})} style={styles.textarea} />
            <div style={styles.iconGrid}>
              {iconOptions.map(icon => (
                <div key={icon.value} onClick={() => setEditAchievement({...editAchievement, icon: icon.value})} style={{ ...styles.iconOption, ...(editAchievement.icon === icon.value && styles.iconSelected) }}>{icon.value}</div>
              ))}
            </div>
            <select value={editAchievement.category} onChange={e => setEditAchievement({...editAchievement, category: e.target.value})} style={styles.select}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
            </select>
            <input type="number" placeholder="XP за достижение" value={editAchievement.xp} onChange={e => setEditAchievement({...editAchievement, xp: parseInt(e.target.value)})} style={styles.input} />
            <input type="number" placeholder="Требуется выполнений" value={editAchievement.requiredCount} onChange={e => setEditAchievement({...editAchievement, requiredCount: parseInt(e.target.value)})} style={styles.input} />
            <div style={styles.modalButtons}>
              <button onClick={updateAchievement} style={styles.saveBtn}>Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsManager;