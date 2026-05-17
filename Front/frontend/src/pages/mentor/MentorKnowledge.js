import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { Plus, Edit2, Trash2, X, Save, FileText, Search, Upload } from 'lucide-react';

const MentorKnowledge = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: '', type: 'article' });
  const [editArticle, setEditArticle] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    const saved = localStorage.getItem('knowledgeBase');
    if (saved) {
      setArticles(JSON.parse(saved));
    } else {
      const defaultArticles = [
        { id: 1, title: 'Как оформить ДМС?', content: 'Для оформления ДМС обратитесь в HR', category: 'HR', type: 'article', views: 45, createdAt: '2026-01-01' },
        { id: 2, title: 'Настройка VPN', content: 'Инструкция по настройке VPN', category: 'IT', type: 'article', views: 128, createdAt: '2026-01-01' }
      ];
      setArticles(defaultArticles);
      localStorage.setItem('knowledgeBase', JSON.stringify(defaultArticles));
    }
  };

  const addArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      addNotification('error', 'Заполните заголовок и содержание');
      return;
    }
    const article = { id: Date.now(), ...newArticle, views: 0, createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...articles, article];
    setArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    setIsAdding(false);
    setNewArticle({ title: '', content: '', category: '', type: 'article' });
    addNotification('success', 'Статья добавлена в базу знаний!');
  };

  const updateArticle = () => {
    if (!editArticle) return;
    const updated = articles.map(a => a.id === editArticle.id ? editArticle : a);
    setArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    setIsEditing(false);
    setEditArticle(null);
    addNotification('success', 'Статья обновлена');
  };

  const deleteArticle = (id) => {
    if (window.confirm('Удалить статью?')) {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem('knowledgeBase', JSON.stringify(updated));
      addNotification('success', 'Статья удалена');
    }
  };

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.content.toLowerCase().includes(searchQuery.toLowerCase()));

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '12px 16px', marginBottom: '20px' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginBottom: '20px' },
    card: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    articleTitle: { fontSize: '18px', fontWeight: '600', color: '#FF6611' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '500px', width: '90%' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><FileText size={28} color="#FF6611" /> Управление базой знаний</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Добавляйте и редактируйте статьи для сотрудников</p>
      </div>
      <div style={styles.searchBox}>
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Поиск статей..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' }} />
      </div>
      <button onClick={() => setIsAdding(true)} style={styles.addBtn}><Plus size={16} /> Добавить статью</button>
      {filteredArticles.map(article => (
        <div key={article.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.articleTitle}>{article.title}</span>
            <div>
              <button onClick={() => { setEditArticle(article); setIsEditing(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6611', marginRight: '8px' }}><Edit2 size={16} /></button>
              <button onClick={() => deleteArticle(article.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{article.content.substring(0, 150)}...</div>
          <div style={{ fontSize: '11px', marginTop: '8px', display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
            <span>👁️ {article.views || 0} просмотров</span>
            <span>📁 {article.category || 'Без категории'}</span>
          </div>
        </div>
      ))}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Добавить статью</h2>
            <input placeholder="Заголовок" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} style={styles.input} />
            <select value={newArticle.type} onChange={e => setNewArticle({...newArticle, type: e.target.value})} style={styles.select}>
              <option value="article">📄 Статья</option>
              <option value="video">🎥 Видео</option>
              <option value="link">🔗 Ссылка</option>
            </select>
            <input placeholder="Категория" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} style={styles.input} />
            <textarea placeholder="Содержание" rows={5} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} style={styles.textarea} />
            <div style={styles.modalButtons}>
              <button onClick={addArticle} style={styles.saveBtn}>Добавить</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorKnowledge;