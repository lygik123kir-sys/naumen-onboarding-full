import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Flame, Target } from 'lucide-react';
// Импортируем наш сетевой сервис для связи с NestJS
import apiService from '../../services/apiService';

const DailyTasks = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDailyData();
    loadStreak();
    loadPoints();
  }, []);

  // Загрузка задач с поддержкой бэкенда и подушки безопасности
  const loadDailyData = async () => {
    try {
      setIsLoading(true);
      // Пробуем забрать задачи с бэка NestJS Mapped {/tasks, GET}
      const data = await apiService.getTasks();
      const backendTasks = Array.isArray(data) ? data : [];

      if (backendTasks.length > 0) {
        // Мапим поля бэка под структуру нашего UI
        const mappedTasks = backendTasks.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || 'Выполнить план адаптации',
          points: t.points || 40,
          completed: t.status === 'completed',
          type: t.type || 'task'
        }));
        setTasks(mappedTasks);
      } else {
        // Если на бэке пусто, берём дефолтные моки
        loadMockTasks();
      }
    } catch (err) {
      console.warn('Бэк недоступен, загружаем ежедневные задачи из localStorage:', err);
      loadMockTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockTasks = () => {
    const saved = localStorage.getItem('dailyTasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const defaultTasks = [
        { id: 1, title: 'Познакомиться с новым коллегой', description: 'Напишите приветствие в чате', points: 20, completed: false, type: 'social' },
        { id: 2, title: 'Изучить один термин из глоссария', description: 'Прочитайте и запомните', points: 10, completed: false, type: 'learning' },
        { id: 3, title: 'Заполнить Pulse Check', description: 'Поделитесь настроением', points: 30, completed: false, type: 'feedback' },
        { id: 4, title: 'Помочь коллеге', description: 'Ответьте на вопрос в чате', points: 50, completed: false, type: 'social' },
        { id: 5, title: 'Выполнить задачу из Roadmap', description: 'Продвиньтесь по плану', points: 40, completed: false, type: 'task' }
      ];
      setTasks(defaultTasks);
      localStorage.setItem('dailyTasks', JSON.stringify(defaultTasks));
    }
  };

  const loadStreak = () => {
    const savedStreak = localStorage.getItem('dailyStreak');
    const lastDate = localStorage.getItem('lastTaskDate');
    setStreak(savedStreak ? parseInt(savedStreak) : 0);
    setLastCompletedDate(lastDate);
  };

  const loadPoints = () => {
    const savedPoints = localStorage.getItem('activityPoints');
    setTotalPoints(savedPoints ? parseInt(savedPoints) : 0);
  };

  // Выполнение задачи с отправкой статуса на NestJS и начислением XP панде
  const completeTask = async (taskId) => {
    // Находим задачу локально для начисления баллов
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    // Сразу запускаем анимацию и начисление очков в UI (Оптимистичный UI)
    addNotification('success', `+${task.points} баллов! Настроение питомца улучшено!`);
    const newPoints = totalPoints + task.points;
    setTotalPoints(newPoints);
    localStorage.setItem('activityPoints', newPoints.toString());

    // Расчет стриков активности (дней подряд)
    const today = new Date().toDateString();
    if (lastCompletedDate !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('dailyStreak', newStreak.toString());
      localStorage.setItem('lastTaskDate', today);
      if (newStreak === 7) {
        addNotification('success', '🔥 7 дней подряд! +100 бонусных баллов!');
        setTotalPoints(newPoints + 100);
        localStorage.setItem('activityPoints', (newPoints + 100).toString());
      }
    }

    // Обновляем локальный стейт
    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
    setTasks(updated);
    localStorage.setItem('dailyTasks', JSON.stringify(updated));

    try {
      // Отправляем реальный PATCH-запрос на бэк NestJS Mapped {/tasks/:id, PATCH}
      await apiService.completeTask(taskId);
    } catch (err) {
      console.warn('Сервер вернул ошибку при сохранении статуса задачи, задействован локальный режим:', err);
    }
  };

  const resetDailyTasks = () => {
    const reset = tasks.map(task => ({ ...task, completed: false }));
    setTasks(reset);
    localStorage.setItem('dailyTasks', JSON.stringify(reset));
  };

  useEffect(() => {
    const now = new Date();
    const night = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const msToMidnight = night.getTime() - now.getTime();
    const timer = setTimeout(() => resetDailyTasks(), msToMidnight);
    return () => clearTimeout(timer);
  }, [tasks]);

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    statsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
    statCard: { flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '16px', textAlign: 'center', border: '1px solid var(--border-light)' },
    statValue: { fontSize: '28px', fontWeight: '700', color: '#F59E0B' },
    tasksList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    taskCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.2s' },
    taskCompleted: { opacity: 0.6 },
    taskPoints: { fontSize: '12px', fontWeight: '600', color: '#F59E0B' }
  };

  const totalPossible = tasks.reduce((acc, t) => acc + t.points, 0);
  const earnedToday = tasks.filter(t => t.completed).reduce((acc, t) => acc + t.points, 0);

  if (isLoading) {
    return <div style={{ color: 'var(--text-primary)', padding: '40px', textAlign: 'center' }}>Синхронизация игрового прогресса...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Target size={28} color="#F59E0B" /> Ежедневные задания</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Выполняйте задания, прокачивайте уровень и кормите питомца</p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}><div style={styles.statValue}>{earnedToday}/{totalPossible}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Баллов сегодня</div></div>
        <div style={styles.statCard}><div style={styles.statValue}><Flame size={20} style={{ display: 'inline' }} /> {streak}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Дней подряд</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{totalPoints}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Всего баллов</div></div>
      </div>

      <div style={styles.tasksList}>
        {tasks.map(task => (
          <motion.div key={task.id} style={{ ...styles.taskCard, ...(task.completed && styles.taskCompleted) }} whileHover={{ scale: 1.01 }} onClick={() => !task.completed && completeTask(task.id)}>
            <div>{task.completed ? <CheckCircle size={24} color="#22C55E" /> : <Circle size={24} color="var(--text-muted)" />}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{task.title}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{task.description}</div></div>
            <div style={styles.taskPoints}>+{task.points} баллов</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DailyTasks;