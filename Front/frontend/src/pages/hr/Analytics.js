import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, CheckCircle, AlertCircle, Calendar,
  Download, FileText, BarChart3, PieChart, Activity,
  ChevronLeft, ChevronRight, Award, Target, Clock
} from 'lucide-react';
import ProgressSyncService from '../../services/progressSync';

const Analytics = () => {
  const { isDark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, atRisk: 0, avgProgress: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedChart, setSelectedChart] = useState('completion');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employeesWithProgress = ProgressSyncService.getAllEmployeesWithProgress();
    setEmployees(employeesWithProgress);

    setStats({
      total: employeesWithProgress.length,
      completed: employeesWithProgress.filter(e => e.progress >= 100).length,
      atRisk: employeesWithProgress.filter(e => e.progress < 30).length,
      avgProgress: Math.round(employeesWithProgress.reduce((acc, e) => acc + (e.progress || 0), 0) / (employeesWithProgress.length || 1))
    });
  };

  // Экспорт в CSV
  const exportToCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['ID', 'Имя', 'Роль', 'Дата начала', 'Прогресс (%)', 'Статус', 'Настроение', 'Email'];
      const rows = employees.map(emp => [
        emp.id, emp.name, emp.role, emp.startDate, emp.progress || 0,
        emp.status === 'completed' ? 'Завершил' : 'Активен',
        emp.mood || 'good', emp.email
      ]);
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 500);
  };

  // Экспорт в JSON
  const exportToJSON = () => {
    setIsExporting(true);
    setTimeout(() => {
      const report = {
        generatedAt: new Date().toISOString(),
        stats,
        employees,
        feedbackHistory: JSON.parse(localStorage.getItem('feedbackHistory')) || []
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `analytics_full_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 500);
  };

  const getStatusColor = (progress) => {
    if (progress >= 100) return '#22C55E';
    if (progress >= 60) return '#818CF8';
    if (progress >= 30) return '#F59E0B';
    return '#EF4444';
  };

  const getMoodIcon = (mood) => {
    switch(mood) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😫';
      default: return '😐';
    }
  };

  // Данные для графика по неделям
  const weeklyData = [
    { week: 'Неделя 1', value: 65 },
    { week: 'Неделя 2', value: 72 },
    { week: 'Неделя 3', value: 68 },
    { week: 'Неделя 4', value: 78 },
    { week: 'Неделя 5', value: 82 },
    { week: 'Неделя 6', value: 85 },
    { week: 'Неделя 7', value: 88 }
  ];

  // Данные для круговой диаграммы
  const pieData = [
    { name: 'Активные', value: stats.total - stats.completed, color: '#818CF8' },
    { name: 'Завершили', value: stats.completed, color: '#22C55E' },
    { name: 'В зоне риска', value: stats.atRisk, color: '#EF4444' }
  ];

  // Компонент круговой диаграммы
  const PieChartComponent = () => {
    const total = pieData.reduce((acc, d) => acc + d.value, 0);
    let currentAngle = 0;

    const getPath = (value) => {
      if (value === 0) return '';
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
    container: { maxWidth: '1200px', margin: '0 auto' },
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
    exportBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FF6611', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
    chartBars: { display: 'flex', alignItems: 'flex-end', gap: '16px', height: '220px', padding: '20px 0', marginBottom: '20px' },
    barWrapper: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    bar: { width: '100%', backgroundColor: '#FF6611', borderRadius: '8px', transition: 'height 0.5s ease', cursor: 'pointer' },
    barLabel: { fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' },
    barValue: { fontSize: '10px', color: '#FF6611', fontWeight: '500', marginBottom: '4px' },
    pieContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '20px' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    legendColor: { width: '16px', height: '16px', borderRadius: '4px' },
    legendLabel: { color: 'var(--text-primary)' },
    legendValue: { color: '#FF6611', fontWeight: '600' },
    employeeTable: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', overflow: 'hidden', border: `1px solid var(--border-light)` },
    tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1.5fr 1fr', padding: '14px 20px', backgroundColor: 'var(--bg-tertiary)', fontWeight: '600', color: 'var(--text-primary)' },
    tableRow: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1.5fr 1fr', padding: '14px 20px', borderBottom: `1px solid var(--border-light)`, alignItems: 'center' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><BarChart3 size={28} color="#FF6611" /> Аналитика адаптации</h1>
        <p style={styles.subtitle}>Ключевые метрики эффективности онбординга</p>
      </div>

      {/* Статистика */}
      <div style={styles.statsGrid}>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Всего сотрудников</div>
        </motion.div>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statValue}>{stats.completed}</div>
          <div style={styles.statLabel}>Завершили ИС</div>
        </motion.div>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statValue}>{stats.atRisk}</div>
          <div style={styles.statLabel}>В зоне риска</div>
        </motion.div>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <div style={styles.statValue}>{stats.avgProgress}%</div>
          <div style={styles.statLabel}>Средний прогресс</div>
        </motion.div>
      </div>

      {/* График динамики адаптации */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div style={styles.chartTitle}><Activity size={18} style={{ display: 'inline', marginRight: '8px' }} /> Динамика завершения адаптации</div>
          <div style={styles.exportButtons}>
            <motion.button onClick={exportToCSV} disabled={isExporting} style={styles.exportBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FileText size={16} /> {isExporting ? 'Экспорт...' : 'CSV'}
            </motion.button>
            <motion.button onClick={exportToJSON} disabled={isExporting} style={{ ...styles.exportBtn, backgroundColor: '#22C55E' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FileText size={16} /> {isExporting ? 'Экспорт...' : 'JSON'}
            </motion.button>
          </div>
        </div>

        {/* График в виде столбцов */}
        <div style={styles.chartBars}>
          {weeklyData.map((data, idx) => (
            <div key={idx} style={styles.barWrapper}>
              <motion.div
                style={{ ...styles.bar, height: `${data.value * 2}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${data.value * 2}px` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
              />
              <div style={styles.barValue}>{data.value}%</div>
              <div style={styles.barLabel}>{data.week}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Круговая диаграмма распределения */}
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
                <span style={styles.legendLabel}>{item.name}</span>
                <span style={styles.legendValue}>{item.value}</span>
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
        {employees.map(emp => (
          <div key={emp.id} style={styles.tableRow}>
            <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{emp.name}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{emp.role}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{emp.startDate}</span>
            <span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${emp.progress || 0}%`, height: '100%', backgroundColor: getStatusColor(emp.progress || 0) }} />
                </div>
                <span style={{ fontSize: '12px' }}>{emp.progress || 0}%</span>
              </div>
            </span>
            <span>
              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', backgroundColor: `${getStatusColor(emp.progress || 0)}20`, color: getStatusColor(emp.progress || 0) }}>
                {emp.progress >= 100 ? 'Завершил' : emp.progress >= 60 ? 'Хороший прогресс' : emp.progress >= 30 ? 'В процессе' : 'Требует внимания'}
              </span>
            </span>
            <span style={{ fontSize: '20px' }}>{getMoodIcon(emp.mood)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;