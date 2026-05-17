import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within PetProvider');
  }
  return context;
};

// Состояния панды
const states = {
  happy: { emoji: '😊', message: 'Счастлива!', animation: 'bounce' },
  normal: { emoji: '😐', message: 'Спокойна', animation: 'idle' },
  hungry: { emoji: '😢', message: 'Голодна! Покормите меня бамбуком!', animation: 'sad' },
  thirsty: { emoji: '💧', message: 'Хочу пить!', animation: 'sad' },
  sleepy: { emoji: '😴', message: 'Устала...', animation: 'sleep' },
  playful: { emoji: '🎉', message: 'Хочет играть!', animation: 'dance' }
};

export const PetProvider = ({ children }) => {
  const { addNotification } = useNotifications();

  const [pet, setPet] = useState({
    name: 'Панда',
    gender: 'female', // 'male' или 'female'
    hunger: 100,
    thirst: 100,
    happiness: 100,
    energy: 100,
    level: 1,
    exp: 0,
    expToNext: 100,
    skin: 'default', // default, bamboo, flower, royal, rainbow
    accessories: [], // hat, glasses, scarf, bow
    furniture: [], // Мебель для домика
    roomTheme: 'forest', // forest, bamboo, flower, star
    isSleeping: false,
    lastUpdate: Date.now()
  });

  // Загрузка сохранённого состояния
  useEffect(() => {
    const saved = localStorage.getItem('pandaState');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPet(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Сохранение состояния
  useEffect(() => {
    localStorage.setItem('pandaState', JSON.stringify(pet));
  }, [pet]);

  // Автоматическое уменьшение параметров
  useEffect(() => {
    const interval = setInterval(() => {
      if (pet.isSleeping) return; // Во сне не уменьшается

      setPet(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 2),
        thirst: Math.max(0, prev.thirst - 3),
        energy: Math.max(0, prev.energy - 1)
      }));
    }, 3600000); // каждый час
    return () => clearInterval(interval);
  }, [pet.isSleeping]);

  // Проверка на низкие показатели
  useEffect(() => {
    if (pet.hunger < 20) {
      addNotification('warning', '🐼 Панда голодна! Покормите её бамбуком.');
    }
    if (pet.thirst < 20) {
      addNotification('warning', '💧 Панда хочет пить! Напоите её.');
    }
    if (pet.happiness < 30) {
      addNotification('warning', '😢 Панда грустная! Поиграйте с ней.');
    }
  }, [pet.hunger, pet.thirst, pet.happiness, addNotification]);

  const feed = () => {
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 35),
      exp: prev.exp + 20,
      happiness: Math.min(100, prev.happiness + 5)
    }));
    addNotification('success', '🐼 Панда съела бамбук! +20 опыта');
  };

  const water = () => {
    setPet(prev => ({
      ...prev,
      thirst: Math.min(100, prev.thirst + 30),
      exp: prev.exp + 15,
      happiness: Math.min(100, prev.happiness + 3)
    }));
    addNotification('success', '💧 Панда напилась! +15 опыта');
  };

  const play = () => {
    if (pet.energy < 15) {
      addNotification('warning', '😴 Панда устала! Дайте ей отдохнуть.');
      return;
    }
    setPet(prev => ({
      ...prev,
      energy: prev.energy - 15,
      happiness: Math.min(100, prev.happiness + 20),
      exp: prev.exp + 25
    }));
    addNotification('success', '🎾 Поиграли с пандой! +25 опыта');
  };

  const rest = () => {
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      happiness: Math.min(100, prev.happiness + 10),
      isSleeping: false
    }));
    addNotification('success', '😴 Панда отдохнула!');
  };

  const sleep = () => {
    setPet(prev => ({ ...prev, isSleeping: true }));
    addNotification('info', '🌙 Панда уснула. Утром она будет полна сил!');
  };

  const wakeUp = () => {
    setPet(prev => ({
      ...prev,
      isSleeping: false,
      energy: 100,
      hunger: Math.max(0, prev.hunger - 10),
      thirst: Math.max(0, prev.thirst - 10)
    }));
    addNotification('success', '🌞 Панда проснулась!');
  };

  // Обновление уровня
  useEffect(() => {
    if (pet.exp >= pet.expToNext) {
      setPet(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - prev.expToNext,
        expToNext: Math.floor(prev.expToNext * 1.2)
      }));
      addNotification('success', `🎉 Панда повысила уровень до ${pet.level + 1}!`);
    }
  }, [pet.exp, pet.expToNext, addNotification]);

  const changeName = (newName) => {
    setPet(prev => ({ ...prev, name: newName }));
    addNotification('success', `📝 Теперь панду зовут ${newName}!`);
  };

  const changeGender = (newGender) => {
    setPet(prev => ({ ...prev, gender: newGender }));
    addNotification('success', `🐼 Пол панды изменён на ${newGender === 'male' ? 'мальчика' : 'девочку'}!`);
  };

  const changeSkin = (skin) => {
    setPet(prev => ({ ...prev, skin }));
    addNotification('success', '✨ Образ панды изменён!');
  };

  const addAccessory = (accessory) => {
    if (!pet.accessories.includes(accessory)) {
      setPet(prev => ({ ...prev, accessories: [...prev.accessories, accessory] }));
      addNotification('success', `🎀 Аксессуар "${accessory}" добавлен!`);
    }
  };

  const removeAccessory = (accessory) => {
    setPet(prev => ({
      ...prev,
      accessories: prev.accessories.filter(a => a !== accessory)
    }));
    addNotification('info', `🎀 Аксессуар "${accessory}" снят.`);
  };

  const changeRoomTheme = (theme) => {
    setPet(prev => ({ ...prev, roomTheme: theme }));
    addNotification('success', '🏠 Комната панды обновлена!');
  };

  const getPetState = () => {
    if (pet.isSleeping) return 'sleepy';
    if (pet.hunger < 20 || pet.thirst < 20) return 'hungry';
    if (pet.energy < 20) return 'sleepy';
    if (pet.happiness > 80) return 'happy';
    if (pet.happiness > 50) return 'normal';
    return 'hungry';
  };

  const value = {
    pet,
    petState: getPetState(),
    petEffect: states[getPetState()] || states.normal,
    feed,
    water,
    play,
    rest,
    sleep,
    wakeUp,
    changeName,
    changeGender,
    changeSkin,
    addAccessory,
    removeAccessory,
    changeRoomTheme
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};

export default PetContext;