import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Award, Zap, Sparkles, CheckCircle, Circle, Calendar } from 'lucide-react';
import { SkeletonStats, SkeletonCard, SkeletonText } from '../../components/UI/Skeleton';
import PandaWidget from '../../components/Pet/PandaWidget';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalTasks: 35,
    xpEarned: 0,
    streak: 0,
    achievements: 0,
    level: 1,
    xpNextLevel: 1500
  });
  const [todayTasks, setTodayTasks] = useState([
    { id: 1, title: 'Создать первый PR', description: 'Создайте pull request с вашими изменениями', completed: false, xp: 150, dueTime: '14:00', priority: 'high' },
    { id: 2, title: 'Встреча с наставником', description: 'Провести 1:1 встречу', completed: false, xp: 50, dueTime: '15:00', priority: 'high' },
    { id: 3, title: 'Изучить документацию', description: 'Просмотреть регламенты команды', completed: false, xp: 75, dueTime: 'сегодня', priority: 'medium' }
  ]);

  // Загрузка достижений из localStorage
  const loadAchievementsCount = () => {
    const saved = localStorage.getItem('customAchievements');
    if (saved) {
      const achievements = JSON.parse(saved);
      const earnedCount = achievements.filter(a => a.earned === true).length;
      return earnedCount;
    }
    // Демо-достижения
    const defaultAchievements = [
      { id: 1, earned: true },
      { id: 2, earned: true },
      { id: 3, earned: true },
      { id: 4, earned: false },
      { id: 5, earned: false },
      { id: 6, earned: false },
      { id: 7, earned: false },
      { id: 8, earned: false }
    ];
    return defaultAchievements.filter(a => a.earned === true).length;
  };

  useEffect(() => {
    setTimeout(() => {
      let saved = localStorage.getItem('onboardingProgress');
      if (!saved) {
        const demoSaved = {
          overall: 34,
          weekly: 65,
          tasksCompleted: 12,
          tasksTotal: 35,
          xpEarned: 1240,
          xpNextLevel: 1500,
          level: 4,
          streak: 7,
          achievements: loadAchievementsCount()
        };
        localStorage.setItem('onboardingProgress', JSON.stringify(demoSaved));
        setStats({
          completedTasks: demoSaved.tasksCompleted,
          totalTasks: demoSaved.tasksTotal,
          xpEarned: demoSaved.xpEarned,
          streak: demoSaved.streak,
          achievements: demoSaved.achievements,
          level: demoSaved.level,
          xpNextLevel: demoSaved.xpNextLevel
        });
      } else {
        const parsed = JSON.parse(saved);
        // Синхронизируем достижения
        const achievementsCount = loadAchievementsCount();
        setStats({
          completedTasks: parsed.tasksCompleted || 0,
          totalTasks: parsed.tasksTotal || 35,
          xpEarned: parsed.xpEarned || 0,
          streak: parsed.streak || 0,
          achievements: achievementsCount,
          level: parsed.level || 1,
          xpNextLevel: parsed.xpNextLevel || 1500
        });
        // Обновляем в localStorage
        const updated = { ...parsed, achievements: achievementsCount };
        localStorage.setItem('onboardingProgress', JSON.stringify(updated));
      }
      setIsLoading(false);
    }, 800);
  }, []);

  const handleToggleTask = (taskId) => {
    setTodayTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        addNotification('success', `Задача выполнена! +${task.xp} XP`);
        const newXp = stats.xpEarned + task.xp;
        const newCompleted = stats.completedTasks + 1;
        let newLevel = stats.level;
        let newXpNextLevel = stats.xpNextLevel;

        if (newXp >= stats.xpNextLevel) {
          newLevel = stats.level + 1;
          newXpNextLevel = Math.floor(stats.xpNextLevel * 1.2);
          addNotification('success', `🎉 Поздравляем! Вы достигли ${newLevel} уровня!`);
        }

        setStats(prevStats => ({
          ...prevStats,
          xpEarned: newXp,
          completedTasks: newCompleted,
          level: newLevel,
          xpNextLevel: newXpNextLevel
        }));

        const currentProgress = JSON.parse(localStorage.getItem('onboardingProgress')) || {};
        const updatedProgress = {
          ...currentProgress,
          tasksCompleted: newCompleted,
          xpEarned: newXp,
          level: newLevel,
          xpNextLevel: newXpNextLevel,
          achievements: stats.achievements
        };
        localStorage.setItem('onboardingProgress', JSON.stringify(updatedProgress));
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#22C55E';
    }
  };

  const percentToNext = ((stats.xpEarned || 0) / (stats.xpNextLevel || 1500)) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } }
  };

  if (isLoading) {
    return (
      <div>
        <SkeletonStats />
        <SkeletonCard />
        <div style={{ marginTop: '16px' }}>
          <SkeletonText width="60%" />
          <SkeletonText />
          <SkeletonText width="80%" />
        </div>
      </div>
    );
  }

  const styles = {
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '20px',
      border: `1px solid var(--border-light)`,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--text-primary)'
    },
    statLabel: {
      fontSize: '12px',
      color: 'var(--text-muted)'
    },
    levelProgress: {
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: '1px solid var(--border-light)'
    },
    levelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '13px'
    },
    levelBar: {
      height: '8px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    levelFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #FF6611, #E55A0E)',
      borderRadius: '4px',
      transition: 'width 0.5s'
    },
    messageCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.15)',
      borderRadius: '16px',
      marginBottom: '20px',
      border: `1px solid ${isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.3)'}`
    },
    messageText: {
      fontSize: '14px',
      color: isDark ? '#86EFAC' : '#166534'
    },
    tasksCard: {
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '20px',
      padding: '20px',
      border: `1px solid var(--border-light)`,
      marginBottom: '20px'
    },
    tasksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    tasksTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--text-primary)'
    },
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '12px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    taskCompleted: {
      opacity: 0.6
    },
    taskCheck: {
      cursor: 'pointer',
      color: 'var(--text-muted)'
    },
    taskCheckCompleted: {
      color: '#22C55E'
    },
    taskInfo: {
      flex: 1
    },
    taskTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--text-primary)',
      marginBottom: '4px'
    },
    taskDesc: {
      fontSize: '11px',
      color: 'var(--text-muted)'
    },
    taskMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    taskXp: {
      fontSize: '12px',
      color: '#F59E0B'
    },
    taskTime: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    priorityBadge: {
      fontSize: '10px',
      padding: '2px 8px',
      borderRadius: '10px',
      fontWeight: '500'
    },
    tipsCard: {
      padding: '20px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '20px',
      border: `1px solid var(--border-light)`
    },
    tipsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: '8px'
    },
    tipsText: {
      fontSize: '13px',
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Panda Widget */}
      <PandaWidget />

      <div style={styles.levelProgress}>
        <div style={styles.levelHeader}>
          <span>⭐ Уровень {stats.level}</span>
          <span>{stats.xpEarned} / {stats.xpNextLevel} XP</span>
        </div>
        <div style={styles.levelBar}>
          <div style={{ ...styles.levelFill, width: `${percentToNext}%` }} />
        </div>
      </div>

      <motion.div variants={statsVariants} style={styles.statsGrid}>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <motion.div
              style={styles.statValue}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              {stats.completedTasks}/{stats.totalTasks}
            </motion.div>
            <div style={styles.statLabel}>Задач выполнено</div>
          </div>
        </motion.div>

        <motion.div style={styles.statCard} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statIcon}><Flame size={24} color="#F59E0B" /></div>
          <div>
            <motion.div
              style={styles.statValue}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {stats.streak}
            </motion.div>
            <div style={styles.statLabel}>Дней подряд</div>
          </div>
        </motion.div>

        <motion.div style={styles.statCard} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statIcon}><Award size={24} color="#22C55E" /></div>
          <div>
            <motion.div
              style={styles.statValue}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              {stats.achievements}
            </motion.div>
            <div style={styles.statLabel}>Достижений</div>
          </div>
        </motion.div>

        <motion.div style={styles.statCard} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statIcon}><Zap size={24} color="#818CF8" /></div>
          <div>
            <motion.div
              style={styles.statValue}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
            >
              {stats.xpEarned}
            </motion.div>
            <div style={styles.statLabel}>XP набрано</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} style={styles.tasksCard}>
        <div style={styles.tasksHeader}>
          <div style={styles.tasksTitle}>📋 Задачи на сегодня</div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {todayTasks.filter(t => !t.completed).length} осталось
          </span>
        </div>

        <AnimatePresence>
          {todayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleToggleTask(task.id)}
              style={{
                ...styles.taskItem,
                ...(task.completed && styles.taskCompleted)
              }}
            >
              <div style={{ ...styles.taskCheck, ...(task.completed && styles.taskCheckCompleted) }}>
                {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
              </div>
              <div style={styles.taskInfo}>
                <div style={styles.taskTitle}>{task.title}</div>
                <div style={styles.taskDesc}>{task.description}</div>
                <div style={styles.taskMeta}>
                  <span style={styles.taskXp}>+{task.xp} XP</span>
                  <span style={styles.taskTime}>
                    <Calendar size={11} />
                    {task.dueTime}
                  </span>
                  <span style={{
                    ...styles.priorityBadge,
                    backgroundColor: `${getPriorityColor(task.priority)}20`,
                    color: getPriorityColor(task.priority)
                  }}>
                    {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={styles.messageCard}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Sparkles size={18} color={isDark ? "#F59E0B" : "#D97706"} />
        </motion.div>
        <span style={styles.messageText}>Отличное начало! Продолжайте в том же духе! 🚀</span>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={styles.tipsCard}
        whileHover={{ y: -2 }}
      >
        <h3 style={styles.tipsTitle}>💡 Совет дня</h3>
        <p style={styles.tipsText}>
          Не забывайте заполнять еженедельный Pulse Check — это помогает вашему наставнику
          лучше понимать ваш прогресс и своевременно оказывать поддержку!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;