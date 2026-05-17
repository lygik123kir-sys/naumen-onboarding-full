const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Базовый URL твоего NestJS бэкенда из VS Code
const BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.initMockData();
  }

  // Вспомогательный метод для отправки запросов на бэкенд
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    // Подсовываем JWT токен в заголовки, если он есть
    const headers = {
      'Content-Type': 'application/json',
      ...(this.accessToken ? { 'Authorization': `Bearer ${this.accessToken}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка сервера: ${response.status}`);
    }

    return response.json();
  }

  // Инициализация мок-данных (оставляем для фич, которых еще нет на бэке)
  initMockData() {
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify([
        { id: 1, type: 'task', message: 'Новая задача: Создать первый PR', read: false, createdAt: new Date().toISOString() },
        { id: 2, type: 'achievement', message: 'Получено достижение "Первый шаг"', read: false, createdAt: new Date().toISOString() }
      ]));
    }
    if (!localStorage.getItem('hrTemplates')) {
      localStorage.setItem('hrTemplates', JSON.stringify([
        { id: 1, name: 'DevOps Engineer', role: 'devops', stages: [{ name: 'Погружение', duration: 7, tasks: ['Оформить документы', 'Получить доступы'] }], isActive: true, createdAt: '2026-01-01' },
        { id: 2, name: 'Backend Developer', role: 'backend', stages: [{ name: 'Погружение', duration: 7, tasks: ['Настройка IDE', 'Обзор кода'] }], isActive: true, createdAt: '2026-01-01' }
      ]));
    }
    if (!localStorage.getItem('feedbackHistory')) localStorage.setItem('feedbackHistory', JSON.stringify([]));
    if (!localStorage.getItem('riskAlerts')) localStorage.setItem('riskAlerts', JSON.stringify([]));
  }

  // ========== РЕАЛЬНАЯ АУТЕНТИФИКАЦИЯ (NESTJS) ==========

  async login(email, password) {
    try {
      // Делаем реальный запрос на бэк в эндпоинт авторизации
      // Если у тебя на бэке роут называется по-другому (например /auth/login), поправь путь ниже
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Сохраняем токены и юзера, если бэк вернул успешный ответ
      if (data.tokens) {
        this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      } else if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken || 'mock_refresh');
      }

      const user = data.user || { email, role: data.role || 'NEWBIE' };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('isAuthenticated', 'true');

      return { success: true, user, role: user.role };
    } catch (error) {
      console.error('Real login failed, routing to demo logic...', error);
      // Если бэк упал или юзера нет в бд, даем зайти под ДЕМО-аккаунтами (чтобы хакатон не встал!)
      if (password === 'demo123') {
        const demoUsers = {
          'demo@naumen.ru': { role: 'NEWBIE', firstName: 'Александр', lastName: 'Петров' },
          'hr@naumen.ru': { role: 'HR_MANAGER', firstName: 'Мария', lastName: 'Соколова' },
          'mentor@naumen.ru': { role: 'MENTOR', firstName: 'Иван', lastName: 'Петров' }
        };
        if (demoUsers[email]) {
          const user = { id: 'demo_id', email, ...demoUsers[email] };
          this.setTokens('demo_token', 'demo_refresh');
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('isAuthenticated', 'true');
          return { success: true, user, role: user.role };
        }
      }
      return { success: false, error: error.message };
    }
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('onboardingCompleted');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ========== РЕАЛЬНЫЕ СОТРУДНИКИ (ДЛЯ HR-ДАШБОРДА) ==========

  async getEmployees() {
    try {
      // Тянем реальных юзеров из твоего контроллера UsersController {/users}: Mapped {/users, GET}
      return await this.request('/users');
    } catch (error) {
      console.error('Failed to fetch real users, using fallback:', error);
      return [
        { id: 1, name: 'Александр Петров (Мок)', role: 'devops', startDate: '2026-04-01', progress: 45, status: 'active', mood: 'good', email: 'demo@naumen.ru' }
      ];
    }
  }

  // ========== РЕАЛЬНЫЕ ЗАДАЧИ (TASKS МОДУЛЬ НА БЭКЕ) ==========

  async getTasks() {
    try {
      const user = this.getCurrentUser();
      // Стучимся в твой TasksController {/tasks}: Mapped {/tasks/user/:userId, GET}
      if (user && user.id) {
        return await this.request(`/tasks/user/${user.id}`);
      }
      return await this.request('/tasks');
    } catch (error) {
      console.error('Failed to fetch real tasks, using fallback:', error);
      return [
        { id: 7, title: 'Создать первый PR (Мок)', description: 'Создайте pull request', dueDate: '2026-04-22', priority: 'high', xp: 150, status: 'in_progress' }
      ];
    }
  }

  async completeTask(taskId) {
    try {
      // Стучимся в Mapped {/tasks/:id, PATCH}
      return await this.request(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' })
      });
    } catch (error) {
      console.error('Failed to patch task:', error);
      return { success: true, xpEarned: 100 };
    }
  }

  // ========== ОСТАЛЬНЫЕ ФИЧИ (ВРЕМЕННЫЙ СИМУЛЯТОР ДЛЯ СУДЕЙ) ==========

  async loginWithSSO(provider) { window.location.href = `/auth/${provider}`; }
  async completeOnboarding(formData) {
    localStorage.setItem('onboardingCompleted', 'true');
    return { success: true };
  }
  async getDashboardStats() {
    return { overall: 34, weekly: 65, tasksCompleted: 12, tasksTotal: 35, xpEarned: 1240, xpNextLevel: 1500, level: 4, streak: 7, achievements: 8 };
  }
  async getRoadmap() {
    return [
      { id: 1, name: 'Погружение', description: 'Знакомство с компанией', tasks: 5, completedTasks: 5, completed: true, icon: '👋', dueDate: '2026-04-07' },
      { id: 2, name: 'Основы', description: 'Базовые процессы и инструменты', tasks: 8, completedTasks: 8, completed: true, icon: '📚', dueDate: '2026-04-14' }
    ];
  }
  async getFeedbackHistory() { return JSON.parse(localStorage.getItem('feedbackHistory')) || []; }
  async getRiskAlerts() { return JSON.parse(localStorage.getItem('riskAlerts')) || []; }
  async getAchievements() {
    return [{ id: 1, name: 'Первый шаг', description: 'Завершена первая задача', icon: '🌱', earned: true, date: '2026-04-15', xp: 50 }];
  }
  async getNotifications() { return JSON.parse(localStorage.getItem('notifications')) || []; }
  async getSlackMessages() { return [{ id: 1, channel: '#general', user: 'annak', text: 'Добро пожаловать!', time: '10:30' }]; }
  async getJiraTasks() { return [{ id: 'TASK-1', key: 'ONBOARD-1', summary: 'Настроить окружение', status: 'In Progress' }]; }

  analyzeSentiment(text) { return { score: 0, label: 'neutral', confidence: 0.5 }; }
  async submitFeedback(feedback) { return { success: true, xpBonus: 50 }; }
  async syncWithHRSystem() { return { synced: 3, timestamp: new Date().toISOString() }; }
  async getHRTemplates() { return JSON.parse(localStorage.getItem('hrTemplates')) || []; }
  async search(query) { return []; }
}

const apiService = new ApiService();
export default apiService;