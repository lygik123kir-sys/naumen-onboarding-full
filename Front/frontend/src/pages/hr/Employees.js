import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Search } from 'lucide-react';
// Импортируем наш сетевой сервис для связи с NestJS
import apiService from '../../services/apiService';

const Employees = () => {
  const { isDark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Реальный запрос к бэкенду при загрузке страницы
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getEmployees();
        setEmployees(Array.isArray(data) ? data : (data.users || []));
      } catch (err) {
        console.error('Ошибка при получении сотрудников:', err);
        setError('Не удалось загрузить сотрудников с бэкенда');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filtered = employees.filter(e => {
    const fullName = e.name || `${e.firstName || ''} ${e.lastName || ''}` || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    return s === 'active' || s === 'newbie' ? '#22C55E' : '#6366F1';
  };

  const getMoodIcon = (mood) => ({ good: '😊', okay: '😐', excellent: '🤩', bad: '😫' }[mood] || '😐');

  // Переписали стили на железобетонный Flexbox с фиксированной шириной ячеек
  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '12px 16px', width: '300px' },
    searchInput: { flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' },
    table: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-light)' },

    // Строки и шапка как флекс-контейнеры
    tableHeader: {
      display: 'flex',
      padding: '14px 20px',
      backgroundColor: 'var(--bg-tertiary)',
      fontWeight: '600',
      color: 'var(--text-primary)',
      alignItems: 'center'
    },
    tableRow: {
      display: 'flex',
      padding: '14px 20px',
      borderBottom: '1px solid var(--border-light)',
      alignItems: 'center'
    },

    // Жестко задаем ширину для каждой из 6 колонок в процентах
    col1: { width: '25%', minWidth: '150px', textAlign: 'left', display: 'block' }, // Сотрудник
    col2: { width: '15%', minWidth: '100px', textAlign: 'left', display: 'block' }, // Роль
    col3: { width: '20%', minWidth: '120px', textAlign: 'left', display: 'block' }, // Наставник
    col4: { width: '15%', minWidth: '90px',  textAlign: 'left', display: 'block' }, // Прогресс
    col5: { width: '13%', minWidth: '90px',  textAlign: 'left', display: 'block' }, // Статус
    col6: { width: '12%', minWidth: '60px',  textAlign: 'center', display: 'block' }  // Настроение
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.container, textAlign: 'center', padding: '40px', color: 'var(--text-primary)' }}>
        <h2>Загрузка списка сотрудников...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Управление сотрудниками</h1>
        <div style={styles.searchBox}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
          ⚠️ {error}.
        </div>
      )}

      <div style={styles.table}>
        {/* Шапка таблицы: теперь у каждого элемента своя принудительная ширина */}
        <div style={styles.tableHeader}>
          <div style={styles.col1}>Сотрудник</div>
          <div style={styles.col2}>Роль</div>
          <div style={styles.col3}>Наставник</div>
          <div style={styles.col4}>Прогресс</div>
          <div style={styles.col5}>Статус</div>
          <div style={styles.col6}>Настроение</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Сотрудники не найдены</div>
        ) : (
          filtered.map(emp => {
            const employeeName = emp.name || `${emp.firstName || ''} ${emp.lastName || ''}` || 'Неизвестный';
            const employeeRole = emp.role || emp.position || 'devops';

            const employeeMentor = emp.mentor
              ? (typeof emp.mentor === 'object' ? (emp.mentor.name || `${emp.mentor.firstName || ''} ${emp.mentor.lastName || ''}`.trim() || 'Наставник') : emp.mentor)
              : 'Не назначен';

            const employeeProgress = emp.progress !== undefined ? emp.progress : 25;
            const employeeStatus = emp.status || 'active';
            const employeeMood = emp.mood || 'good';

            return (
              <div key={emp.id} style={styles.tableRow}>
                <div style={{ ...styles.col1, fontWeight: '500', color: 'var(--text-primary)' }}>{employeeName}</div>
                <div style={{ ...styles.col2, fontSize: '13px', color: 'var(--text-muted)' }}>{employeeRole}</div>
                <div style={{ ...styles.col3, fontSize: '13px', color: 'var(--text-muted)' }}>{employeeMentor}</div>
                <div style={styles.col4}>
                  <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', display: 'inline-block', marginRight: '8px' }}>
                    <div style={{ width: `${employeeProgress}%`, height: '100%', backgroundColor: '#6366F1', borderRadius: '2px' }} />
                  </div>
                  {employeeProgress}%
                </div>
                <div style={styles.col5}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    backgroundColor: `${getStatusColor(employeeStatus)}20`,
                    color: getStatusColor(employeeStatus)
                  }}>
                    {String(employeeStatus).toLowerCase() === 'active' || String(employeeStatus).toLowerCase() === 'newbie' ? 'Активен' : 'Завершил'}
                  </span>
                </div>
                <div style={{ ...styles.col6, fontSize: '20px' }}>{getMoodIcon(employeeMood)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Employees;