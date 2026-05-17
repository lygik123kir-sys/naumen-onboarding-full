import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Send, Bot, User, Sparkles, HelpCircle, BookOpen, Calendar, Key, Wifi, MessageCircle } from 'lucide-react';

const ChatAssistant = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Привет! Я AI-ассистент Naumen.Onboard. Чем могу помочь? Задавайте любые вопросы по адаптации, процессам или документации. 😊' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // База знаний для AI
  const knowledgeBase = {
    'отпуск': 'Чтобы оформить отпуск, необходимо:\n1. Согласовать даты с руководителем\n2. Заполнить заявление в системе HR\n3. Дождаться утверждения\n📞 По вопросам обращайтесь к HR-менеджеру Марии Соколовой',
    'пропуск': 'Для заказа пропуска:\n1. Заполните заявку в портале "Пропуска"\n2. Приложите фото 3x4\n3. Пропуск готов через 3 рабочих дня\n📍 Получить можно в бюро пропусков (1 этаж)',
    'регламент': 'Все регламенты и документация доступны в корпоративной вики:\n📚 docs.naumen.ru/internal\n🔑 Доступ по корпоративной учётной записи',
    'больничный': 'При заболевании необходимо:\n1. Сообщить руководителю\n2. Оформить электронный больничный\n3. Загрузить номер в HR-систему\n💊 Также обратитесь в ДМС по телефону +7 (495) 123-45-67',
    'обучение': 'Курсы и тренинги:\n🎓 Внутренний университет Naumen\n📚 Корпоративная библиотека\n💻 Платформа SkillBox\n🚀 Согласуйте план обучения с наставником',
    'доступы': 'Для получения доступов:\n1. Согласуйте с руководителем\n2. Оставьте заявку в Jira (проект IT)\n3. Дождитесь подтверждения\n⏱️ Обычно занимает 1-2 дня',
    'интернет': 'Доступ в интернет:\n🌐 Wi-Fi: Naumen_Guest (пароль у администратора)\n🔒 Корпоративная сеть через VPN (инструкция в вики)\n📡 Роуминг согласуйте с IT-отделом',
    'зарплата': 'Вопросы по зарплате:\n💰 Аванс: 25 числа\n💵 Основная выплата: 10 числа\n📊 Расчётный лист в личном кабинете\n📞 Бухгалтерия: доб. 1234',
    'наставник': 'Ваш наставник — Иван Петров (Senior DevOps)\n📧 i.petrov@naumen.ru\n💬 Чат в Teams\n📅 Встречи: каждый вторник в 11:00',
    'привет': 'Привет! 👋 Рад вас видеть! Задавайте любые вопросы о компании, процессах или адаптации.',
    'спасибо': 'Всегда рад помочь! Если появятся ещё вопросы — обращайтесь. 😊'
  };

  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    // Поиск по ключевым словам
    for (const [keyword, answer] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(keyword)) {
        return answer;
      }
    }

    // Ответ по умолчанию
    return `Я пока не могу ответить на этот вопрос. Попробуйте уточнить или обратитесь к наставнику.

💡 Вот что я умею:
• Как оформить отпуск/больничный?
• Как заказать пропуск?
• Где найти регламенты?
• Как получить доступы?
• Информация о зарплате
• Контакты наставника
• Обучение и курсы`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Имитация задержки ответа AI
    setTimeout(() => {
      const response = getAIResponse(input);
      const aiMessage = { id: Date.now() + 1, role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    { icon: <Calendar size={14} />, text: 'Как оформить отпуск?' },
    { icon: <Key size={14} />, text: 'Как получить доступы?' },
    { icon: <BookOpen size={14} />, text: 'Где найти регламенты?' },
    { icon: <HelpCircle size={14} />, text: 'Кто мой наставник?' }
  ];

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' },
    header: { marginBottom: '20px' },
    title: { fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    quickQuestions: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
    quickBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--border-light)`, borderRadius: '20px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' },
    chatContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', border: `1px solid var(--border-light)`, marginBottom: '16px', minHeight: '400px' },
    message: { display: 'flex', gap: '12px', maxWidth: '85%' },
    userMessage: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    assistantMessage: { alignSelf: 'flex-start' },
    avatar: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    userAvatar: { backgroundColor: '#6366F1' },
    assistantAvatar: { background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
    messageContent: { padding: '12px 16px', borderRadius: '16px', fontSize: '14px', lineHeight: 1.5 },
    userContent: { backgroundColor: '#6366F1', color: 'white', borderBottomRightRadius: '4px' },
    assistantContent: { backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', borderBottomLeftRadius: '4px', border: `1px solid var(--border-light)` },
    typingIndicator: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: `1px solid var(--border-light)`, width: 'fit-content' },
    typingDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#818CF8', animation: 'typing 1.4s infinite' },
    inputContainer: { display: 'flex', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', border: `1px solid var(--border-light)` },
    input: { flex: 1, padding: '12px 16px', backgroundColor: 'var(--bg-primary)', border: 'none', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none' },
    sendBtn: { width: '44px', height: '44px', backgroundColor: '#6366F1', border: 'none', borderRadius: '16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Sparkles size={24} color="#F59E0B" />
          AI-ассистент
        </h1>
        <p style={styles.subtitle}>Задайте вопрос — я помогу найти ответ</p>
      </div>

      <div style={styles.quickQuestions}>
        {quickQuestions.map((q, i) => (
          <button key={i} style={styles.quickBtn} onClick={() => setInput(q.text)}>
            {q.icon}
            {q.text}
          </button>
        ))}
      </div>

      <div style={styles.chatContainer}>
        {messages.map(msg => (
          <div key={msg.id} style={{ ...styles.message, ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage) }}>
            <div style={{ ...styles.avatar, ...(msg.role === 'user' ? styles.userAvatar : styles.assistantAvatar) }}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div style={{ ...styles.messageContent, ...(msg.role === 'user' ? styles.userContent : styles.assistantContent) }}>
              {msg.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={styles.typingIndicator}>
            <div style={styles.typingDot} />
            <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
            <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea rows={1} placeholder="Напишите ваш вопрос..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} style={styles.input} />
        <button onClick={handleSend} style={styles.sendBtn}>
          <Send size={18} />
        </button>
      </div>

      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatAssistant;