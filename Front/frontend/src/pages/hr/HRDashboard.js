import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import {
  FileText, BarChart3, PieChart, Activity
} from 'lucide-react';
// Импортируем сетевой сервис для связи с NestJS
import apiService from '../../services/apiService';

const HRDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, atRisk: 0, avgProgress: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Стучимся на реальный бэкенд NestJS за пользователями
      const data = await apiService.getEmployees();
      const loadedEmployees = Array.isArray(data) ? data : (data.users || []);

      setEmployees(loadedEmployees);

      // Математический пересчет аналитики на основе живых данных из базы Neon
      if (loadedEmployees.length > 0) {
        const total = loadedEmployees.length;
        const completed = loadedEmployees.filter(e => (e.progress !== undefined ? e.progress : 25) >= 100).length;
        const atRisk = loadedEmployees.filter(e => (e.progress !== undefined ? e.progress : 25) < 30).length;
        const totalProgress = loadedEmployees.reduce((acc, e) => acc + (e.progress !== undefined ? e.progress : 25), 0);
        const avgProgress = Math.round(totalProgress / total);

        setStats({ total, completed, atRisk, avgProgress });
      } else {
        setStats({ total: 0, completed: 0, atRisk: 0, avgProgress: 0 });
      }
    } catch (err) {
      console.error('Ошибка загрузки дашборда HR:', err);
      addNotification('error', 'Не удалось загрузить данные аналитики с бэкенда');
    } finally {
      setIsLoading(false);
    }
  };

  // Экспорт в CSV (с поддержкой реальных полей бэка)
  const exportToCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['ID', 'Имя', 'Роль', 'Дата начала', 'Прогресс (%)', 'Статус', 'Настроение', 'Email'];
      const rows = employees.map(emp => {
        const empName = emp.name || `${emp.firstName || ''} ${emp.lastName || ''}` || 'Неизвестный';
        const empProgress = emp.progress !== undefined ? emp.progress : 25;
        return [
          emp.id, empName, emp.role || 'devops', emp.startDate || '2026-05-17', empProgress,
          empProgress >= 100 ? 'Завершил' : 'Активен',
          emp.mood || 'good', emp.email || '—'
        ];
      });
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `employees_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      addNotification('success', 'Отчёт экспортирован в CSV');
    }, 500);
  };

  // Экспорт в JSON
  const exportToJSON = () => {
    setIsExporting(true);
    setTimeout(() => {
      const report = {
        generatedAt: new Date().toISOString(),
        stats,
        employees
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `full_report_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      addNotification('success', 'Полный отчёт экспортирован в JSON');
    }, 500);
  };

  const getStatusColor = (progress) => {
    if (progress >= 100) return '#22C55E';
    if (progress >= 60) return '#818CF8';
    if (progress >= 30) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusText = (progress) => {
    if (progress >= 100) return 'Завершил';
    if (progress >= 60) return 'Хороший прогресс';
    if (progress >= 30) return 'В процессе';
    return 'Требует внимания';
  };

  const getMoodIcon = (mood) => {
    switch(String(mood).toLowerCase()) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😫';
      default: return '😊';
    }
  };

  // Данные для графиков динамики (привязаны к среднему прогрессу)
  const weeklyData = [
    { week: 'Неделя 1', value: Math.round(stats.avgProgress * 0.7) || 30 },
    { week: 'Неделя 2', value: Math.round(stats.avgProgress * 0.8) || 45 },
    { week: 'Неделя 3', value: Math.round(stats.avgProgress * 0.85) || 50 },
    { week: 'Неделя 4', value: stats.avgProgress || 52 }
  ];

  // Данные для круговой диаграммы
  const pieData = [
    { name: 'Активные', value: Math.max(0, stats.total - stats.completed - stats.atRisk), color: '#818CF8' },
    { name: 'Завершили', value: stats.completed, color: '#22C55E' },
    { name: 'В зоне риска', value: stats.atRisk, color: '#EF4444' }
  ];

  // Динамическая SVG круговая диаграмма
  const PieChartComponent = () => {
    const total = pieData.reduce((acc, d) => acc + d.value, 0);
    let currentAngle = 0;

    if (total === 0) {
      return (
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="70" fill="none" stroke="var(--border-light)" strokeWidth="8" />
          <circle cx="75" cy="75" r="40" fill="var(--bg-secondary)" />
          <text x="75" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="14">0</text>
        </svg>
      );
    }

    const getPath = (value) => {
      const angle = (value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle += angle;

      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;

      const x1 = 75 + 70 * Math.cos(startRad);
      const y1 = 75 + 70 * Math.sin(startRad);
      const x2 = 75 + 70 * Math.cos(endRad);
      const y2 = 75 + 70 * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      return `M 75 75 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    currentAngle = 0;

    return (
      <svg width="150" height="150" viewBox="0 0 150 150">
        {pieData.map((item, idx) => {
          if (item.value === 0) return null;
          const path = getPath(item.value);
          return <path key={idx} d={path} fill={item.color} stroke="var(--bg-secondary)" strokeWidth="2" />;
        })}
        <circle cx="75" cy="75" r="40" fill="var(--bg-secondary)" />
        <text x="75" y="80" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="bold">{stats.total}</text>
        <text x="75" y="95" textAnchor="middle" fill="var(--text-muted)" fontSize="10">всего</text>
      </svg>
    );
  };

  const styles = {
    container: { maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)`, cursor: 'pointer', transition: 'all 0.3s' },
    statValue: { fontSize: '32px', fontWeight: '700', color: '#FF6611', marginBottom: '4px' },
    statLabel: { fontSize: '13px', color: 'var(--text-muted)' },
    chartCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', border: `1px solid var(--border-light)`, marginBottom: '24px' },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
    chartTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    exportButtons: { display: 'flex', gap: '12px' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    chartBars: { display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '20px 0' },
    bar: { flex: 1, backgroundColor: '#FF6611', borderRadius: '8px', transition: 'height 0.5s ease', cursor: 'pointer' },
    barLabel: { fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' },
    pieContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '20px' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
    legendColor: { width: '16px', height: '16px', borderRadius: '4px' },
    employeeTable: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', overflow: 'hidden', border: `1px solid var(--border-light)` },
    tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1.5fr 1fr', padding: '14px 20px', backgroundColor: 'var(--bg-tertiary)', fontWeight: '600', color: 'var(--text-primary)' },
    tableRow: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1.5fr 1fr', padding: '14px 20px', borderBottom: `1px solid var(--border-light)`, alignItems: 'center' }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-primary)', padding: '40px', textAlign: 'center' }}>Загрузка глобальной аналитики...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><BarChart3 size={28} color="#FF6611" /> HR Дашборд</h1>
        <p style={styles.subtitle}>Управление адаптацией сотрудников</p>
      </div>

      {/* Статистика */}
      <div style={styles.statsGrid}>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Всего сотрудников</div>
        </motion.div>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }}>
          <div style={styles.statValue}>{stats.completed}</div>
          <div style={styles.statLabel}>Завершили ИС</div>
        </motion.div>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }}>
          <div style={styles.statValue}>{stats.atRisk}</div>
          <div style={styles.statLabel}>В зоне риска</div>
        </motion.div>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }}>
          <div style={styles.statValue}>{stats.avgProgress}%</div>
          <div style={styles.statLabel}>Средний прогресс</div>
        </motion.div>
      </div>

      {/* График динамики */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div style={styles.chartTitle}><Activity size={18} style={{ display: 'inline', marginRight: '8px' }} /> Динамика завершения адаптации</div>
          <div style={styles.exportButtons}>
            <motion.button onClick={exportToCSV} disabled={isExporting} style={styles.exportBtn} whileHover={{ scale: 1.02 }}>
              <FileText size={16} /> Экспорт в CSV
            </motion.button>
            <motion.button onClick={exportToJSON} disabled={isExporting} style={{ ...styles.exportBtn, backgroundColor: '#22C55E' }} whileHover={{ scale: 1.02 }}>
              <FileText size={16} /> Экспорт в JSON
            </motion.button>
          </div>
        </div>
        <div style={styles.chartBars}>
          {weeklyData.map((data, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div
                style={{ ...styles.bar, height: `${data.value * 2}px`, width: '100%' }}
                initial={{ height: 0 }}
                animate={{ height: `${data.value * 2}px` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              />
              <div style={styles.barLabel}>{data.week}<br />{data.value}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Круговая диаграмма */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div style={styles.chartTitle}><PieChart size={18} style={{ display: 'inline', marginRight: '8px' }} /> Распределение сотрудников</div>
        </div>
        <div style={styles.pieContainer}>
          <PieChartComponent />
          <div>
            {pieData.map((item, idx) => (
              <div key={idx} style={styles.legendItem}>
                <div style={{ ...styles.legendColor, backgroundColor: item.color }} />
                <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                <span style={{ color: '#FF6611', fontWeight: '600', marginLeft: '10px' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Таблица сотрудников */}
      <div style={styles.employeeTable}>
        <div style={styles.tableHeader}>
          <span>Сотрудник</span>
          <span>Роль</span>
          <span>Дата начала</span>
          <span>Прогресс</span>
          <span>Статус</span>
          <span>Настроение</span>
        </div>
        {employees.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>В базе данных нет сотрудников</div>
        ) : (
          employees.map(emp => {
            const empName = emp.name || `${emp.firstName || ''} ${emp.lastName || ''}` || 'Неизвестный';
            const empProgress = emp.progress !== undefined ? emp.progress : 25;
            return (
              <div key={emp.id} style={styles.tableRow}>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{empName}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{emp.role || 'devops'}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{emp.startDate || '2026-05-17'}</span>
                <span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${empProgress}%`, height: '100%', backgroundColor: getStatusColor(empProgress) }} />
                    </div>
                    <span style={{ fontSize: '12px' }}>{empProgress}%</span>
                  </div>
                </span>
                <span>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', backgroundColor: `${getStatusColor(empProgress)}20`, color: getStatusColor(empProgress) }}>
                    {getStatusText(empProgress)}
                  </span>
                </span>
                <span style={{ fontSize: '20px' }}>{getMoodIcon(emp.mood)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HRDashboard;