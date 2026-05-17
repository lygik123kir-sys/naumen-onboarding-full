// Сервис для синхронизации прогресса новичков

const PROGRESS_STORAGE_KEY = 'onboardingProgress';
const MENTOR_TASKS_KEY = 'mentorTasks';
const EMPLOYEES_KEY = 'employees';

class ProgressSyncService {
  // Обновление прогресса сотрудника
  static updateEmployeeProgress(employeeId, newProgress) {
    // Обновляем прогресс в employees
    const employees = JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, progress: newProgress, updatedAt: new Date().toISOString() } : emp
    );
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updatedEmployees));

    // Обновляем прогресс в onboardingProgress
    const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)) || {};
    const updatedProgress = { ...progress, overall: newProgress, updatedAt: new Date().toISOString() };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress));

    return updatedProgress;
  }

  // Получение прогресса сотрудника
  static getEmployeeProgress(employeeId) {
    const employees = JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.progress || 0;
  }

  // Синхронизация задач ментора с прогрессом
  static syncMentorTasksProgress(employeeId) {
    const tasks = JSON.parse(localStorage.getItem(MENTOR_TASKS_KEY)) || [];
    const completedTasks = tasks.filter(t => t.assignedToId === employeeId && t.status === 'completed');
    const completedCount = completedTasks.length;
    const baseProgress = Math.min(completedCount * 5, 100); // 5% за каждую задачу, максимум 100%

    this.updateEmployeeProgress(employeeId, baseProgress);
    return baseProgress;
  }

  // Получение всех сотрудников с прогрессом
  static getAllEmployeesWithProgress() {
    const employees = JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
    const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)) || {};

    return employees.map(emp => ({
      ...emp,
      progress: emp.progress || 0,
      overallProgress: progress.overall || 0
    }));
  }

  // Сброс прогресса (для тестирования)
  static resetProgress(employeeId) {
    this.updateEmployeeProgress(employeeId, 0);
  }
}

export default ProgressSyncService;