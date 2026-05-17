import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import {
  Plus, Trash2, Calendar, Target, CheckCircle
} from 'lucide-react';
// Импортируем наш сетевой сервис
import apiService from '../../services/apiService';

const TasksForMentees = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'learning',
    assignedToId: '',
    assignedTo: '',
    dueDate: '',
    points: 50
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // 1. Тянем реальные задачи с бэка
      const tasksData = await apiService.getTasks();
      const backendTasks = Array.isArray(tasksData) ? tasksData : [];

      // Подгружаем локальные задачи (если они были созданы во время ошибки 500)
      const localTasks = JSON.parse(localStorage.getItem('mentorTasks')) || [];

      // Объединяем, чтобы ничего не потерять
      setTasks([...backendTasks, ...localTasks]);

      // 2. Тянем реальных юзеров для выпадающего списка "Кому назначить"
      const usersData = await apiService.getEmployees();
      setMentees(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Ошибка загрузки данных наставника:', err);
      addNotification('error', 'Не удалось загрузить данные с сервера');

      // На крайний случай берем из локала
      const localTasks = JSON.parse(localStorage.getItem('mentorTasks')) || [];
      setTasks(localTasks);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Метод создания задачи с умной подушкой безопасности
  const addTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignedToId) {
      addNotification('error', 'Заполните обязательные поля');
      return;
    }

    // Заготовка локальной задачи на случай ошибки сервера
    const localFallbackTask = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      userId: parseInt(newTask.assignedToId),
      assignedToId: parseInt(newTask.assignedToId),
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      points: parseInt(newTask.points) || 50,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      // Пытаемся отправить POST-запрос на бэкенд NestJS
      await apiService.request('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          type: newTask.type,
          userId: parseInt(newTask.assignedToId), // Связь с ID пользователя в базе Neon
          dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
          points: parseInt(newTask.points) || 50,
          status: 'pending'
        })
      });

      addNotification('success', 'Задание успешно сохранено в БД Neon!');
      setIsAdding(false);
      setNewTask({ title: '', description: '', type: 'learning', assignedToId: '', assignedTo: '', dueDate: '', points: 50 });
      loadData(); // Перезагружаем список с сервера
    } catch (err) {
      console.error('Бэкенд вернул 500 или недоступен. Включаем демо-сохранение:', err);

      // Сохраняем локально, чтобы демонстрация не прерывалась
      const savedLocalTasks = JSON.parse(localStorage.getItem('mentorTasks')) || [];
      const updatedLocalTasks = [...savedLocalTasks, localFallbackTask];
      localStorage.setItem('mentorTasks', JSON.stringify(updatedLocalTasks));

      // Сразу обновляем интерфейс текущей задачей
      setTasks([...tasks, localFallbackTask]);

      addNotification('warning', 'Сохранено локально (Бэкенд вернул ошибку 500)');
      setIsAdding(false);
      setNewTask({ title: '', description: '', type: 'learning', assignedToId: '', assignedTo: '', dueDate: '', points: 50 });
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Удалить задание?')) {
      try {
        // Пробуем удалить на бэке
        await apiService.request(`/tasks/${id}`, { method: 'DELETE' });
        addNotification('success', 'Задание удалено с сервера');
      } catch (err) {
        console.warn('Удаляем задачу локально:', err);
        // Если это локальная задача, чистим из localStorage
        const savedLocalTasks = JSON.parse(localStorage.getItem('mentorTasks')) || [];
        const updatedLocalTasks = savedLocalTasks.filter(t => t.id !== id);
        localStorage.setItem('mentorTasks', JSON.stringify(updatedLocalTasks));
      }
      // В любом случае обновляем экран
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const markAsCompleted = async (id) => {
    try {
      // Пробуем обновить статус на бэке через PATCH
      await apiService.completeTask(id);
      addNotification('success', '✅ Статус задачи обновлен в БД Neon!');
    } catch (err) {
      console.warn('Ошибка PATCH на бэке, обновляем локальный стейт:', err);

      // Если задача была локальной, меняем статус в localStorage
      const savedLocalTasks = JSON.parse(localStorage.getItem('mentorTasks')) || [];
      const updatedLocalTasks = savedLocalTasks.map(t =>
        t.id === id ? { ...t, status: 'completed' } : t
      );
      localStorage.setItem('mentorTasks', JSON.stringify(updatedLocalTasks));
      addNotification('success', '✅ Задание отмечено как выполненное локально');
    }

    // Обновляем визуальное отображение на экране
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const filteredTasks = selectedMentee === 'all'
    ? tasks
    : tasks.filter(t => t.userId === parseInt(selectedMentee) || t.assignedToId === parseInt(selectedMentee));

  const taskTypes = {
    learning: { label: '📚 Обучающее', color: '#818CF8' },
    work: { label: '💼 Рабочее', color: '#22C55E' },
    free: { label: '🎯 Свободное', color: '#F59E0B' }
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    filterSelect: { padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    taskCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid var(--border-light)', transition: 'all 0.2s' },
    taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' },
    taskTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    taskType: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
    taskDescription: { fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' },
    taskMeta: { display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', marginBottom: '16px' },
    taskActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '8px' },
    completeBtn: { padding: '8px 16px', backgroundColor: '#22C55E', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '8px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '550px', width: '90%', maxHeight: '85vh', overflow: 'auto' },
    modalTitle: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' },
    textarea: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical', outline: 'none' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' },
    modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-primary)', padding: '40px', textAlign: 'center' }}>Загрузка списка задач...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Target size={28} color="#FF6611" /> Задания для новичков</h1>
        <p style={styles.subtitle}>Создавайте обучающие и рабочие задания для своих подопечных</p>
      </div>

      <div style={styles.controls}>
        <select
          value={selectedMentee}
          onChange={(e) => setSelectedMentee(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">Все подопечные</option>
          {mentees.map(m => {
            const mName = m.name || `${m.firstName || ''} ${m.lastName || ''}`;
            return <option key={m.id} value={m.id}>{mName}</option>;
          })}
        </select>
        <button onClick={() => setIsAdding(true)} style={styles.addBtn}>
          <Plus size={16} /> Создать задание
        </button>
      </div>

      {filteredTasks.map(task => {
        const currentType = taskTypes[task.type] || taskTypes.learning;
        const assignedName = task.user ? (task.user.name || `${task.user.firstName || ''} ${task.user.lastName || ''}`) : (task.assignedTo || 'Иван');

        return (
          <motion.div key={task.id} style={styles.taskCard} whileHover={{ y: -2 }}>
            <div style={styles.taskHeader}>
              <span style={styles.taskTitle}>{task.title}</span>
              <span style={{ ...styles.taskType, backgroundColor: `${currentType.color}20`, color: currentType.color }}>
                {currentType.label}
              </span>
            </div>
            <div style={styles.taskDescription}>{task.description}</div>
            <div style={styles.taskMeta}>
              <span>👤 {assignedName}</span>
              <span>📅 Срок: {task.dueDate?.split('T')[0]}</span>
              <span>⭐ {task.points} баллов</span>
              <span>{task.status === 'completed' ? '✅ Выполнено' : '⏳ Ожидает'}</span>
            </div>
            <div style={styles.taskActions}>
              {task.status !== 'completed' && (
                <button onClick={() => markAsCompleted(task.id)} style={styles.completeBtn}>
                  <CheckCircle size={14} /> Отметить выполненным
                </button>
              )}
              <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        );
      })}

      {filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Нет заданий в базе данных. Создайте первое задание для подопечных!
        </div>
      )}

      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Создать задание</h2>
            <input
              placeholder="Название задания"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              style={styles.input}
            />
            <textarea
              rows={3}
              placeholder="Описание задания"
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              style={styles.textarea}
            />
            <select
              value={newTask.type}
              onChange={e => setNewTask({...newTask, type: e.target.value})}
              style={styles.select}
            >
              <option value="learning">📚 Обучающее</option>
              <option value="work">💼 Рабочее</option>
              <option value="free">🎯 Свободное</option>
            </select>
            <select
              value={newTask.assignedToId || ''}
              onChange={e => {
                const mentee = mentees.find(m => m.id === parseInt(e.target.value));
                const menteeName = mentee ? (mentee.name || `${mentee.firstName || ''} ${mentee.lastName || ''}`) : '';
                setNewTask({...newTask, assignedToId: e.target.value, assignedTo: menteeName});
              }}
              style={styles.select}
            >
              <option value="">Кому назначить</option>
              {mentees.map(m => {
                const mName = m.name || `${m.firstName || ''} ${m.lastName || ''}`;
                return <option key={m.id} value={m.id}>{mName}</option>;
              })}
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Количество баллов"
              value={newTask.points}
              onChange={e => setNewTask({...newTask, points: e.target.value})}
              style={styles.input}
            />
            <div style={styles.modalButtons}>
              <button onClick={addTask} style={styles.saveBtn}>Создать</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksForMentees;