import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePet } from '../../context/PetContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import PandaAnimation from '../../components/Pet/PandaAnimation';
import {
  Heart, Droplet, Battery, Star, TrendingUp, Award,
  ShoppingBag, Gamepad2, Bed, Apple, Coffee, Edit2,
  Check, X, Home, Palette, Shirt, Gift, Sparkles, Sun, Moon
} from 'lucide-react';

const PandaHouse = () => {
  const { isDark } = useTheme();
  const { pet, petState, petEffect, feed, water, play, rest, sleep, wakeUp, changeName, changeGender, changeSkin, addAccessory, removeAccessory, changeRoomTheme } = usePet();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('care');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(pet.name);

  const getStatusColor = (value) => {
    if (value > 70) return '#22C55E';
    if (value > 30) return '#F59E0B';
    return '#EF4444';
  };

  const roomThemes = [
    { id: 'forest', name: 'Лес', icon: '🌲', bg: 'linear-gradient(135deg, #1a5f2a, #0d3b1a)', color: '#22C55E' },
    { id: 'bamboo', name: 'Бамбуковая роща', icon: '🎋', bg: 'linear-gradient(135deg, #4CAF50, #2E7D32)', color: '#4CAF50' },
    { id: 'flower', name: 'Цветочный луг', icon: '🌸', bg: 'linear-gradient(135deg, #FFB6C1, #FF69B4)', color: '#EC4899' },
    { id: 'star', name: 'Звёздное небо', icon: '⭐', bg: 'linear-gradient(135deg, #1a1a4e, #0d0d2b)', color: '#818CF8' }
  ];

  const skins = [
    { id: 'default', name: 'Классическая', icon: '🐼', color: '#E2725B', price: 0 },
    { id: 'bamboo', name: 'Бамбуковая', icon: '🎋', color: '#4CAF50', price: 200 },
    { id: 'flower', name: 'Цветочная', icon: '🌸', color: '#FF69B4', price: 300 },
    { id: 'royal', name: 'Королевская', icon: '👑', color: '#9C27B0', price: 500 },
    { id: 'rainbow', name: 'Радужная', icon: '🌈', color: 'linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)', price: 800 }
  ];

  const accessories = [
    { id: 'hat', name: 'Шляпа', icon: '🎩', price: 100 },
    { id: 'glasses', name: 'Очки', icon: '👓', price: 150 },
    { id: 'scarf', name: 'Шарф', icon: '🧣', price: 200 },
    { id: 'flower', name: 'Цветок', icon: '🌸', price: 80 }
  ];

  const handleChangeSkin = (skinId) => {
    const skin = skins.find(s => s.id === skinId);
    if (skin.price > 0) {
      const points = parseInt(localStorage.getItem('activityPoints') || '0');
      if (points >= skin.price) {
        localStorage.setItem('activityPoints', (points - skin.price).toString());
        changeSkin(skinId);
        addNotification('success', `✨ Скин "${skin.name}" куплен! -${skin.price} баллов`);
      } else {
        addNotification('error', `❌ Не хватает баллов! Нужно ещё ${skin.price - points}`);
      }
    } else {
      changeSkin(skinId);
    }
  };

  const handleBuyAccessory = (accessory) => {
    if (pet.accessories.includes(accessory.id)) {
      removeAccessory(accessory.id);
      addNotification('info', `🎀 Аксессуар "${accessory.name}" снят`);
    } else {
      const points = parseInt(localStorage.getItem('activityPoints') || '0');
      if (points >= accessory.price) {
        localStorage.setItem('activityPoints', (points - accessory.price).toString());
        addAccessory(accessory.id);
        addNotification('success', `🎀 Аксессуар "${accessory.name}" куплен! -${accessory.price} баллов`);
      } else {
        addNotification('error', `❌ Не хватает баллов! Нужно ещё ${accessory.price - points}`);
      }
    }
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      changeName(newName);
      setIsEditingName(false);
    }
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', paddingBottom: '20px' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)' },
    roomCard: {
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '32px',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid var(--border-light)',
      position: 'relative',
      overflow: 'hidden'
    },
    roomBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.15,
      zIndex: 0
    },
    roomContent: {
      position: 'relative',
      zIndex: 1
    },
    petContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px'
    },
    nameSection: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    name: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: '8px'
    },
    genderBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 12px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '20px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '12px', textAlign: 'center' },
    statValue: { fontSize: '20px', fontWeight: '700', marginBottom: '4px' },
    progressBar: { height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', flexWrap: 'wrap' },
    tab: { padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { backgroundColor: '#FF6611', color: 'white' },
    actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
    actionBtn: { padding: '12px', backgroundColor: '#FF6611', border: 'none', borderRadius: '16px', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' },
    shopGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' },
    shopItem: { backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' },
    shopItemSelected: { borderColor: '#FF6611' },
    shopItemIcon: { fontSize: '32px', marginBottom: '8px' },
    shopItemName: { fontSize: '13px', fontWeight: '600', marginBottom: '4px' },
    shopItemPrice: { fontSize: '11px', color: '#F59E0B' },
    levelCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', marginBottom: '24px' },
    editInput: { padding: '8px 16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '18px', width: '200px', textAlign: 'center' }
  };

  const currentRoomTheme = roomThemes.find(t => t.id === pet.roomTheme) || roomThemes[0];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><Home size={28} color="#FF6611" /> Домик панды</h1>
        <p style={styles.subtitle}>Ухаживайте за питомцем, украшайте комнату и собирайте аксессуары</p>
      </div>

      {/* Комната с фоном - ТОЛЬКО ОДНА ПАНДА */}
      <div style={styles.roomCard}>
        <div style={{ ...styles.roomBackground, background: currentRoomTheme.bg }} />
        <div style={styles.roomContent}>
          <div style={styles.petContainer}>
            <PandaAnimation
              state={petState}
              gender={pet.gender}
              skin={pet.skin}
              accessories={pet.accessories}
              isSleeping={pet.isSleeping}
              size={160}
            />
          </div>

          <div style={styles.nameSection}>
            {isEditingName ? (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={styles.editInput} />
                <button onClick={handleSaveName} style={{ padding: '8px', backgroundColor: '#22C55E', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Check size={18} color="white" /></button>
                <button onClick={() => setIsEditingName(false)} style={{ padding: '8px', backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><X size={18} /></button>
              </div>
            ) : (
              <div>
                <div style={styles.name}>{pet.name}</div>
                <div style={styles.genderBadge} onClick={() => changeGender(pet.gender === 'female' ? 'male' : 'female')}>
                  {pet.gender === 'female' ? '🌸 Девочка' : '🐼 Мальчик'} <Edit2 size={12} />
                </div>
              </div>
            )}
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>🍖 {pet.hunger}%</div>
              <div style={styles.progressBar}><div style={{ width: `${pet.hunger}%`, height: '100%', backgroundColor: getStatusColor(pet.hunger), borderRadius: '2px' }} /></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>💧 {pet.thirst}%</div>
              <div style={styles.progressBar}><div style={{ width: `${pet.thirst}%`, height: '100%', backgroundColor: getStatusColor(pet.thirst), borderRadius: '2px' }} /></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>😊 {pet.happiness}%</div>
              <div style={styles.progressBar}><div style={{ width: `${pet.happiness}%`, height: '100%', backgroundColor: getStatusColor(pet.happiness), borderRadius: '2px' }} /></div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>⚡ {pet.energy}%</div>
              <div style={styles.progressBar}><div style={{ width: `${pet.energy}%`, height: '100%', backgroundColor: getStatusColor(pet.energy), borderRadius: '2px' }} /></div>
            </div>
          </div>

          <div style={styles.actionGrid}>
            <button onClick={feed} style={styles.actionBtn}><Apple size={16} /> Кормить</button>
            <button onClick={water} style={styles.actionBtn}><Coffee size={16} /> Поить</button>
            <button onClick={play} style={styles.actionBtn}><Gamepad2 size={16} /> Играть</button>
            {pet.isSleeping ? (
              <button onClick={wakeUp} style={{ ...styles.actionBtn, backgroundColor: '#F59E0B' }}><Sun size={16} /> Разбудить</button>
            ) : (
              <button onClick={sleep} style={{ ...styles.actionBtn, backgroundColor: '#64748B' }}><Bed size={16} /> Спать</button>
            )}
          </div>

          <div style={styles.levelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>⭐ Уровень {pet.level}</span>
              <span>{pet.exp}/{pet.expToNext} XP</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(pet.exp / pet.expToNext) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('care')} style={{ ...styles.tab, ...(activeTab === 'care' && styles.tabActive) }}><Heart size={16} /> Уход</button>
        <button onClick={() => setActiveTab('skins')} style={{ ...styles.tab, ...(activeTab === 'skins' && styles.tabActive) }}><Palette size={16} /> Образы</button>
        <button onClick={() => setActiveTab('accessories')} style={{ ...styles.tab, ...(activeTab === 'accessories' && styles.tabActive) }}><Shirt size={16} /> Аксессуары</button>
        <button onClick={() => setActiveTab('room')} style={{ ...styles.tab, ...(activeTab === 'room' && styles.tabActive) }}><Home size={16} /> Комната</button>
      </div>

      {/* Образы (скины) */}
      {activeTab === 'skins' && (
        <div style={styles.shopGrid}>
          {skins.map(skin => (
            <motion.div
              key={skin.id}
              style={{ ...styles.shopItem, ...(pet.skin === skin.id && styles.shopItemSelected) }}
              whileHover={{ y: -2 }}
              onClick={() => handleChangeSkin(skin.id)}
            >
              <div style={styles.shopItemIcon}>{skin.icon}</div>
              <div style={styles.shopItemName}>{skin.name}</div>
              {skin.price > 0 && <div style={styles.shopItemPrice}>{skin.price} баллов</div>}
              {pet.skin === skin.id && <div style={{ color: '#22C55E', fontSize: '11px', marginTop: '4px' }}>✓ Надето</div>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Аксессуары */}
      {activeTab === 'accessories' && (
        <div style={styles.shopGrid}>
          {accessories.map(acc => (
            <motion.div
              key={acc.id}
              style={{ ...styles.shopItem, ...(pet.accessories.includes(acc.id) && styles.shopItemSelected) }}
              whileHover={{ y: -2 }}
              onClick={() => handleBuyAccessory(acc)}
            >
              <div style={styles.shopItemIcon}>{acc.icon}</div>
              <div style={styles.shopItemName}>{acc.name}</div>
              <div style={styles.shopItemPrice}>{acc.price} баллов</div>
              {pet.accessories.includes(acc.id) && <div style={{ color: '#22C55E', fontSize: '11px', marginTop: '4px' }}>✓ Надето</div>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Комната */}
      {activeTab === 'room' && (
        <div style={styles.shopGrid}>
          {roomThemes.map(theme => (
            <motion.div
              key={theme.id}
              style={{ ...styles.shopItem, ...(pet.roomTheme === theme.id && styles.shopItemSelected), background: theme.bg, color: 'white' }}
              whileHover={{ y: -2 }}
              onClick={() => changeRoomTheme(theme.id)}
            >
              <div style={styles.shopItemIcon}>{theme.icon}</div>
              <div style={styles.shopItemName}>{theme.name}</div>
              {pet.roomTheme === theme.id && <div style={{ color: '#22C55E', fontSize: '11px', marginTop: '4px' }}>✓ Активна</div>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PandaHouse;