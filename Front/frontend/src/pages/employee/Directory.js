import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Search, Mail, Phone, Briefcase, Users, ChevronRight, Star, MessageCircle, Edit2, Save, X, Heart, Music, Film, Book, Gamepad2, Quote, User, GraduationCap, Globe, Linkedin } from 'lucide-react';

const Directory = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const isCurrentUser = (employee) => employee.email === user?.email;
  const canEdit = (employee) => isCurrentUser(employee) || user?.role === 'HR_MANAGER';

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const saved = localStorage.getItem('employeesProfile');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      const defaultEmployees = [
        {
          id: 1,
          firstName: 'Александр',
          lastName: 'Петров',
          position: 'DevOps Engineer',
          department: 'DevOps',
          team: 'Инфраструктура',
          responsibility: 'CI/CD, мониторинг, облачная инфраструктура',
          status: 'online',
          email: 'demo@naumen.ru',
          phone: '+7 (495) 123-45-67',
          avatar: 'А',
          location: 'Москва, офис 507',
          about: 'Люблю автоматизировать всё, что можно автоматизировать',
          education: 'МГТУ им. Баумана, Факультет информатики',
          favoriteMusic: 'Rock, Electronic, Lo-fi',
          favoriteMovies: 'Интерстеллар, Матрица, Начало',
          favoriteBooks: '1984, Мастер и Маргарита, Clean Code',
          favoriteGames: 'Factorio, Portal, Starcraft',
          quote: 'Code is poetry',
          socialVk: 'https://vk.com/id123',
          socialTg: 'https://t.me/username',
          socialGit: 'https://github.com/username'
        },
        {
          id: 2,
          firstName: 'Анна',
          lastName: 'Кузнецова',
          position: 'Team Lead',
          department: 'DevOps',
          team: 'Инфраструктура',
          responsibility: 'Управление командой, архитектура',
          status: 'online',
          email: 'a.kuznetsova@naumen.ru',
          phone: '+7 (495) 123-45-68',
          avatar: 'А',
          location: 'Москва, офис 501',
          about: '10 лет в IT, люблю менторить новичков',
          education: 'МФТИ, Прикладная математика',
          favoriteMusic: 'Jazz, Classical',
          favoriteMovies: 'Оппенгеймер, Форрест Гамп',
          favoriteBooks: 'The Pragmatic Programmer',
          favoriteGames: 'Civilization, Cities Skylines',
          quote: 'Simplicity is the ultimate sophistication',
          socialVk: 'https://vk.com/id456',
          socialTg: 'https://t.me/annak'
        },
        {
          id: 3,
          firstName: 'Иван',
          lastName: 'Петров',
          position: 'Senior DevOps',
          department: 'DevOps',
          team: 'Инфраструктура',
          responsibility: 'Kubernetes, Docker, автоматизация',
          status: 'busy',
          email: 'i.petrov@naumen.ru',
          phone: '+7 (495) 123-45-69',
          avatar: 'И',
          location: 'Санкт-Петербург, офис 203',
          isMentor: true,
          about: 'Помогаю новичкам освоиться в компании',
          education: 'СПбГУ, Программная инженерия',
          favoriteMusic: 'Metal, Rock',
          favoriteMovies: 'Бойцовский клуб, Остров проклятых',
          favoriteBooks: 'Совершенный код, Мифический человеко-месяц',
          favoriteGames: 'World of Warcraft, Dota 2',
          quote: 'Always be learning',
          socialVk: 'https://vk.com/id789',
          socialTg: 'https://t.me/ivanpetrov'
        }
      ];
      setEmployees(defaultEmployees);
      localStorage.setItem('employeesProfile', JSON.stringify(defaultEmployees));
    }
  };

  const saveEmployeeProfile = () => {
    const updated = employees.map(emp =>
      emp.id === editData.id ? { ...emp, ...editData } : emp
    );
    setEmployees(updated);
    localStorage.setItem('employeesProfile', JSON.stringify(updated));
    setSelectedEmployee(editData);
    setIsEditing(false);
    addNotification('success', 'Профиль обновлён!');
  };

  const departments = ['all', ...new Set(employees.map(e => e.department))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.position} ${emp.department}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return '#22C55E';
      case 'busy': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return 'Онлайн';
      case 'busy': return 'Занят';
      default: return 'Оффлайн';
    }
  };

  const startEdit = (employee) => {
    setEditData({ ...employee });
    setIsEditing(true);
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    searchSection: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
    searchBox: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--border-light)`, borderRadius: '16px', padding: '12px 16px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px' },
    filterButtons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    filterBtn: { padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--border-light)`, color: 'var(--text-muted)' },
    filterBtnActive: { backgroundColor: '#FF6611', borderColor: '#FF6611', color: 'white' },
    employeesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' },
    employeeCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)`, cursor: 'pointer', transition: 'all 0.2s' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
    modalContent: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', maxWidth: '700px', width: '90%', maxHeight: '85vh', overflow: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `2px solid var(--border-light)`, paddingBottom: '8px' },
    infoRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid var(--border-light)`, fontSize: '14px', color: 'var(--text-secondary)' },
    aboutBox: { backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '16px', marginBottom: '16px' },
    socialLinks: { display: 'flex', gap: '16px', marginTop: '12px' },
    socialLink: { color: '#FF6611', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
    editInput: { width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px' },
    editTextarea: { width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', resize: 'vertical' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Кто есть кто</h1>
        <p style={styles.subtitle}>Справочник сотрудников компании</p>
      </div>

      <div style={styles.searchSection}>
        <div style={styles.searchBox}>
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Поиск по имени, должности, отделу..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
        </div>
        <div style={styles.filterButtons}>
          {departments.map(dept => (
            <button key={dept} onClick={() => setSelectedDepartment(dept)} style={{ ...styles.filterBtn, ...(selectedDepartment === dept && styles.filterBtnActive) }}>
              {dept === 'all' ? 'Все отделы' : dept}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.employeesGrid}>
        {filteredEmployees.map(emp => (
          <div key={emp.id} style={styles.employeeCard} onClick={() => setSelectedEmployee(emp)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6611, #E55A0E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{emp.avatar}</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: '13px', color: '#FF6611' }}>{emp.position}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(emp.status) }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{getStatusText(emp.status)}</span>
                  {emp.isMentor && <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(255,102,17,0.1)', borderRadius: '10px', color: '#FF6611' }}>⭐ Наставник</span>}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}><Briefcase size={14} style={{ display: 'inline', marginRight: '6px' }} /> {emp.responsibility}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📧 {emp.email}</div>
          </div>
        ))}
      </div>

      {/* Модальное окно профиля */}
      {selectedEmployee && !isEditing && (
        <div style={styles.modalOverlay} onClick={() => setSelectedEmployee(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {canEdit(selectedEmployee) && <button onClick={() => startEdit(selectedEmployee)} style={{ padding: '8px', backgroundColor: '#FF6611', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Edit2 size={16} color="white" /></button>}
                <button onClick={() => setSelectedEmployee(null)} style={{ padding: '8px', backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><X size={16} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6611, #E55A0E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{selectedEmployee.avatar}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#FF6611' }}>{selectedEmployee.position}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{selectedEmployee.department} → {selectedEmployee.team}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getStatusColor(selectedEmployee.status) }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{getStatusText(selectedEmployee.status)}</span>
                </div>
              </div>
            </div>

            {/* Контактная информация */}
            <div>
              <div style={styles.sectionTitle}><Mail size={16} /> Контакты</div>
              <div style={styles.infoRow}><Mail size={16} /><span>{selectedEmployee.email}</span></div>
              <div style={styles.infoRow}><Phone size={16} /><span>{selectedEmployee.phone}</span></div>
              <div style={styles.infoRow}><Briefcase size={16} /><span>{selectedEmployee.location}</span></div>
            </div>

            {/* О себе */}
            {selectedEmployee.about && (
              <div style={{ marginTop: '20px' }}>
                <div style={styles.sectionTitle}><User size={16} /> О себе</div>
                <div style={styles.aboutBox}>{selectedEmployee.about}</div>
              </div>
            )}

            {/* Образование */}
            {selectedEmployee.education && (
              <div style={{ marginTop: '20px' }}>
                <div style={styles.sectionTitle}><GraduationCap size={16} /> Образование</div>
                <div style={styles.aboutBox}>{selectedEmployee.education}</div>
              </div>
            )}

            {/* Интересы */}
            <div style={{ marginTop: '20px' }}>
              <div style={styles.sectionTitle}><Heart size={16} /> Интересы</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {selectedEmployee.favoriteMusic && <div style={styles.infoRow}><Music size={16} /><span>{selectedEmployee.favoriteMusic}</span></div>}
                {selectedEmployee.favoriteMovies && <div style={styles.infoRow}><Film size={16} /><span>{selectedEmployee.favoriteMovies}</span></div>}
                {selectedEmployee.favoriteBooks && <div style={styles.infoRow}><Book size={16} /><span>{selectedEmployee.favoriteBooks}</span></div>}
                {selectedEmployee.favoriteGames && <div style={styles.infoRow}><Gamepad2 size={16} /><span>{selectedEmployee.favoriteGames}</span></div>}
              </div>
            </div>

            {/* Любимая цитата */}
            {selectedEmployee.quote && (
              <div style={{ marginTop: '20px' }}>
                <div style={styles.sectionTitle}><Quote size={16} /> Любимая цитата</div>
                <div style={styles.aboutBox}>"{selectedEmployee.quote}"</div>
              </div>
            )}

            {/* Социальные сети */}
            {(selectedEmployee.socialVk || selectedEmployee.socialTg || selectedEmployee.socialGit) && (
              <div style={{ marginTop: '20px' }}>
                <div style={styles.sectionTitle}><Globe size={16} /> Социальные сети</div>
                <div style={styles.socialLinks}>
                  {selectedEmployee.socialVk && <a href={selectedEmployee.socialVk} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>ВКонтакте</a>}
                  {selectedEmployee.socialTg && <a href={selectedEmployee.socialTg} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Telegram</a>}
                  {selectedEmployee.socialGit && <a href={selectedEmployee.socialGit} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>GitHub</a>}
                </div>
              </div>
            )}

            <button style={{ width: '100%', marginTop: '24px', padding: '12px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <MessageCircle size={16} /> Написать в чат
            </button>
          </div>
        </div>
      )}

      {/* Режим редактирования */}
      {isEditing && editData && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Редактировать профиль</h2>
              <button onClick={() => setIsEditing(false)} style={{ padding: '8px', backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={styles.sectionTitle}><User size={16} /> О себе</div>
            <textarea rows={3} placeholder="Расскажите о себе" value={editData.about || ''} onChange={e => setEditData({...editData, about: e.target.value})} style={styles.editTextarea} />

            <div style={styles.sectionTitle}><GraduationCap size={16} /> Образование</div>
            <input type="text" placeholder="ВУЗ, факультет, год окончания" value={editData.education || ''} onChange={e => setEditData({...editData, education: e.target.value})} style={styles.editInput} />

            <div style={styles.sectionTitle}><Music size={16} /> Любимая музыка</div>
            <input type="text" placeholder="Жанры, исполнители" value={editData.favoriteMusic || ''} onChange={e => setEditData({...editData, favoriteMusic: e.target.value})} style={styles.editInput} />

            <div style={styles.sectionTitle}><Film size={16} /> Любимые фильмы</div>
            <input type="text" placeholder="Названия фильмов" value={editData.favoriteMovies || ''} onChange={e => setEditData({...editData, favoriteMovies: e.target.value})} style={styles.editInput} />

            <div style={styles.sectionTitle}><Book size={16} /> Любимые книги</div>
            <input type="text" placeholder="Названия книг" value={editData.favoriteBooks || ''} onChange={e => setEditData({...editData, favoriteBooks: e.target.value})} style={styles.editInput} />

            <div style={styles.sectionTitle}><Gamepad2 size={16} /> Любимые игры</div>
            <input type="text" placeholder="Названия игр" value={editData.favoriteGames || ''} onChange={e => setEditData({...editData, favoriteGames: e.target.value})} style={styles.editInput} />

            <div style={styles.sectionTitle}><Quote size={16} /> Любимая цитата</div>
            <input type="text" placeholder="Ваша любимая цитата" value={editData.quote || ''} onChange={e => setEditData({...editData, quote: e.target.value})} style={styles.editInput} />

            <div style={styles.sectionTitle}><Globe size={16} /> Социальные сети</div>
            <input type="url" placeholder="Ссылка на ВКонтакте" value={editData.socialVk || ''} onChange={e => setEditData({...editData, socialVk: e.target.value})} style={styles.editInput} />
            <input type="url" placeholder="Ссылка на Telegram" value={editData.socialTg || ''} onChange={e => setEditData({...editData, socialTg: e.target.value})} style={styles.editInput} />
            <input type="url" placeholder="Ссылка на GitHub" value={editData.socialGit || ''} onChange={e => setEditData({...editData, socialGit: e.target.value})} style={styles.editInput} />

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={saveEmployeeProfile} style={{ flex: 1, padding: '12px', backgroundColor: '#22C55E', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Save size={16} /> Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;