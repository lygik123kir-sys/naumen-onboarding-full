import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Search, BookOpen, Plus, Edit2, Trash2, Save, X, ChevronRight, Star, Filter } from 'lucide-react';

const Glossary = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [terms, setTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTerm, setNewTerm] = useState({ term: '', definition: '', category: '', example: '' });
  const [editTerm, setEditTerm] = useState(null);
  const [categories, setCategories] = useState([]);

  // Является ли пользователь модератором (HR или Админ)
  const isModerator = user?.role === 'HR_MANAGER' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    // Загружаем глоссарий из localStorage
    const saved = localStorage.getItem('glossaryTerms');
    if (saved) {
      setTerms(JSON.parse(saved));
    } else {
      // Данные по умолчанию
      const defaultTerms = [
        { id: 1, term: 'CI/CD', definition: 'Continuous Integration / Continuous Delivery - практики непрерывной интеграции и доставки', category: 'DevOps', example: 'Мы используем GitLab CI/CD для автоматизации деплоя', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 2, term: 'SLA', definition: 'Service Level Agreement - соглашение об уровне обслуживания', category: 'Общие', example: 'Время ответа на запрос - 15 минут', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 3, term: 'KPI', definition: 'Key Performance Indicators - ключевые показатели эффективности', category: 'Управление', example: 'Еженедельный прогресс по задачам', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 4, term: 'MVP', definition: 'Minimum Viable Product - минимально жизнеспособный продукт', category: 'Разработка', example: 'Запускаем MVP через 2 недели', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 5, term: 'Onboarding', definition: 'Процесс адаптации нового сотрудника', category: 'HR', example: 'План онбординга рассчитан на 3 месяца', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 6, term: 'Sprint', definition: 'Итерация разработки, обычно 1-2 недели', category: 'Agile', example: 'Спринт планирование по понедельникам', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 7, term: 'Code Review', definition: 'Процесс проверки кода другими разработчиками', category: 'Разработка', example: 'Перед слиянием PR обязателен код-ревью', createdBy: 'admin', createdAt: '2026-01-01' },
        { id: 8, term: 'Tech Debt', definition: 'Технический долг - накопленные проблемы в коде', category: 'DevOps', example: 'Нужно рефакторить старые модули', createdBy: 'admin', createdAt: '2026-01-01' }
      ];
      setTerms(defaultTerms);
      localStorage.setItem('glossaryTerms', JSON.stringify(defaultTerms));
    }
  }, []);

  // Сохранение терминов
  useEffect(() => {
    if (terms.length > 0) {
      localStorage.setItem('glossaryTerms', JSON.stringify(terms));
      const uniqueCategories = [...new Set(terms.map(t => t.category))];
      setCategories(uniqueCategories);
    }
  }, [terms]);

  const addTerm = () => {
    if (!newTerm.term || !newTerm.definition) return;
    const termToAdd = {
      id: Date.now(),
      ...newTerm,
      createdBy: user?.email || 'user',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTerms([...terms, termToAdd]);
    setNewTerm({ term: '', definition: '', category: '', example: '' });
    setIsAdding(false);
  };

  const updateTerm = () => {
    if (!editTerm) return;
    setTerms(terms.map(t => t.id === editTerm.id ? editTerm : t));
    setIsEditing(false);
    setEditTerm(null);
  };

  const deleteTerm = (id) => {
    if (window.confirm('Удалить термин?')) {
      setTerms(terms.filter(t => t.id !== id));
    }
  };

  const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я'];

  const getFirstLetter = (term) => {
    const firstChar = term.term.charAt(0).toUpperCase();
    if (/[A-Z]/.test(firstChar)) return 'A-Z';
    return firstChar;
  };

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = selectedLetter === 'all' ||
                         (selectedLetter === 'A-Z' ? /[A-Z]/.test(term.term.charAt(0)) : term.term.charAt(0).toUpperCase() === selectedLetter);
    return matchesSearch && matchesLetter;
  });

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '10px 16px', flex: 1, maxWidth: '300px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6366F1', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    alphabet: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-light)' },
    letterBtn: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', transition: 'all 0.2s' },
    letterBtnActive: { backgroundColor: '#6366F1', color: 'white' },
    termsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' },
    termCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.2s' },
    termHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    termName: { fontSize: '20px', fontWeight: '700', color: '#818CF8' },
    termCategory: { fontSize: '11px', padding: '4px 10px', backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: '20px', color: '#818CF8' },
    termDefinition: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' },
    termExample: { fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px', outline: 'none', resize: 'vertical' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginRight: '12px' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' },
    actionBtns: { display: 'flex', gap: '8px' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><BookOpen size={28} color="#818CF8" /> Глоссарий</h1>
        <p style={styles.subtitle}>Словарь терминов и понятий компании Naumen</p>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Поиск терминов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
        </div>
        {isModerator && (
          <button onClick={() => setIsAdding(true)} style={styles.addBtn}>
            <Plus size={16} /> Добавить термин
          </button>
        )}
      </div>

      <div style={styles.alphabet}>
        <button onClick={() => setSelectedLetter('all')} style={{ ...styles.letterBtn, ...(selectedLetter === 'all' && styles.letterBtnActive) }}>Все</button>
        {letters.map(letter => (
          <button key={letter} onClick={() => setSelectedLetter(letter)} style={{ ...styles.letterBtn, ...(selectedLetter === letter && styles.letterBtnActive) }}>
            {letter}
          </button>
        ))}
        <button onClick={() => setSelectedLetter('A-Z')} style={{ ...styles.letterBtn, ...(selectedLetter === 'A-Z' && styles.letterBtnActive) }}>A-Z</button>
      </div>

      <div style={styles.termsGrid}>
        {filteredTerms.map(term => (
          <motion.div key={term.id} style={styles.termCard} whileHover={{ y: -2 }} onClick={() => setSelectedTerm(term)}>
            <div style={styles.termHeader}>
              <span style={styles.termName}>{term.term}</span>
              <span style={styles.termCategory}>{term.category}</span>
            </div>
            <div style={styles.termDefinition}>{term.definition}</div>
            {term.example && (
              <div style={styles.termExample}>📌 Пример: {term.example}</div>
            )}
            {isModerator && (
              <div style={{ ...styles.actionBtns, marginTop: '12px', justifyContent: 'flex-end' }}>
                <button onClick={(e) => { e.stopPropagation(); setEditTerm(term); setIsEditing(true); }} style={styles.actionBtn}><Edit2 size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteTerm(term.id); }} style={styles.actionBtn}><Trash2 size={14} /></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Модальное окно просмотра термина */}
      {selectedTerm && (
        <div style={styles.modalOverlay} onClick={() => setSelectedTerm(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>{selectedTerm.term}</h2>
              <button onClick={() => setSelectedTerm(null)} style={styles.actionBtn}><X size={20} /></button>
            </div>
            <div><strong>Категория:</strong> {selectedTerm.category}</div>
            <div style={{ marginTop: '16px' }}><strong>Определение:</strong></div>
            <p style={{ color: 'var(--text-secondary)' }}>{selectedTerm.definition}</p>
            {selectedTerm.example && (
              <>
                <div style={{ marginTop: '16px' }}><strong>Пример использования:</strong></div>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{selectedTerm.example}</p>
              </>
            )}
            <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>Добавлено: {selectedTerm.createdAt}</div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления термина */}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Добавить термин</h2>
              <button onClick={() => setIsAdding(false)} style={styles.actionBtn}><X size={20} /></button>
            </div>
            <input type="text" placeholder="Термин" value={newTerm.term} onChange={(e) => setNewTerm({...newTerm, term: e.target.value})} style={styles.input} />
            <input type="text" placeholder="Категория" value={newTerm.category} onChange={(e) => setNewTerm({...newTerm, category: e.target.value})} style={styles.input} />
            <textarea rows={3} placeholder="Определение" value={newTerm.definition} onChange={(e) => setNewTerm({...newTerm, definition: e.target.value})} style={styles.textarea} />
            <textarea rows={2} placeholder="Пример использования (опционально)" value={newTerm.example} onChange={(e) => setNewTerm({...newTerm, example: e.target.value})} style={styles.textarea} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={addTerm} style={styles.saveBtn}>Сохранить</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {isEditing && editTerm && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Редактировать термин</h2>
              <button onClick={() => setIsEditing(false)} style={styles.actionBtn}><X size={20} /></button>
            </div>
            <input type="text" placeholder="Термин" value={editTerm.term} onChange={(e) => setEditTerm({...editTerm, term: e.target.value})} style={styles.input} />
            <input type="text" placeholder="Категория" value={editTerm.category} onChange={(e) => setEditTerm({...editTerm, category: e.target.value})} style={styles.input} />
            <textarea rows={3} placeholder="Определение" value={editTerm.definition} onChange={(e) => setEditTerm({...editTerm, definition: e.target.value})} style={styles.textarea} />
            <textarea rows={2} placeholder="Пример использования" value={editTerm.example} onChange={(e) => setEditTerm({...editTerm, example: e.target.value})} style={styles.textarea} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={updateTerm} style={styles.saveBtn}>Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Glossary;