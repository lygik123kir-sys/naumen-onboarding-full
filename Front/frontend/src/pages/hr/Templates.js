import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Edit2, Trash2, Copy, Save, X, ChevronRight } from 'lucide-react';

const Templates = () => {
  const { isDark } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hrTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 1, name: 'DevOps Engineer', role: 'devops', stages: [{ name: 'Погружение', duration: 7, tasks: ['Оформить документы', 'Получить доступы'] }], isActive: true, createdAt: '2026-01-01' },
        { id: 2, name: 'Backend Developer', role: 'backend', stages: [{ name: 'Погружение', duration: 7, tasks: ['Настройка IDE', 'Обзор кода'] }], isActive: true, createdAt: '2026-01-01' }
      ];
      setTemplates(defaults);
      localStorage.setItem('hrTemplates', JSON.stringify(defaults));
    }
  }, []);

  const addTemplate = () => {
    const newTemplate = { id: Date.now(), name: 'Новый шаблон', role: 'new', stages: [{ name: 'Этап 1', duration: 7, tasks: ['Задача 1'] }], isActive: true, createdAt: new Date().toISOString().split('T')[0] };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('hrTemplates', JSON.stringify(updated));
  };

  const deleteTemplate = (id) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('hrTemplates', JSON.stringify(updated));
  };

  const saveTemplate = () => {
    const updated = templates.map(t => t.id === editingTemplate.id ? editingTemplate : t);
    setTemplates(updated);
    localStorage.setItem('hrTemplates', JSON.stringify(updated));
    setIsEditing(false);
    setEditingTemplate(null);
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6366F1', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    templateCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)`, marginBottom: '16px' },
    templateHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    templateName: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px' },
    stageItem: { padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', marginBottom: '8px' },
    taskTag: { padding: '4px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', fontSize: '12px', color: 'var(--text-muted)', marginRight: '8px', marginBottom: '8px', display: 'inline-block' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Шаблоны адаптации</h1>
        <button onClick={addTemplate} style={styles.addBtn}><Plus size={16} /> Создать шаблон</button>
      </div>

      {templates.map(template => (
        <div key={template.id} style={styles.templateCard}>
          <div style={styles.templateHeader}>
            <div><div style={styles.templateName}>{template.name}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Создан: {template.createdAt}</div></div>
            <div><button onClick={() => { setEditingTemplate(template); setIsEditing(true); }} style={styles.actionBtn}><Edit2 size={16} /></button><button onClick={() => deleteTemplate(template.id)} style={styles.actionBtn}><Trash2 size={16} /></button></div>
          </div>
          {template.stages.map((stage, idx) => (
            <div key={idx} style={styles.stageItem}>
              <div style={{ fontWeight: '500', marginBottom: '8px' }}>{stage.name} • {stage.duration} дней</div>
              <div>{stage.tasks.map((task, tIdx) => <span key={tIdx} style={styles.taskTag}>{task}</span>)}</div>
            </div>
          ))}
        </div>
      ))}

      {isEditing && editingTemplate && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Редактирование шаблона</h3>
            <input type="text" value={editingTemplate.name} onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} style={styles.input} placeholder="Название" />
            {editingTemplate.stages.map((stage, idx) => (
              <div key={idx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
                <input type="text" value={stage.name} onChange={e => { const newStages = [...editingTemplate.stages]; newStages[idx].name = e.target.value; setEditingTemplate({...editingTemplate, stages: newStages}); }} style={styles.input} placeholder="Название этапа" />
                <input type="number" value={stage.duration} onChange={e => { const newStages = [...editingTemplate.stages]; newStages[idx].duration = parseInt(e.target.value); setEditingTemplate({...editingTemplate, stages: newStages}); }} style={styles.input} placeholder="Длительность (дней)" />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={saveTemplate} style={{ padding: '10px 20px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;