import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { Mail, Phone, Briefcase, Calendar, LogOut, Edit2, Check, X, User, MapPin, Globe, Heart, Music, Film, Book, Gamepad2, Quote, GraduationCap, Linkedin, Github, MessageCircle } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    location: '',
    education: '',
    favoriteMusic: '',
    favoriteMovies: '',
    favoriteBooks: '',
    favoriteGames: '',
    quote: '',
    socialVk: '',
    socialTg: '',
    socialGit: ''
  });
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalTasks: 35,
    xpEarned: 0,
    streak: 0,
    badges: 0
  });

  // Загрузка количества достижений
  const loadAchievementsCount = () => {
    const saved = localStorage.getItem('customAchievements');
    if (saved) {
      const achievements = JSON.parse(saved);
      return achievements.filter(a => a.earned === true).length;
    }
    // Демо-данные для первого запуска
    return 8;
  };

  // Загрузка профиля пользователя
  useEffect(() => {
    // Загружаем сохранённый профиль
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setEditForm(prev => ({ ...prev, ...profile }));
    } else if (user) {
      setEditForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      }));
    }

    // Загружаем статистику
    const savedStats = localStorage.getItem('onboardingProgress');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        completedTasks: parsed.tasksCompleted || 0,
        totalTasks: parsed.tasksTotal || 35,
        xpEarned: parsed.xpEarned || 0,
        streak: parsed.streak || 0,
        badges: loadAchievementsCount()
      });
    } else {
      setStats({
        completedTasks: 12,
        totalTasks: 35,
        xpEarned: 1240,
        streak: 7,
        badges: loadAchievementsCount()
      });
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile(editForm);
    // Сохраняем расширенный профиль
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    setIsEditing(false);
    addNotification('success', 'Профиль обновлён!');
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '20px',
      border: '1px solid var(--border-light)',
      flexWrap: 'wrap'
    },
    avatar: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #FF6611, #E55A0E)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white'
    },
    userName: { fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' },
    userRole: { fontSize: '14px', color: '#FF6611', marginBottom: '8px' },
    editBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#334155',
      border: 'none',
      borderRadius: '10px',
      color: '#E2E8F0',
      fontSize: '12px',
      cursor: 'pointer'
    },
    input: {
      padding: '10px',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: '10px',
      color: 'var(--text-primary)',
      marginBottom: '8px',
      width: '200px'
    },
    inputFull: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: '10px',
      color: 'var(--text-primary)',
      marginBottom: '12px',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: '10px',
      color: 'var(--text-primary)',
      marginBottom: '12px',
      resize: 'vertical',
      outline: 'none'
    },
    editActions: { display: 'flex', gap: '8px', marginTop: '8px' },
    saveBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      backgroundColor: '#22C55E',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer'
    },
    cancelBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      backgroundColor: '#334155',
      border: 'none',
      borderRadius: '8px',
      color: '#E2E8F0',
      cursor: 'pointer'
    },
    infoCard: {
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid var(--border-light)'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderBottom: '2px solid var(--border-light)',
      paddingBottom: '8px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid var(--border-light)',
      fontSize: '14px',
      color: 'var(--text-secondary)'
    },
    aboutBox: {
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '12px',
      padding: '12px',
      marginBottom: '12px',
      fontSize: '14px',
      color: 'var(--text-secondary)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '16px',
      padding: '16px',
      textAlign: 'center',
      border: '1px solid var(--border-light)'
    },
    statValue: { fontSize: '24px', fontWeight: '700', color: '#FF6611', marginBottom: '4px' },
    statLabel: { fontSize: '12px', color: 'var(--text-muted)' },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      padding: '14px',
      backgroundColor: '#7F1D1D',
      border: 'none',
      borderRadius: '16px',
      color: '#FCA5A5',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    interestsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px'
    },
    socialLinks: {
      display: 'flex',
      gap: '16px',
      marginTop: '12px',
      flexWrap: 'wrap'
    },
    socialLink: {
      color: '#FF6611',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          {user?.firstName?.[0] || user?.email?.[0] || 'U'}
        </div>

        {!isEditing ? (
          <div>
            <div style={styles.userName}>{user?.firstName} {user?.lastName}</div>
            <div style={styles.userRole}>{user?.position || 'DevOps Engineer'}</div>
            <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
              <Edit2 size={14} /> Редактировать профиль
            </button>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Имя"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                style={styles.input}
              />
            </div>
            <input
              type="tel"
              placeholder="Телефон"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              style={{ ...styles.input, width: '100%' }}
            />
            <div style={styles.editActions}>
              <button onClick={handleSave} style={styles.saveBtn}><Check size={14} /> Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}><X size={14} /> Отмена</button>
            </div>
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <div style={styles.sectionTitle}>
          <User size={16} /> О себе
        </div>
        {isEditing ? (
          <textarea
            rows={3}
            placeholder="Расскажите о себе"
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            style={styles.textarea}
          />
        ) : (
          <div style={styles.aboutBox}>
            {editForm.bio || 'Пока ничего не рассказано о себе. Нажмите "Редактировать профиль" чтобы добавить информацию.'}
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <div style={styles.sectionTitle}>
          <GraduationCap size={16} /> Образование
        </div>
        {isEditing ? (
          <input
            type="text"
            placeholder="ВУЗ, факультет, год окончания"
            value={editForm.education}
            onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
            style={styles.inputFull}
          />
        ) : (
          <div style={styles.aboutBox}>
            {editForm.education || 'Не указано'}
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <div style={styles.sectionTitle}>
          <Heart size={16} /> Интересы
        </div>
        <div style={styles.interestsGrid}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>🎵 Музыка</div>
            {isEditing ? (
              <input
                type="text"
                placeholder="Жанры, исполнители"
                value={editForm.favoriteMusic}
                onChange={(e) => setEditForm({ ...editForm, favoriteMusic: e.target.value })}
                style={styles.inputFull}
              />
            ) : (
              <div style={styles.aboutBox}>{editForm.favoriteMusic || 'Не указано'}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>🎬 Фильмы</div>
            {isEditing ? (
              <input
                type="text"
                placeholder="Любимые фильмы"
                value={editForm.favoriteMovies}
                onChange={(e) => setEditForm({ ...editForm, favoriteMovies: e.target.value })}
                style={styles.inputFull}
              />
            ) : (
              <div style={styles.aboutBox}>{editForm.favoriteMovies || 'Не указано'}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>📚 Книги</div>
            {isEditing ? (
              <input
                type="text"
                placeholder="Любимые книги"
                value={editForm.favoriteBooks}
                onChange={(e) => setEditForm({ ...editForm, favoriteBooks: e.target.value })}
                style={styles.inputFull}
              />
            ) : (
              <div style={styles.aboutBox}>{editForm.favoriteBooks || 'Не указано'}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>🎮 Игры</div>
            {isEditing ? (
              <input
                type="text"
                placeholder="Любимые игры"
                value={editForm.favoriteGames}
                onChange={(e) => setEditForm({ ...editForm, favoriteGames: e.target.value })}
                style={styles.inputFull}
              />
            ) : (
              <div style={styles.aboutBox}>{editForm.favoriteGames || 'Не указано'}</div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.sectionTitle}>
          <Quote size={16} /> Любимая цитата
        </div>
        {isEditing ? (
          <input
            type="text"
            placeholder="Ваша любимая цитата"
            value={editForm.quote}
            onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
            style={styles.inputFull}
          />
        ) : (
          <div style={styles.aboutBox}>"{editForm.quote || 'Не указано'}"</div>
        )}
      </div>

      <div style={styles.infoCard}>
        <div style={styles.sectionTitle}>
          <Globe size={16} /> Социальные сети
        </div>
        {isEditing ? (
          <>
            <input
              type="url"
              placeholder="Ссылка на ВКонтакте"
              value={editForm.socialVk}
              onChange={(e) => setEditForm({ ...editForm, socialVk: e.target.value })}
              style={styles.inputFull}
            />
            <input
              type="url"
              placeholder="Ссылка на Telegram"
              value={editForm.socialTg}
              onChange={(e) => setEditForm({ ...editForm, socialTg: e.target.value })}
              style={styles.inputFull}
            />
            <input
              type="url"
              placeholder="Ссылка на GitHub"
              value={editForm.socialGit}
              onChange={(e) => setEditForm({ ...editForm, socialGit: e.target.value })}
              style={styles.inputFull}
            />
          </>
        ) : (
          <div style={styles.socialLinks}>
            {editForm.socialVk && <a href={editForm.socialVk} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>ВКонтакте</a>}
            {editForm.socialTg && <a href={editForm.socialTg} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Telegram</a>}
            {editForm.socialGit && <a href={editForm.socialGit} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>GitHub</a>}
            {!editForm.socialVk && !editForm.socialTg && !editForm.socialGit && 'Не указано'}
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <div style={styles.sectionTitle}>
          <Mail size={16} /> Контактная информация
        </div>
        <div style={styles.infoRow}><Mail size={14} /><span>{user?.email || 'user@naumen.ru'}</span></div>
        <div style={styles.infoRow}><Phone size={14} /><span>{editForm.phone || '+7 (999) 123-45-67'}</span></div>
        <div style={styles.infoRow}><Briefcase size={14} /><span>{user?.position || 'DevOps Engineer'}</span></div>
        <div style={styles.infoRow}><Calendar size={14} /><span>Начало работы: 1 апреля 2026</span></div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.completedTasks}/{stats.totalTasks}</div>
          <div style={styles.statLabel}>Задач</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.streak}</div>
          <div style={styles.statLabel}>Дней 🔥</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.badges}</div>
          <div style={styles.statLabel}>Достижений</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.xpEarned}</div>
          <div style={styles.statLabel}>XP</div>
        </div>
      </div>

      <button onClick={logout} style={styles.logoutBtn}>
        <LogOut size={18} /> Выйти из системы
      </button>
    </div>
  );
};

export default Profile;