class WebSocketService {
  constructor() {
    this.listeners = [];
    this.interval = null;
  }

  connect() {
    // Эмуляция WebSocket соединения
    this.interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.7) {
        const notifications = [
          { type: 'task', message: 'Напоминание: сегодня встреча с наставником в 15:00' },
          { type: 'achievement', message: 'Поздравляем! Вы получили +50 XP за активность' },
          { type: 'feedback', message: 'Не забудьте заполнить еженедельный Pulse Check' }
        ];
        const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
        this.notifyListeners(randomNotif);
      }
    }, 30000); // каждые 30 секунд

    return this;
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }
}

const websocketService = new WebSocketService();
export default websocketService;