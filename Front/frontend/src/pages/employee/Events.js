import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Gift, Star, ChevronLeft, ChevronRight, Bell, CheckCircle } from 'lucide-react';

const Events = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    loadRegistered();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('companyEvents');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      const defaultEvents = [
        { id: 1, title: 'Welcome-кофе с командой', description: 'Знакомство с коллегами в неформальной обстановке', date: '2026-05-20', time: '11:00', location: 'Офис, переговорная 507', type: 'social', maxParticipants: 20, registered: 12, points: 50, image: '☕' },
        { id: 2, title: 'Tech Talk: Микросервисы', description: 'Лекция от Senior Architect', date: '2026-05-25', time: '15:00', location: 'Online (Zoom)', type: 'learning', maxParticipants: 50, registered: 28, points: 100, image: '💻' },
        { id: 3, title: 'День рождения компании', description: 'Празднование основания Naumen', date: '2026-06-01', time: '18:00', location: 'Ресторан', type: 'party', maxParticipants: 100, registered: 45, points: 150, image: '🎂' }
      ];
      setEvents(defaultEvents);
      localStorage.setItem('companyEvents', JSON.stringify(defaultEvents));
    }
  };

  const loadRegistered = () => {
    const saved = localStorage.getItem('registeredEvents');
    setRegisteredEvents(saved ? JSON.parse(saved) : []);
  };

  const registerForEvent = (event) => {
    if (registeredEvents.includes(event.id)) {
      addNotification('warning', 'Вы уже зарегистрированы на это событие');
      return;
    }
    if (event.registered >= event.maxParticipants) {
      addNotification('error', 'Мест нет!');
      return;
    }

    const updated = [...registeredEvents, event.id];
    setRegisteredEvents(updated);
    localStorage.setItem('registeredEvents', JSON.stringify(updated));

    const updatedEvents = events.map(e => e.id === event.id ? { ...e, registered: e.registered + 1 } : e);
    setEvents(updatedEvents);
    localStorage.setItem('companyEvents', JSON.stringify(updatedEvents));

    // Начисляем баллы за регистрацию
    const currentPoints = localStorage.getItem('activityPoints');
    const newPoints = (currentPoints ? parseInt(currentPoints) : 0) + event.points;
    localStorage.setItem('activityPoints', newPoints.toString());

    addNotification('success', `Вы зарегистрированы на "${event.title}"! +${event.points} баллов`);
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    calendarCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', marginBottom: '24px', border: '1px solid var(--border-light)' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    calendarMonth: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
    calendarNavBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '8px' },
    weekDaysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px' },
    weekDay: { textAlign: 'center', fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', padding: '8px' },
    daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' },
    dayCell: { minHeight: '80px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', padding: '8px', cursor: 'pointer', border: '1px solid var(--border-light)' },
    dayNumber: { fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' },
    eventBadge: { fontSize: '10px', padding: '2px 6px', backgroundColor: '#6366F1', borderRadius: '8px', color: 'white', marginTop: '4px', display: 'block' },
    eventsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    eventCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', cursor: 'pointer' },
    eventType: { fontSize: '11px', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Calendar size={28} color="#818CF8" /> Календарь событий</h1>
        <p>Корпоративные мероприятия, встречи и праздники</p>
      </div>

      <div style={styles.calendarCard}>
        <div style={styles.calendarHeader}>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} style={styles.calendarNavBtn}><ChevronLeft size={20} /></button>
          <span style={styles.calendarMonth}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} style={styles.calendarNavBtn}><ChevronRight size={20} /></button>
        </div>
        <div style={styles.weekDaysGrid}>{weekDays.map(day => <div key={day} style={styles.weekDay}>{day}</div>)}</div>
        <div style={styles.daysGrid}>
          {getMonthDays().map((date, idx) => {
            const dayEvents = date ? getEventsForDate(date) : [];
            return (
              <div key={idx} style={styles.dayCell} onClick={() => date && dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}>
                <div style={styles.dayNumber}>{date ? date.getDate() : ''}</div>
                {dayEvents.slice(0, 2).map(e => <div key={e.id} style={styles.eventBadge}>{e.title}</div>)}
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.eventsList}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Предстоящие события</h3>
        {events.filter(e => new Date(e.date) >= new Date()).slice(0, 5).map(event => (
          <motion.div key={event.id} style={styles.eventCard} whileHover={{ y: -2 }} onClick={() => setSelectedEvent(event)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><span style={{ ...styles.eventType, backgroundColor: 'rgba(99,102,241,0.1)', color: '#818CF8' }}>{event.type === 'social' ? '🎉 Социальное' : event.type === 'learning' ? '📚 Обучение' : '🎂 Праздник'}</span></div>
              <span style={{ fontSize: '12px', color: '#F59E0B' }}>+{event.points} баллов</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginTop: '8px' }}>{event.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>{event.description}</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span><Calendar size={12} /> {event.date}</span>
              <span><Clock size={12} /> {event.time}</span>
              <span><MapPin size={12} /> {event.location}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>👥 {event.registered}/{event.maxParticipants} участников</span>
              {registeredEvents.includes(event.id) ? (
                <span style={{ color: '#22C55E', fontSize: '12px' }}><CheckCircle size={14} /> Вы зарегистрированы</span>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); registerForEvent(event); }} style={{ padding: '6px 16px', backgroundColor: '#6366F1', border: 'none', borderRadius: '20px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Зарегистрироваться</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Events;