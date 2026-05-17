import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PandaAnimation = ({ state, gender = 'female', skin = 'default', accessories = [], size = 100, onClick, isDragging = false, isSleeping = false }) => {
  const [blink, setBlink] = useState(false);
  const [tailWag, setTailWag] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const wagInterval = setInterval(() => {
      setTailWag(prev => !prev);
    }, 2000);
    return () => clearInterval(wagInterval);
  }, []);

  const getAnimation = () => {
    if (isSleeping) {
      return {
        y: [0, 2, 0],
        rotate: [0, 2, -2, 0],
        transition: { duration: 3, repeat: Infinity }
      };
    }
    switch(state) {
      case 'happy':
        return {
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.6, repeat: Infinity, repeatType: 'reverse' }
        };
      case 'hungry':
        return {
          y: [0, 3, 0],
          transition: { duration: 1.5, repeat: Infinity }
        };
      default:
        return {
          y: [0, -4, 0],
          transition: { duration: 2, repeat: Infinity }
        };
    }
  };

  const getFace = () => {
    const eyes = blink ? '—' : isSleeping ? '—' : '● ●';
    const mouth = isSleeping ? 'zZz' : state === 'happy' ? '◡' : state === 'hungry' ? '◠' : '–';
    return { eyes, mouth };
  };

  const face = getFace();
  const isFemale = gender === 'female';

  // Скины панды
  const skins = {
    default: { body: '#E2725B', belly: '#F5D5B5', spots: '#8B4513' },
    bamboo: { body: '#4CAF50', belly: '#A5D6A7', spots: '#2E7D32' },
    flower: { body: '#FFB6C1', belly: '#FFE4E1', spots: '#FF69B4' },
    royal: { body: '#9C27B0', belly: '#E1BEE7', spots: '#6A1B9A' },
    rainbow: { body: 'linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)', belly: '#FFF', spots: '#FFF' }
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
    pandaBody: {
      width: '100%',
      height: '100%',
      background: currentSkin.body,
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    belly: {
      position: 'absolute',
      width: '60%',
      height: '55%',
      backgroundColor: currentSkin.belly,
      borderRadius: '50%',
      bottom: '10%',
      left: '20%'
    },
    ear: {
      position: 'absolute',
      width: '25%',
      height: '25%',
      backgroundColor: currentSkin.body,
      borderRadius: '50%',
      top: '-5%'
    },
    earLeft: { left: '10%' },
    earRight: { right: '10%' },
    earInner: {
      position: 'absolute',
      width: '50%',
      height: '50%',
      backgroundColor: '#F5D5B5',
      borderRadius: '50%',
      top: '20%',
      left: '25%'
    },
    eyeSpot: {
      position: 'absolute',
      width: '30%',
      height: '25%',
      backgroundColor: '#333',
      borderRadius: '50%',
      top: '30%'
    },
    eyeSpotLeft: { left: '20%' },
    eyeSpotRight: { right: '20%' },
    eyeWhite: {
      position: 'absolute',
      width: '60%',
      height: '60%',
      backgroundColor: 'white',
      borderRadius: '50%',
      top: '20%',
      left: '20%'
    },
    eyePupil: {
      position: 'absolute',
      width: '40%',
      height: '40%',
      backgroundColor: '#1a1a1a',
      borderRadius: '50%',
      top: '25%',
      left: '30%'
    },
    eyeHighlight: {
      position: 'absolute',
      width: '20%',
      height: '20%',
      backgroundColor: 'white',
      borderRadius: '50%',
      top: '15%',
      left: '25%'
    },
    nose: {
      position: 'absolute',
      width: '15%',
      height: '12%',
      backgroundColor: '#333',
      borderRadius: '50%',
      bottom: '25%',
      left: '42.5%'
    },
    mouth: {
      position: 'absolute',
      fontSize: size * 0.12,
      bottom: '15%',
      left: '45%',
      color: '#333'
    },
    blush: {
      position: 'absolute',
      width: '15%',
      height: '12%',
      backgroundColor: '#FF9999',
      borderRadius: '50%',
      bottom: '28%',
      opacity: 0.6
    },
    blushLeft: { left: '10%' },
    blushRight: { right: '10%' },
    bow: {
      position: 'absolute',
      fontSize: size * 0.2,
      top: '-8%',
      left: '40%'
    },
    flower: {
      position: 'absolute',
      fontSize: size * 0.18,
      top: '-5%',
      left: '42%'
    },
    levelBadge: {
      position: 'absolute',
      bottom: '-5%',
      right: '-5%',
      backgroundColor: '#F59E0B',
      color: 'white',
      borderRadius: '50%',
      width: size * 0.28,
      height: size * 0.28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.12,
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 2
    },
    tail: {
      position: 'absolute',
      bottom: '-10%',
      right: '-10%',
      width: '25%',
      height: '20%',
      backgroundColor: currentSkin.body,
      borderRadius: '50%',
      transformOrigin: 'center',
      transform: tailWag ? 'rotate(15deg)' : 'rotate(-15deg)',
      transition: 'transform 0.2s ease'
    },
    zzz: {
      position: 'absolute',
      fontSize: size * 0.12,
      top: '-15%',
      right: '-10%',
      animation: 'float 1.5s infinite'
    },
    accessoryHat: {
      position: 'absolute',
      fontSize: size * 0.22,
      top: '-12%',
      left: '35%',
      zIndex: 3
    },
    accessoryGlasses: {
      position: 'absolute',
      fontSize: size * 0.2,
      top: '25%',
      left: '33%',
      zIndex: 3
    },
    accessoryScarf: {
      position: 'absolute',
      fontSize: size * 0.18,
      bottom: '35%',
      left: '38%',
      zIndex: 3
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
      <div style={styles.pandaBody}>
        {/* Хвост */}
        <div style={styles.tail} />

        {/* Уши */}
        <div style={{ ...styles.ear, ...styles.earLeft }}>
          <div style={styles.earInner} />
        </div>
        <div style={{ ...styles.ear, ...styles.earRight }}>
          <div style={styles.earInner} />
        </div>

        {/* Живот */}
        <div style={styles.belly} />

        {/* Глазные пятна */}
        <div style={{ ...styles.eyeSpot, ...styles.eyeSpotLeft }}>
          <div style={styles.eyeWhite}>
            <div style={styles.eyePupil}>
              <div style={styles.eyeHighlight} />
            </div>
          </div>
        </div>
        <div style={{ ...styles.eyeSpot, ...styles.eyeSpotRight }}>
          <div style={styles.eyeWhite}>
            <div style={styles.eyePupil}>
              <div style={styles.eyeHighlight} />
            </div>
          </div>
        </div>

        {/* Нос */}
        <div style={styles.nose} />

        {/* Рот */}
        <div style={styles.mouth}>{face.mouth}</div>

        {/* Румянец (только для девочек) */}
        {isFemale && (
          <>
            <div style={{ ...styles.blush, ...styles.blushLeft }} />
            <div style={{ ...styles.blush, ...styles.blushRight }} />
          </>
        )}

        {/* Бантик (для девочек) */}
        {isFemale && !accessories.includes('hat') && (
          <div style={styles.bow}>🎀</div>
        )}

        {/* Цветок (опционально) */}
        {accessories.includes('flower') && (
          <div style={styles.flower}>🌸</div>
        )}

        {/* Уровень */}
        <div style={styles.levelBadge}>
          {Math.floor(Math.random() * 5) + 1}
        </div>

        {/* Аксессуары */}
        {accessories.includes('hat') && <div style={styles.accessoryHat}>🎩</div>}
        {accessories.includes('glasses') && <div style={styles.accessoryGlasses}>👓</div>}
        {accessories.includes('scarf') && <div style={styles.accessoryScarf}>🧣</div>}

        {/* Zzz при сне */}
        {isSleeping && <div style={styles.zzz}>💤</div>}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
};

export default PandaAnimation;