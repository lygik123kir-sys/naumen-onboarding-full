import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calendar, Clock, Users, Video, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Schedule = () => {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const meetings = [
    { id: 1, title: '1:1 с Александром', mentee: 'Александр Петров', time: '11:00', duration: '1 час', type: 'online', date: '2026-04-25' },
    { id: 2, title: '1:1 с Еленой', mentee: 'Елена Смирнова', time: '15:00', duration: '1 час', type: 'offline', date: '2026-04-24' }
  ];

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6366F1', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' },
    calendarGrid: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)`, marginBottom: '24px' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    calendarMonth: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    calendarNavBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '8px' },
    weekDaysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px' },
    weekDay: { textAlign: 'center', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', padding: '8px' },
    daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' },
    dayCell: { minHeight: '80px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid var(--border-light)` },
    dayNumber: { fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' },
    meetingBadge: { fontSize: '10px', padding: '2px 6px', backgroundColor: '#6366F1', borderRadius: '8px', color: 'white', marginTop: '4px', display: 'inline-block' },
    meetingsList: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)` },
    meetingItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: `1px solid var(--border-light)`, cursor: 'pointer' }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDay(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} style={styles.dayCell} />);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMeetings = meetings.filter(m => m.date === dateStr);
      days.push(
        <div key={day} style={styles.dayCell}>
          <div style={styles.dayNumber}>{day}</div>
          {dayMeetings.map(m => <div key={m.id} style={styles.meetingBadge}>{m.title}</div>)}
        </div>
      );
    }
    return days;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📅 Расписание встреч</h1>
        <button style={styles.addBtn}><Plus size={16} /> Создать встречу</button>
      </div>

      <div style={styles.calendarGrid}>
        <div style={styles.calendarHeader}>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} style={styles.calendarNavBtn}><ChevronLeft size={20} /></button>
          <span style={styles.calendarMonth}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} style={styles.calendarNavBtn}><ChevronRight size={20} /></button>
        </div>
        <div style={styles.weekDaysGrid}>{weekDays.map(day => <div key={day} style={styles.weekDay}>{day}</div>)}</div>
        <div style={styles.daysGrid}>{renderDays()}</div>
      </div>

      <div style={styles.meetingsList}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Предстоящие встречи</h3>
        {meetings.map(m => (
          <div key={m.id} style={styles.meetingItem}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.type === 'online' ? <Video size={20} /> : <MapPin size={20} />}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{m.title}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.mentee}</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{m.time}</div><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.duration}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;