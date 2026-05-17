import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Gift, Star, Zap, Check, AlertCircle } from 'lucide-react';

const Shop = () => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [points, setPoints] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [purchased, setPurchased] = useState([]);

  useEffect(() => {
    const savedPoints = localStorage.getItem('activityPoints');
    setPoints(savedPoints ? parseInt(savedPoints) : 0);

    const savedInventory = localStorage.getItem('shopInventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      const defaultInventory = [
        { id: 1, name: 'Футболка Naumen', description: 'Корпоративная футболка', price: 500, icon: '👕', stock: 10 },
        { id: 2, name: 'Кружка', description: 'Керамическая кружка с логотипом', price: 200, icon: '☕', stock: 15 },
        { id: 3, name: 'Стикерпак', description: 'Набор стикеров', price: 50, icon: '🎨', stock: 50 },
        { id: 4, name: 'Блокнот', description: 'Брендированный блокнот', price: 150, icon: '📓', stock: 20 },
        { id: 5, name: 'Пауэрбанк', description: 'Зарядное устройство', price: 800, icon: '🔋', stock: 5 },
        { id: 6, name: 'Худи', description: 'Тёплый худи с логотипом', price: 1500, icon: '👔', stock: 3 }
      ];
      setInventory(defaultInventory);
      localStorage.setItem('shopInventory', JSON.stringify(defaultInventory));
    }

    const savedPurchased = localStorage.getItem('purchasedItems');
    if (savedPurchased) setPurchased(JSON.parse(savedPurchased));
  }, []);

  const purchaseItem = (item) => {
    if (points >= item.price && item.stock > 0) {
      const newPoints = points - item.price;
      setPoints(newPoints);
      localStorage.setItem('activityPoints', newPoints.toString());

      const updatedInventory = inventory.map(i => i.id === item.id ? { ...i, stock: i.stock - 1 } : i);
      setInventory(updatedInventory);
      localStorage.setItem('shopInventory', JSON.stringify(updatedInventory));

      const newPurchase = { ...item, purchasedAt: new Date().toISOString() };
      const updatedPurchased = [...purchased, newPurchase];
      setPurchased(updatedPurchased);
      localStorage.setItem('purchasedItems', JSON.stringify(updatedPurchased));

      addNotification('success', `Вы приобрели ${item.name}! Ожидайте delivery.`);
    } else if (points < item.price) {
      addNotification('error', `Недостаточно баллов! Нужно ещё ${item.price - points}`);
    } else {
      addNotification('error', 'Товар закончился!');
    }
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    pointsCard: { backgroundColor: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '20px', padding: '20px', marginBottom: '24px', textAlign: 'center' },
    pointsValue: { fontSize: '48px', fontWeight: '700', color: 'white' },
    inventoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}><ShoppingBag size={28} color="#F59E0B" /> Магазин мерча</h1>
        <p>Обменивайте баллы на крутые призы</p>
      </div>
      <div style={styles.pointsCard}>
        <div style={styles.pointsValue}>{points} баллов</div>
        <div>доступно для обмена</div>
      </div>
      <div style={styles.inventoryGrid}>
        {inventory.map(item => (
          <motion.div key={item.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-light)' }} whileHover={{ y: -2 }}>
            <div style={{ fontSize: '40px', textAlign: 'center' }}>{item.icon}</div>
            <div style={{ fontWeight: '600', marginTop: '8px' }}>{item.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.description}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ color: '#F59E0B', fontWeight: '600' }}>{item.price} баллов</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Осталось: {item.stock}</span>
            </div>
            <button onClick={() => purchaseItem(item)} disabled={points < item.price || item.stock === 0} style={{ width: '100%', marginTop: '12px', padding: '8px', backgroundColor: '#6366F1', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', opacity: (points < item.price || item.stock === 0) ? 0.5 : 1 }}>Обменять</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop;