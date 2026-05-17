import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import apiService from '../../services/apiService';
import { Send, Smile, Meh, Frown, AlertCircle, CheckCircle, Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const Feedback = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    mood: null,
    taskClarity: null,
    resources: null,
    comment: ''
  });
  const [history, setHistory] = useState([]);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await apiService.getFeedbackHistory();
    setHistory(data);
  };

  const moodOptions = [
    { value: 'excellent', label: 'Отлично', icon: '🤩', color: '#22C55E' },
    { value: 'good', label: 'Хорошо', icon: '😊', color: '#818CF8' },
    { value: 'okay', label: 'Нормально', icon: '😐', color: '#F59E0B' },
    { value: 'bad', label: 'Плохо', icon: '😫', color: '#EF4444' }
  ];

  const clarityOptions = [
    { value: 5, label: 'Всё предельно ясно' },
    { value: 4, label: 'Понятно, но есть вопросы' },
    { value: 3, label: 'Средне, бывает непонятно' },
    { value: 2, label: 'Часто не понимаю что делать' },
    { value: 1, label: 'Совсем не понимаю задачи' }
  ];

  const resourcesOptions = [
    { value: 5, label: 'Все доступы и ресурсы есть' },
    { value: 4, label: 'Почти всё есть' },
    { value: 3, label: 'Частично, чего-то не хватает' },
    { value: 2, label: 'Многого не хватает' },
    { value: 1, label: 'Практически ничего нет' }
  ];

  const handleSubmit = async () => {
    if (!feedback.mood || !feedback.taskClarity || !feedback.resources) {
      addNotification('error', 'Пожалуйста, ответьте на все вопросы');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiService.submitFeedback(feedback);

      if (result.success) {
        addNotification('success', `Спасибо за обратную связь! +${result.xpBonus} XP`);

        // Анализ настроения
        if (result.sentiment && result.sentiment.label === 'negative') {
          addNotification('warning', 'Заметили, что у вас трудности? Наставник готов помочь!');
          setSentimentAnalysis(result.sentiment);
        }

        // Показываем риски
        if (result.riskAlerts && result.riskAlerts.length > 0) {
          result.riskAlerts.forEach(alert => {
            addNotification('warning', alert.message);
          });
        }

        setFeedback({ mood: null, taskClarity: null, resources: null, comment: '' });
        setStep(1);
        await loadHistory();
      }
    } catch (error) {
      addNotification('error', 'Ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'excellent': return '#22C55E';
      case 'good': return '#818CF8';
      case 'okay': return '#F59E0B';
      case 'bad': return '#EF4444';
      default: return 'var(--bg-tertiary)';
    }
  };

  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😫';
      default: return '';
    }
  };

  // Календарь настроения
  const MoodCalendar = () => {
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const getMoodForDate = (date) => {
      const feedbackItem = history.find(h => {
        const hDate = new Date(h.createdAt);
        return hDate.toDateString() === date.toDateString();
      });
      return feedbackItem?.mood || null;
    };

    const renderDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        days.push(<div key={`empty-${i}`} style={styles.calendarEmpty} />);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const mood = getMoodForDate(date);
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
          <div key={day} style={styles.calendarDay}>
            <div style={{
              ...styles.calendarDayInner,
              backgroundColor: mood ? getMoodColor(mood) : 'var(--bg-tertiary)',
              border: isToday ? '2px solid #6366F1' : 'none'
            }}>
              <span style={styles.calendarDayNumber}>{day}</span>
              {mood && <span style={styles.calendarDayEmoji}>{getMoodEmoji(mood)}</span>}
            </div>
          </div>
        );
      }

      return days;
    };

    return (
      <div style={styles.calendarContainer}>
        <div style={styles.calendarHeader}>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} style={styles.calendarNavBtn}><ChevronLeft size={20} /></button>
          <span style={styles.calendarMonth}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} style={styles.calendarNavBtn}><ChevronRight size={20} /></button>
        </div>
        <div style={styles.calendarWeekDays}>
          {weekDays.map(day => <div key={day} style={styles.calendarWeekDay}>{day}</div>)}
        </div>
        <div style={styles.calendarDays}>
          {renderDays()}
        </div>
      </div>
    );
  };

  const styles = {
    container: { maxWidth: '700px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    progressBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '8px' },
    progressStep: { flex: 1, textAlign: 'center', padding: '8px', borderRadius: '12px', fontSize: '13px', fontWeight: '500', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' },
    progressStepActive: { backgroundColor: '#6366F1', color: 'white' },
    progressStepCompleted: { backgroundColor: '#22C55E', color: 'white' },
    questionCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '32px', border: `1px solid var(--border-light)`, marginBottom: '24px' },
    questionTitle: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center' },
    moodGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    moodOption: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', border: `2px solid transparent` },
    moodOptionSelected: { borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.1)' },
    moodIcon: { fontSize: '40px' },
    moodLabel: { fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
    optionItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', border: `2px solid transparent` },
    optionItemSelected: { borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.1)' },
    optionRadio: { width: '20px', height: '20px', borderRadius: '50%', border: `2px solid var(--border-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    optionRadioSelected: { borderColor: '#6366F1', backgroundColor: '#6366F1' },
    optionRadioInner: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' },
    optionLabel: { flex: 1, fontSize: '14px', color: 'var(--text-secondary)' },
    commentInput: { width: '100%', padding: '14px', backgroundColor: 'var(--bg-primary)', border: `1px solid var(--border-light)`, borderRadius: '16px', color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical', marginBottom: '24px' },
    navigation: { display: 'flex', justifyContent: 'space-between', gap: '16px' },
    prevBtn: { padding: '12px 24px', backgroundColor: 'transparent', border: `1px solid var(--border-light)`, borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    nextBtn: { flex: 1, padding: '12px 24px', backgroundColor: '#6366F1', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    nextBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    historyCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', border: `1px solid var(--border-light)`, marginTop: '24px' },
    historyTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    historyItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid var(--border-light)` },
    historyMood: { fontSize: '24px' },
    historyDate: { fontSize: '12px', color: 'var(--text-muted)' },
    calendarContainer: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: `1px solid var(--border-light)`, marginBottom: '20px' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    calendarMonth: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' },
    calendarNavBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px', borderRadius: '8px' },
    calendarWeekDays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px' },
    calendarWeekDay: { textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '8px' },
    calendarDays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' },
    calendarEmpty: { aspectRatio: '1', backgroundColor: 'transparent' },
    calendarDay: { aspectRatio: '1', cursor: 'pointer' },
    calendarDayInner: { width: '100%', height: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s', position: 'relative' },
    calendarDayNumber: { fontSize: '14px', fontWeight: '500', color: 'white' },
    calendarDayEmoji: { fontSize: '16px', position: 'absolute', top: '-8px', right: '-8px', background: 'var(--bg-secondary)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  };

  const renderQuestion = () => {
    switch(step) {
      case 1:
        return (
          <>
            <div style={styles.questionTitle}>Как ваше настроение на этой неделе?</div>
            <div style={styles.moodGrid}>
              {moodOptions.map(opt => (
                <div key={opt.value} onClick={() => setFeedback({...feedback, mood: opt.value})} style={{ ...styles.moodOption, ...(feedback.mood === opt.value && styles.moodOptionSelected) }}>
                  <span style={styles.moodIcon}>{opt.icon}</span>
                  <span style={styles.moodLabel}>{opt.label}</span>
                </div>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div style={styles.questionTitle}>Насколько понятны ваши задачи?</div>
            <div style={styles.optionsList}>
              {clarityOptions.map(opt => (
                <div key={opt.value} onClick={() => setFeedback({...feedback, taskClarity: opt.value})} style={{ ...styles.optionItem, ...(feedback.taskClarity === opt.value && styles.optionItemSelected) }}>
                  <div style={{ ...styles.optionRadio, ...(feedback.taskClarity === opt.value && styles.optionRadioSelected) }}>
                    {feedback.taskClarity === opt.value && <div style={styles.optionRadioInner} />}
                  </div>
                  <span style={styles.optionLabel}>{opt.label}</span>
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div style={styles.questionTitle}>Хватает ли вам доступов и ресурсов?</div>
            <div style={styles.optionsList}>
              {resourcesOptions.map(opt => (
                <div key={opt.value} onClick={() => setFeedback({...feedback, resources: opt.value})} style={{ ...styles.optionItem, ...(feedback.resources === opt.value && styles.optionItemSelected) }}>
                  <div style={{ ...styles.optionRadio, ...(feedback.resources === opt.value && styles.optionRadioSelected) }}>
                    {feedback.resources === opt.value && <div style={styles.optionRadioInner} />}
                  </div>
                  <span style={styles.optionLabel}>{opt.label}</span>
                </div>
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div style={styles.questionTitle}>Что хотите добавить? (необязательно)</div>
            <textarea rows={4} placeholder="Поделитесь своими мыслями, предложениями или проблемами..." value={feedback.comment} onChange={(e) => setFeedback({...feedback, comment: e.target.value})} style={styles.commentInput} />
          </>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (step === 1) return feedback.mood !== null;
    if (step === 2) return feedback.taskClarity !== null;
    if (step === 3) return feedback.resources !== null;
    return true;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💬 Pulse Check</h1>
        <p style={styles.subtitle}>Поделитесь своим настроением — это займёт всего минуту</p>
      </div>

      <div style={styles.progressBar}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ ...styles.progressStep, ...(step === i && styles.progressStepActive), ...(step > i && styles.progressStepCompleted) }}>
            Шаг {i}
          </div>
        ))}
      </div>

      <div style={styles.questionCard}>
        {renderQuestion()}

        <div style={styles.navigation}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={styles.prevBtn}>
              ← Назад
            </button>
          )}
          <button onClick={() => step === 4 ? handleSubmit() : setStep(step + 1)} disabled={!canProceed() || isSubmitting} style={{ ...styles.nextBtn, ...(!canProceed() && styles.nextBtnDisabled) }}>
            {isSubmitting ? 'Отправляем...' : (step === 4 ? 'Отправить' : 'Далее →')}
            {step === 4 && <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Календарь настроения */}
      <MoodCalendar />

      {history.length > 0 && (
        <div style={styles.historyCard}>
          <div style={styles.historyTitle}>
            <Calendar size={18} />
            <span>История опросов</span>
            <TrendingUp size={18} style={{ marginLeft: 'auto', color: '#22C55E' }} />
          </div>
          {history.map(item => (
            <div key={item.id} style={styles.historyItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={styles.historyMood}>{getMoodEmoji(item.mood)}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                </span>
                {item.sentiment && item.sentiment.label === 'negative' && (
                  <span style={{ fontSize: '11px', color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    ⚠️ Требует внимания
                  </span>
                )}
              </div>
              <span style={styles.historyDate}>
                {item.taskClarity && `Понятность: ${item.taskClarity}/5`}
              </span>
            </div>
          ))}
        </div>
      )}

      {sentimentAnalysis && sentimentAnalysis.label === 'negative' && (
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ fontSize: '13px', color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            Мы заметили, что у вас трудности. Наставник скоро свяжется с вами для поддержки.
          </p>
        </div>
      )}
    </div>
  );
};

export default Feedback;