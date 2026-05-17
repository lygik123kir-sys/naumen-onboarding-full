import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import ProgressSyncService from '../../services/progressSync';
import { TrendingUp, Users, Save, RefreshCw } from 'lucide-react';

const UpdateProgress = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const data = ProgressSyncService.getAllEmployeesWithProgress();
    setEmployees(data);
  };

  const handleUpdateProgress = () => {
    if (selectedEmployee) {
      ProgressSyncService.updateEmployeeProgress(selectedEmployee.id, progress);
      addNotification('success', `Прогресс ${selectedEmployee.name} обновлён до ${progress}%`);
      loadEmployees();
    }
  };

  const handleSyncTasks = () => {
    if (selectedEmployee) {
      const newProgress = ProgressSyncService.syncMentorTasksProgress(selectedEmployee.id);
      setProgress(newProgress);
      addNotification('success', `Прогресс синхронизирован: ${newProgress}%`);
    }
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    card: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' },
    select: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '16px' },
    btn: { padding: '12px 24px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' },
    btnSecondary: { padding: '12px 24px', backgroundColor: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><TrendingUp size={28} color="#FF6611" /> Обновление прогресса</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Управление прогрессом подопечных</p>
      </div>

      <div style={styles.card}>
        <label style={{ marginBottom: '8px', display: 'block', color: 'var(--text-secondary)' }}>Выберите сотрудника</label>
        <select
          value={selectedEmployee?.id || ''}
          onChange={(e) => {
            const emp = employees.find(emp => emp.id === parseInt(e.target.value));
            setSelectedEmployee(emp);
            setProgress(emp?.progress || 0);
          }}
          style={styles.select}
        >
          <option value="">Выберите сотрудника</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} - текущий прогресс: {emp.progress}%</option>
          ))}
        </select>

        {selectedEmployee && (
          <>
            <label style={{ marginBottom: '8px', display: 'block', color: 'var(--text-secondary)' }}>Новый прогресс (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              style={{ width: '100%', marginBottom: '16px' }}
            />
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '24px', fontWeight: '700', color: '#FF6611' }}>{progress}%</div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleUpdateProgress} style={styles.btn}><Save size={16} /> Сохранить прогресс</button>
              <button onClick={handleSyncTasks} style={styles.btnSecondary}><RefreshCw size={16} /> Синхронизировать с задачами</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateProgress;