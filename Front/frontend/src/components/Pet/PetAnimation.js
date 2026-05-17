import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const PetAnimation = ({ state, skin = 'default', accessories = [], size = 80, onClick, isDragging = false }) => {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState('normal');

  useEffect(() => {
    // Мигание каждые 3 секунды
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Анимация рта в зависимости от состояния
  useEffect(() => {
    switch(state) {
      case 'happy':
        setMouth('smile');
        break;
      case 'hungry':
        setMouth('sad');
        break;
      case 'sleepy':
        setMouth('zzz');
        break;
      default:
        setMouth('normal');
    }
  }, [state]);

  const getAnimation = () => {
    switch(state) {
      case 'happy':
        return {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' }
        };
      case 'hungry':
        return {
          y: [0, 2, 0],
          transition: { duration: 1.5, repeat: Infinity }
        };
      case 'sleepy':
        return {
          rotate: [0, 3, -3, 0],
          transition: { duration: 2, repeat: Infinity }
        };
      default:
        return {
          y: [0, -3, 0],
          transition: { duration: 2, repeat: Infinity }
        };
    }
  };

  const getFace = () => {
    const eyes = blink ? '—' : state === 'sleepy' ? 'zzz' : '● ●';
    const mouthIcon = mouth === 'smile' ? '◡' : mouth === 'sad' ? '◠' : mouth === 'zzz' ? 'zZz' : '–';

    return { eyes, mouth: mouthIcon };
  };

  const face = getFace();

  // Скины
  const skins = {
    default: { bg: 'linear-gradient(135deg, #F59E0B, #EF4444)', pattern: '🐕' },
    dragon: { bg: 'linear-gradient(135deg, #22C55E, #06B6D4)', pattern: '🐉' },
    unicorn: { bg: 'linear-gradient(135deg, #A855F7, #EC4899)', pattern: '🦄' },
    robot: { bg: 'linear-gradient(135deg, #64748B, #475569)', pattern: '🤖' }
  };

  const currentSkin = skins[skin] || skins.default;

  const styles = {
    container: {
      position: 'relative',
      width: size,
      height: size,
      cursor: 'pointer',
      zIndex: 1000
    },
    petBody: {
      width: '100%',
      height: '100%',
      background: currentSkin.bg,
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    petPattern: {
      position: 'absolute',
      fontSize: size * 0.4,
      opacity: 0.2,
      bottom: 5,
      right: 5
    },
    eyes: {
      fontSize: size * 0.12,
      letterSpacing: size * 0.05,
      marginBottom: size * 0.05
    },
    mouth: {
      fontSize: size * 0.14
    },
    ears: {
      position: 'absolute',
      top: -size * 0.15,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: size * 0.2
    },
    ear: {
      width: size * 0.2,
      height: size * 0.2,
      background: currentSkin.bg,
      borderRadius: '50% 50% 0 50%',
      transform: 'rotate(-45deg)'
    },
    earRight: {
      transform: 'rotate(45deg)'
    },
    accessory: {
      position: 'absolute',
      fontSize: size * 0.25,
      top: -size * 0.05,
      left: '50%',
      transform: 'translateX(-50%)'
    },
    levelBadge: {
      position: 'absolute',
      bottom: -size * 0.1,
      right: -size * 0.1,
      backgroundColor: '#F59E0B',
      color: 'white',
      borderRadius: '50%',
      width: size * 0.3,
      height: size * 0.3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.12,
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    hungerIndicator: {
      position: 'absolute',
      bottom: -size * 0.15,
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: size * 0.1
    }
  };

  return (
    <motion.div
      style={styles.container}
      animate={getAnimation()}
      onClick={onClick}
      drag={isDragging}
      dragMomentum={false}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div style={styles.petBody}>
        <div style={styles.petPattern}>{currentSkin.pattern}</div>
        <div style={styles.ears}>
          <div style={styles.ear} />
          <div style={{ ...styles.ear, ...styles.earRight }} />
        </div>
        <div style={styles.eyes}>{face.eyes}</div>
        <div style={styles.mouth}>{face.mouth}</div>
        {accessories.includes('hat') && <div style={styles.accessory}>🎩</div>}
        {accessories.includes('glasses') && <div style={{ ...styles.accessory, top: size * 0.15 }}>👓</div>}
        {accessories.includes('scarf') && <div style={{ ...styles.accessory, top: size * 0.4 }}>🧣</div>}
        <div style={styles.levelBadge}>{Math.floor(Math.random() * 5) + 1}</div>
      </div>
    </motion.div>
  );
};

export default PetAnimation;