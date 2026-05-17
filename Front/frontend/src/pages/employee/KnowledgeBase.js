import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Book, FileText, Video, Link as LinkIcon,
  Plus, Edit2, Trash2, X, Filter, Download, Upload, Eye, ChevronRight,
  Star, Clock, ThumbsUp, MessageCircle
} from 'lucide-react';

const KnowledgeBase = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '', content: '', category: '', type: 'article', tags: [], file: null
  });
  const [editArticle, setEditArticle] = useState(null);
  const [popularArticles, setPopularArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);

  const isModerator = user?.role === 'HR_MANAGER' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    const saved = localStorage.getItem('knowledgeBase');
    if (saved) {
      const data = JSON.parse(saved);
      setArticles(data);
      setPopularArticles([...data].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5));
      setRecentArticles([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
    } else {
      const defaultArticles = [
        { id: 1, title: 'Как оформить ДМС?', content: 'Для оформления ДМС необходимо обратиться в HR-отдел с заявлением. После оформления вы получите полис на email в течение 3 рабочих дней.', category: 'HR', type: 'article', tags: ['ДМС', 'страховка'], views: 45, likes: 12, comments: 3, createdAt: '2026-01-01' },
        { id: 2, title: 'Настройка корпоративного VPN', content: '1. Скачайте клиент OpenVPN\n2. Импортируйте конфигурационный файл\n3. Введите логин и пароль\n4. Подключитесь к серверу', category: 'IT', type: 'article', tags: ['VPN', 'доступы'], views: 128, likes: 34, comments: 8, createdAt: '2026-01-01' },
        { id: 3, title: 'Обучение: React для начинающих', content: 'Рекомендуем пройти курс на платформе Stepik. Ссылка на курс будет доступна после запроса у наставника.', category: 'Обучение', type: 'video', tags: ['React', 'курс'], views: 67, likes: 23, comments: 5, createdAt: '2026-01-01' },
        { id: 4, title: 'Правила внутреннего распорядка', content: 'Рабочий день с 10:00 до 19:00. Обед с 13:00 до 14:00. Удалённая работа согласовывается с руководителем.', category: 'Регламенты', type: 'article', tags: ['правила', 'распорядок'], views: 89, likes: 15, comments: 2, createdAt: '2026-01-01' }
      ];
      setArticles(defaultArticles);
      localStorage.setItem('knowledgeBase', JSON.stringify(defaultArticles));
      setPopularArticles(defaultArticles.slice(0, 5));
      setRecentArticles(defaultArticles.slice(0, 5));
    }
  };

  const categories = ['all', 'HR', 'IT', 'Обучение', 'Регламенты', 'ЧаВо'];

  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addArticle = () => {
    if (!newArticle.title || !newArticle.content) return;
    const articleToAdd = {
      id: Date.now(),
      ...newArticle,
      views: 0,
      likes: 0,
      comments: 0,
      createdBy: user?.email,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [articleToAdd, ...articles];
    setArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    setNewArticle({ title: '', content: '', category: '', type: 'article', tags: [], file: null });
    setIsAdding(false);
  };

  const updateArticle = () => {
    if (!editArticle) return;
    const updated = articles.map(a => a.id === editArticle.id ? editArticle : a);
    setArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    setIsEditing(false);
    setEditArticle(null);
  };

  const deleteArticle = (id) => {
    if (window.confirm('Удалить статью?')) {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem('knowledgeBase', JSON.stringify(updated));
    }
  };

  const incrementViews = (id) => {
    const updated = articles.map(a => a.id === id ? { ...a, views: (a.views || 0) + 1 } : a);
    setArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
  };

  const addLike = (id) => {
    const updated = articles.map(a => a.id === id ? { ...a, likes: (a.likes || 0) + 1 } : a);
    setArticles(updated);
    localStorage.setItem('knowledgeBase', JSON.stringify(updated));
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'article': return <FileText size={16} />;
      case 'video': return <Video size={16} />;
      default: return <LinkIcon size={16} />;
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    twoColumn: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' },
    mainContent: {},
    sidebar: {},
    controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '10px 16px', flex: 1, maxWidth: '300px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6366F1', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    categoryBar: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
    categoryBtn: { padding: '8px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-muted)' },
    categoryBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1', color: 'white' },
    articlesGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
    articleCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.2s' },
    articleType: { fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#818CF8', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' },
    articleTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' },
    articlePreview: { fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 },
    articleMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' },
    sidebarCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', marginBottom: '20px' },
    sidebarTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    popularItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none', resize: 'vertical' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginRight: '12px' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' },
    actionBtns: { display: 'flex', gap: '8px' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Book size={28} color="#818CF8" /> База знаний</h1>
        <p style={styles.subtitle}>Статьи, инструкции и полезные материалы от коллег</p>
      </div>

      <div style={styles.twoColumn}>
        <div style={styles.mainContent}>
          <div style={styles.controls}>
            <div style={styles.searchBox}>
              <Search size={18} color="var(--text-muted)" />
              <input type="text" placeholder="Поиск статей..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
            </div>
            {isModerator && (
              <button onClick={() => setIsAdding(true)} style={styles.addBtn}>
                <Plus size={16} /> Добавить статью
              </button>
            )}
          </div>

          <div style={styles.categoryBar}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ ...styles.categoryBtn, ...(selectedCategory === cat && styles.categoryBtnActive) }}>
                {cat === 'all' ? 'Все' : cat}
              </button>
            ))}
          </div>

          <div style={styles.articlesGrid}>
            {filtered.map(article => (
              <motion.div key={article.id} style={styles.articleCard} whileHover={{ y: -2 }} onClick={() => { setSelectedArticle(article); incrementViews(article.id); }}>
                <div style={styles.articleType}>{getTypeIcon(article.type)} {article.type === 'article' ? 'Статья' : article.type === 'video' ? 'Видео' : 'Ссылка'}</div>
                <div style={styles.articleTitle}>{article.title}</div>
                <div style={styles.articlePreview}>{article.content.substring(0, 120)}...</div>
                <div style={styles.articleMeta}>
                  <span>👁️ {article.views || 0} просмотров</span>
                  <span>👍 {article.likes || 0}</span>
                  <span>📁 {article.category}</span>
                  <span>📅 {article.createdAt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <div style={styles.sidebarTitle}><Star size={16} color="#F59E0B" /> Популярное</div>
            {popularArticles.map(article => (
              <div key={article.id} style={styles.popularItem} onClick={() => { setSelectedArticle(article); incrementViews(article.id); }}>
                <span>{article.title}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{article.views} просмотров</span>
              </div>
            ))}
          </div>

          <div style={styles.sidebarCard}>
            <div style={styles.sidebarTitle}><Clock size={16} color="#818CF8" /> Недавнее</div>
            {recentArticles.map(article => (
              <div key={article.id} style={styles.popularItem} onClick={() => { setSelectedArticle(article); incrementViews(article.id); }}>
                <span>{article.title}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{article.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно просмотра статьи */}
      {selectedArticle && (
        <div style={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>{selectedArticle.title}</h2>
              <button onClick={() => setSelectedArticle(null)} style={styles.actionBtn}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={styles.articleType}>{getTypeIcon(selectedArticle.type)} {selectedArticle.type}</span>
              <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>📁 {selectedArticle.category}</span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{selectedArticle.content}</div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <button onClick={() => addLike(selectedArticle.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ThumbsUp size={16} /> {selectedArticle.likes || 0}</button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>👁️ {selectedArticle.views} просмотров</span>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления */}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Добавить статью</h2>
              <button onClick={() => setIsAdding(false)} style={styles.actionBtn}><X size={20} /></button>
            </div>
            <input type="text" placeholder="Заголовок" value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} style={styles.input} />
            <select value={newArticle.category} onChange={(e) => setNewArticle({...newArticle, category: e.target.value})} style={styles.select}>
              <option value="">Выберите категорию</option>
              {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={newArticle.type} onChange={(e) => setNewArticle({...newArticle, type: e.target.value})} style={styles.select}>
              <option value="article">Статья</option>
              <option value="video">Видео</option>
              <option value="link">Ссылка</option>
            </select>
            <textarea rows={6} placeholder="Содержание" value={newArticle.content} onChange={(e) => setNewArticle({...newArticle, content: e.target.value})} style={styles.textarea} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={addArticle} style={styles.saveBtn}>Сохранить</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;