import React, { useState, useRef } from 'react';
import { usePet } from '../../context/PetContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PetAnimation from './PetAnimation';
import { Heart, Droplet, Battery, Star, TrendingUp, Maximize2 } from 'lucide-react';

const PetWidget = ({ isExpanded = false, onExpand }) => {
  const navigate = useNavigate();
  const { pet, petState, petEffect, feed, water, play, rest } = usePet();
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

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
      position: 'relative',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '24px',
      border: '1px solid var(--border-light)',
      padding: isExpanded ? '20px' : '16px',
      marginBottom: '20px',
      transition: 'all 0.3s'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    petContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '16px'
    },
    statCard: {
      textAlign: 'center',
      padding: '10px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '16px'
    },
    statValue: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '11px',
      color: 'var(--text-muted)'
    },
    progressBar: {
      height: '6px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '3px',
      overflow: 'hidden',
      marginTop: '8px'
    },
    progressFill: {
      height: '100%',
      transition: 'width 0.3s'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px'
    },
    actionBtn: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#6366F1',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      transition: 'all 0.2s'
    },
    expandBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      padding: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🐾 Naumen Pet</span>
          <span style={{ fontSize: '12px', color: '#F59E0B' }}>Уровень {pet.level}</span>
        </div>
        <button onClick={onExpand} style={styles.expandBtn}>
          <Maximize2 size={16} />
        </button>
      </div>

      <div ref={constraintsRef} style={{ position: 'relative', minHeight: '120px' }}>
        <motion.div
          drag={isDragging}
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
          style={{ position: 'absolute', left: pet.position.x || '50%', transform: 'translateX(-50%)', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <PetAnimation
            state={petState}
            skin={pet.skin}
            accessories={pet.accessories}
            size={isExpanded ? 100 : 80}
            isDragging={isDragging}
          />
        </motion.div>
      </div>

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
          <div style={styles.statValue}>{petEffect.emoji} {pet.happiness}%</div>
          <div style={styles.statLabel}>Настроение</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${pet.happiness}%`, backgroundColor: getStatusColor(pet.happiness) }} />
          </div>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button onClick={() => feed()} style={styles.actionBtn}>🍖 Кормить</button>
        <button onClick={() => water()} style={styles.actionBtn}>💧 Поить</button>
        <button onClick={() => play()} style={styles.actionBtn}>🎾 Играть</button>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
        {petEffect.message}
      </div>
    </div>
  );
};

export default PetWidget;