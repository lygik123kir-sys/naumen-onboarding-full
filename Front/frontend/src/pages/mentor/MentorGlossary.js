import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { Plus, Edit2, Trash2, X, Save, BookOpen, Search } from 'lucide-react';

const MentorGlossary = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [terms, setTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTerm, setNewTerm] = useState({ term: '', definition: '', category: '', example: '' });
  const [editTerm, setEditTerm] = useState(null);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = () => {
    const saved = localStorage.getItem('glossaryTerms');
    if (saved) {
      setTerms(JSON.parse(saved));
    } else {
      const defaultTerms = [
        { id: 1, term: 'CI/CD', definition: 'Continuous Integration / Continuous Delivery', category: 'DevOps', example: 'GitLab CI/CD', createdAt: '2026-01-01' },
        { id: 2, term: 'SLA', definition: 'Service Level Agreement', category: 'Общие', example: 'Время ответа 15 минут', createdAt: '2026-01-01' },
        { id: 3, term: 'Onboarding', definition: 'Адаптация нового сотрудника', category: 'HR', example: 'План на 3 месяца', createdAt: '2026-01-01' }
      ];
      setTerms(defaultTerms);
      localStorage.setItem('glossaryTerms', JSON.stringify(defaultTerms));
    }
  };

  const addTerm = () => {
    if (!newTerm.term || !newTerm.definition) {
      addNotification('error', 'Заполните термин и определение');
      return;
    }
    const term = { id: Date.now(), ...newTerm, createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...terms, term];
    setTerms(updated);
    localStorage.setItem('glossaryTerms', JSON.stringify(updated));
    setIsAdding(false);
    setNewTerm({ term: '', definition: '', category: '', example: '' });
    addNotification('success', 'Термин добавлен в глоссарий!');
  };

  const updateTerm = () => {
    if (!editTerm) return;
    const updated = terms.map(t => t.id === editTerm.id ? editTerm : t);
    setTerms(updated);
    localStorage.setItem('glossaryTerms', JSON.stringify(updated));
    setIsEditing(false);
    setEditTerm(null);
    addNotification('success', 'Термин обновлён');
  };

  const deleteTerm = (id) => {
    if (window.confirm('Удалить термин?')) {
      const updated = terms.filter(t => t.id !== id);
      setTerms(updated);
      localStorage.setItem('glossaryTerms', JSON.stringify(updated));
      addNotification('success', 'Термин удалён');
    }
  };

  const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(searchQuery.toLowerCase()) || t.definition.toLowerCase().includes(searchQuery.toLowerCase()));

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '12px 16px', marginBottom: '20px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', marginBottom: '20px' },
    card: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    termName: { fontSize: '18px', fontWeight: '600', color: '#FF6611' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '500px', width: '90%' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><BookOpen size={28} color="#FF6611" /> Управление глоссарием</h1>
        <p style={styles.subtitle}>Добавляйте и редактируйте термины для сотрудников</p>
      </div>
      <div style={styles.searchBox}>
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Поиск терминов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
      </div>
      <button onClick={() => setIsAdding(true)} style={styles.addBtn}><Plus size={16} /> Добавить термин</button>
      {filteredTerms.map(term => (
        <div key={term.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.termName}>{term.term}</span>
            <div>
              <button onClick={() => { setEditTerm(term); setIsEditing(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6611', marginRight: '8px' }}><Edit2 size={16} /></button>
              <button onClick={() => deleteTerm(term.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{term.definition}</div>
          {term.example && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📌 Пример: {term.example}</div>}
          <div style={{ fontSize: '11px', marginTop: '8px', color: '#FF6611' }}>📁 {term.category || 'Без категории'}</div>
        </div>
      ))}
      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Добавить термин</h2>
            <input placeholder="Термин" value={newTerm.term} onChange={e => setNewTerm({...newTerm, term: e.target.value})} style={styles.input} />
            <textarea placeholder="Определение" rows={3} value={newTerm.definition} onChange={e => setNewTerm({...newTerm, definition: e.target.value})} style={styles.textarea} />
            <input placeholder="Категория" value={newTerm.category} onChange={e => setNewTerm({...newTerm, category: e.target.value})} style={styles.input} />
            <textarea placeholder="Пример" rows={2} value={newTerm.example} onChange={e => setNewTerm({...newTerm, example: e.target.value})} style={styles.textarea} />
            <div style={styles.modalButtons}>
              <button onClick={addTerm} style={styles.saveBtn}>Добавить</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorGlossary;