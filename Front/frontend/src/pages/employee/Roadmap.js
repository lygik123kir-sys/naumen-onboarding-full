import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, Circle, Clock, Award, ChevronRight, Calendar, Flag } from 'lucide-react';

const Roadmap = () => {
  const { isDark } = useTheme();
  const [stages, setStages] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // Загружаем этапы
    const savedStages = localStorage.getItem('onboardingStages');
    if (savedStages) {
      const parsed = JSON.parse(savedStages);
      setStages(parsed);
      const completed = parsed.filter(s => s.completed).length;
      setOverallProgress((completed / parsed.length) * 100);
    } else {
      // Данные по умолчанию
      const defaultStages = [
        { id: 1, name: 'Погружение', description: 'Знакомство с компанией и командой', tasks: [
          { id: 1, title: 'Оформить документы', completed: true, xp: 50, dueDate: '2026-04-07' },
          { id: 2, title: 'Получить оборудование', completed: true, xp: 50, dueDate: '2026-04-07' },
          { id: 3, title: 'Познакомиться с командой', completed: true, xp: 100, dueDate: '2026-04-07' }
        ], completed: true, icon: '👋', dueDate: '2026-04-07' },
        { id: 2, name: 'Основы', description: 'Базовые процессы и инструменты', tasks: [
          { id: 4, title: 'Изучить документацию', completed: true, xp: 75, dueDate: '2026-04-14' },
          { id: 5, title: 'Настроить окружение', completed: true, xp: 100, dueDate: '2026-04-14' },
          { id: 6, title: 'Познакомиться с кодом', completed: false, xp: 100, dueDate: '2026-04-14' }
        ], completed: false, icon: '📚', dueDate: '2026-04-14' },
        { id: 3, name: 'Первые задачи', description: 'Работа с реальными проектами', tasks: [
          { id: 7, title: 'Выполнить код-ревью', completed: true, xp: 100, dueDate: '2026-04-21' },
          { id: 8, title: 'Создать первый PR', completed: false, xp: 150, dueDate: '2026-04-25' },
          { id: 9, title: 'Написать тесты', completed: false, xp: 125, dueDate: '2026-04-28' }
        ], completed: false, icon: '⚙️', dueDate: '2026-04-28' },
        { id: 4, name: 'Самостоятельность', description: 'Полная автономность в задачах', tasks: [
          { id: 10, title: 'Взять задачу из бэклога', completed: false, xp: 150, dueDate: '2026-05-05' },
          { id: 11, title: 'Провести демо', completed: false, xp: 200, dueDate: '2026-05-12' }
        ], completed: false, icon: '🚀', dueDate: '2026-05-12' }
      ];
      setStages(defaultStages);
      setOverallProgress(44);
      localStorage.setItem('onboardingStages', JSON.stringify(defaultStages));
    }
  }, []);

  const getStageProgress = (stage) => {
    const completed = stage.tasks.filter(t => t.completed).length;
    return (completed / stage.tasks.length) * 100;
  };

  const getTotalCompletedTasks = () => {
    return stages.reduce((acc, stage) => acc + stage.tasks.filter(t => t.completed).length, 0);
  };

  const getTotalTasks = () => {
    return stages.reduce((acc, stage) => acc + stage.tasks.length, 0);
  };

  const styles = {
    container: { maxWidth: '900px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    progressCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '24px', border: `1px solid var(--border-light)` },
    progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' },
    progressBar: { height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' },
    progressFill: { height: '100%', width: `${overallProgress}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', borderRadius: '4px', transition: 'width 0.5s' },
    stageCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: `1px solid var(--border-light)` },
    stageHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
    stageIcon: { fontSize: '32px' },
    stageInfo: { flex: 1 },
    stageName: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    stageDesc: { fontSize: '13px', color: 'var(--text-muted)' },
    stageBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
    stageBadgeCompleted: { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E' },
    stageBadgeCurrent: { backgroundColor: 'rgba(99,102,241,0.1)', color: '#818CF8' },
    stageBadgePending: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' },
    tasksList: { marginTop: '16px' },
    taskItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid var(--border-light)` },
    taskCheck: { cursor: 'pointer', color: 'var(--text-muted)' },
    taskCheckCompleted: { color: '#22C55E' },
    taskTitle: { flex: 1, fontSize: '14px', color: 'var(--text-primary)' },
    taskTitleCompleted: { textDecoration: 'line-through', color: 'var(--text-muted)' },
    taskXp: { fontSize: '12px', color: '#F59E0B' },
    taskDate: { fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }
  };

  const handleToggleTask = (stageId, taskId) => {
    const updatedStages = stages.map(stage => {
      if (stage.id === stageId) {
        const updatedTasks = stage.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        const completed = updatedTasks.filter(t => t.completed).length;
        const stageCompleted = completed === updatedTasks.length;
        return { ...stage, tasks: updatedTasks, completed: stageCompleted };
      }
      return stage;
    });
    setStages(updatedStages);
    localStorage.setItem('onboardingStages', JSON.stringify(updatedStages));

    const completedStages = updatedStages.filter(s => s.completed).length;
    setOverallProgress((completedStages / updatedStages.length) * 100);

    // Обновляем XP
    const totalXp = updatedStages.reduce((acc, stage) =>
      acc + stage.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0), 0);
    localStorage.setItem('onboardingProgress', JSON.stringify({
      xpEarned: totalXp,
      tasksCompleted: updatedStages.reduce((acc, s) => acc + s.tasks.filter(t => t.completed).length, 0),
      tasksTotal: updatedStages.reduce((acc, s) => acc + s.tasks.length, 0)
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🗺️ Ваш путь адаптации</h1>
        <p style={styles.subtitle}>План на первые 90 дней в компании</p>
      </div>

      <div style={styles.progressCard}>
        <div style={styles.progressLabel}>
          <span>Общий прогресс</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
        <div style={{ ...styles.progressLabel, marginTop: '12px', fontSize: '12px' }}>
          <span>✅ Выполнено задач: {getTotalCompletedTasks()}/{getTotalTasks()}</span>
          <span>🏆 Получено XP: {getTotalCompletedTasks() * 50}</span>
        </div>
      </div>

      {stages.map((stage, index) => {
        const isCurrent = !stage.completed && (index === 0 || stages[index - 1]?.completed);
        const progress = getStageProgress(stage);

        return (
          <div key={stage.id} style={styles.stageCard}>
            <div style={styles.stageHeader}>
              <span style={styles.stageIcon}>{stage.icon}</span>
              <div style={styles.stageInfo}>
                <div style={styles.stageName}>{stage.name}</div>
                <div style={styles.stageDesc}>{stage.description}</div>
              </div>
              <div style={{
                ...styles.stageBadge,
                ...(stage.completed ? styles.stageBadgeCompleted : (isCurrent ? styles.stageBadgeCurrent : styles.stageBadgePending))
              }}>
                {stage.completed ? '✓ Завершён' : (isCurrent ? '● В процессе' : '○ Заблокирован')}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Прогресс этапа</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', borderRadius: '2px' }} />
              </div>
            </div>

            <div style={styles.tasksList}>
              {stage.tasks.map(task => (
                <div key={task.id} style={styles.taskItem}>
                  <div onClick={() => handleToggleTask(stage.id, task.id)} style={{ ...styles.taskCheck, ...(task.completed && styles.taskCheckCompleted), cursor: 'pointer' }}>
                    {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </div>
                  <div style={{ ...styles.taskTitle, ...(task.completed && styles.taskTitleCompleted) }}>{task.title}</div>
                  <div style={styles.taskXp}>+{task.xp} XP</div>
                  <div style={styles.taskDate}>
                    <Calendar size={12} />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Roadmap;