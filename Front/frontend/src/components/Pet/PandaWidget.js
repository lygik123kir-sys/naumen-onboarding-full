import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PandaAnimation from './PandaAnimation';
import { Heart, Droplet, Battery, Star, Maximize2, Moon, Sun, Apple, Coffee, Gamepad2 } from 'lucide-react';

const PandaWidget = () => {
  const navigate = useNavigate();
  const { pet, petState, feed, water, play, sleep, wakeUp } = usePet();
  const [isDragging, setIsDragging] = useState(false);

  const getStatusColor = (value) => {
    if (value > 70) return '#22C55E';
    if (value > 30) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusIcon = (value, type) => {
    if (type === 'hunger') return value > 70 ? '🍖' : value > 30 ? '🍎' : '🍂';
    if (type === 'thirst') return value > 70 ? '💧' : value > 30 ? '🥤' : '💦';
    return value > 70 ? '⭐' : value > 30 ? '🌟' : '💫';
  };

  const styles = {
    container: {
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '24px',
      border: '1px solid var(--border-light)',
      padding: '16px',
      marginBottom: '20px',
      transition: 'all 0.3s'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    petContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '12px',
      minHeight: '100px',
      position: 'relative'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginBottom: '12px'
    },
    statCard: {
      textAlign: 'center',
      padding: '8px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '12px'
    },
    statValue: {
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '2px'
    },
    statLabel: {
      fontSize: '10px',
      color: 'var(--text-muted)'
    },
    progressBar: {
      height: '3px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '4px'
    },
    progressFill: {
      height: '100%',
      transition: 'width 0.3s'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    actionBtn: {
      flex: 1,
      padding: '6px',
      backgroundColor: '#FF6611',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontSize: '11px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      transition: 'all 0.2s'
    },
    expandBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      padding: '4px'
    },
    name: {
      fontSize: '12px',
      fontWeight: '500',
      color: 'var(--text-primary)',
      textAlign: 'center',
      marginBottom: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🐼 {pet.name}</span>
          <span style={{ fontSize: '10px', color: '#F59E0B' }}>Ур. {pet.level}</span>
        </div>
        <button onClick={() => navigate('/pet')} style={styles.expandBtn}>
          <Maximize2 size={14} />
        </button>
      </div>

      <div style={styles.petContainer}>
        <PandaAnimation
          state={petState}
          gender={pet.gender}
          skin={pet.skin}
          accessories={pet.accessories}
          isSleeping={pet.isSleeping}
          size={80}
          isDragging={isDragging}
        />
      </div>

      <div style={styles.name}>{pet.name} {pet.gender === 'female' ? '🌸' : '🐼'}</div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{getStatusIcon(pet.hunger, 'hunger')} {pet.hunger}%</div>
          <div style={styles.statLabel}>Сытость</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${pet.hunger}%`, backgroundColor: getStatusColor(pet.hunger) }} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{getStatusIcon(pet.thirst, 'thirst')} {pet.thirst}%</div>
          <div style={styles.statLabel}>Жажда</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${pet.thirst}%`, backgroundColor: getStatusColor(pet.thirst) }} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>😊 {pet.happiness}%</div>
          <div style={styles.statLabel}>Настроение</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${pet.happiness}%`, backgroundColor: getStatusColor(pet.happiness) }} />
          </div>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button onClick={feed} style={styles.actionBtn}><Apple size={12} /> Кормить</button>
        <button onClick={water} style={styles.actionBtn}><Coffee size={12} /> Поить</button>
        <button onClick={play} style={styles.actionBtn}><Gamepad2 size={12} /> Играть</button>
        {pet.isSleeping ? (
          <button onClick={wakeUp} style={{ ...styles.actionBtn, backgroundColor: '#F59E0B' }}><Sun size={12} /> Будить</button>
        ) : (
          <button onClick={sleep} style={{ ...styles.actionBtn, backgroundColor: '#64748B' }}><Moon size={12} /> Спать</button>
        )}
      </div>
    </div>
  );
};

export default PandaWidget;