// src/utils/storageUtils.js

// Класс для работы с хранилищем данных
class StorageManager {
  // Сохранить поиск в историю
  static saveSearch(searchData) {
    try {
      // Получаем текущую историю
      const history = this.getSearchHistory();

      // Добавляем новый поиск с временной меткой
      const newSearch = {
        ...searchData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };

      history.unshift(newSearch); // Добавляем в начало

      // Ограничиваем историю последними 50 записями
      const limitedHistory = history.slice(0, 50);

      // Сохраняем в localStorage
      localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));

      // Обновляем статистику
      this.updateStats(searchData);

      return true;
    } catch (error) {
      console.error('Error saving search:', error);
      return false;
    }
  }

  // Получить историю поиска
  static getSearchHistory() {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  // Сохранить анализ в избранное
  static saveAnalysis(analysisData) {
    try {
      const saved = this.getSavedAnalyses();

      const newAnalysis = {
        ...analysisData,
        id: Date.now(),
        savedAt: new Date().toISOString()
      };

      saved.unshift(newAnalysis);
      localStorage.setItem('savedAnalyses', JSON.stringify(saved.slice(0, 20)));

      return true;
    } catch (error) {
      console.error('Error saving analysis:', error);
      return false;
    }
  }

  // Получить сохраненные анализы
  static getSavedAnalyses() {
    try {
      const saved = localStorage.getItem('savedAnalyses');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved analyses:', error);
      return [];
    }
  }

  // Обновить статистику пользователя
  static updateStats(searchData) {
    try {
      let stats = this.getUserStats();

      // Обновляем счетчики
      stats.totalSearches += 1;
      stats.lastSearchDate = new Date().toISOString();

      // Обновляем средний балл
      if (searchData.score) {
        const currentTotal = stats.averageScore * (stats.totalSearches - 1);
        stats.averageScore = (currentTotal + searchData.score) / stats.totalSearches;
      }

      // Обновляем по типам анализа
      if (searchData.type === 'asset') {
        stats.assetAnalyses += 1;
      } else if (searchData.type === 'comparison') {
        stats.comparisonAnalyses += 1;
      }

      localStorage.setItem('userStats', JSON.stringify(stats));

      // Вызываем событие для обновления UI
      window.dispatchEvent(new Event('storageUpdate'));

      return stats;
    } catch (error) {
      console.error('Error updating stats:', error);
      return null;
    }
  }

  // Получить статистику пользователя
  static getUserStats() {
    try {
      const defaultStats = {
        totalSearches: 0,
        averageScore: 0,
        assetAnalyses: 0,
        comparisonAnalyses: 0,
        chatMessages: 0,
        lastSearchDate: null,
        favoriteAssets: []
      };

      const stats = localStorage.getItem('userStats');
      return stats ? JSON.parse(stats) : defaultStats;
    } catch (error) {
      console.error('Error loading stats:', error);
      return {
        totalSearches: 0,
        averageScore: 0,
        assetAnalyses: 0,
        comparisonAnalyses: 0,
        chatMessages: 0,
        lastSearchDate: null,
        favoriteAssets: []
      };
    }
  }

  // Обновить профиль пользователя
  static updateUserProfile(profileData) {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      window.dispatchEvent(new Event('storageUpdate'));
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  // Получить профиль пользователя
  static getUserProfile() {
    try {
      const profile = localStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  // Удалить из истории
  static removeFromHistory(id) {
    try {
      const history = this.getSearchHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem('searchHistory', JSON.stringify(filtered));

      // Обновляем статистику после удаления
      this.recalculateStats();

      window.dispatchEvent(new Event('storageUpdate'));
      return true;
    } catch (error) {
      console.error('Error removing from history:', error);
      return false;
    }
  }

  // Пересчитать статистику на основе истории
  static recalculateStats() {
    try {
      const history = this.getSearchHistory();
      const saved = this.getSavedAnalyses();

      const stats = {
        totalSearches: history.length,
        averageScore: 0,
        assetAnalyses: history.filter(item => item.type === 'asset').length,
        comparisonAnalyses: history.filter(item => item.type === 'comparison').length,
        chatMessages: 0,
        lastSearchDate: history.length > 0 ? history[0].timestamp : null,
        favoriteAssets: []
      };

      // Вычисляем средний балл
      if (history.length > 0) {
        const totalScore = history.reduce((sum, item) => sum + (item.score || 0), 0);
        stats.averageScore = totalScore / history.length;
      }

      localStorage.setItem('userStats', JSON.stringify(stats));
      return stats;
    } catch (error) {
      console.error('Error recalculating stats:', error);
      return null;
    }
  }

  // Очистить все данные
  static clearAllData() {
    try {
      localStorage.removeItem('searchHistory');
      localStorage.removeItem('savedAnalyses');
      localStorage.removeItem('userStats');
      localStorage.removeItem('userProfile');

      window.dispatchEvent(new Event('storageUpdate'));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export default StorageManager;