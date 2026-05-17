import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { PetProvider } from './context/PetContext';
import './App.css';

// Employee Pages
import Dashboard from './pages/employee/Dashboard';
import Welcome from './pages/employee/Welcome';
import Profile from './pages/employee/Profile';
import Roadmap from './pages/employee/Roadmap';
import Directory from './pages/employee/Directory';
import Feedback from './pages/employee/Feedback';
import ChatAssistant from './pages/employee/ChatAssistant';
import Achievements from './pages/employee/Achievements';
import Glossary from './pages/employee/Glossary';
import KnowledgeBase from './pages/employee/KnowledgeBase';
import DailyTasks from './pages/employee/DailyTasks';
import Shop from './pages/employee/Shop';
import Contests from './pages/employee/Contests';
import Events from './pages/employee/Events';
import Polls from './pages/employee/Polls';
import Leaderboard from './pages/employee/Leaderboard';
import PandaHouse from './pages/employee/PandaHouse';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import HRLayout from './pages/hr/HRLayout';
import Templates from './pages/hr/Templates';
import Analytics from './pages/hr/Analytics';
import Employees from './pages/hr/Employees';
import HRPanel from './pages/hr/HRPanel';
import AchievementsManager from './pages/hr/AchievementsManager';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorLayout from './pages/mentor/MentorLayout';
import Mentees from './pages/mentor/Mentees';
import TasksForMentees from './pages/mentor/TasksForMentees';
import ScheduleMeeting from './pages/mentor/ScheduleMeeting';
import UpdateProgress from './pages/mentor/UpdateProgress';

// Auth Components
import Login from './components/Auth/Login';
import InviteAccept from './components/Auth/InviteAccept';

// Layout Components
import EmployeeLayout from './components/Layout/EmployeeLayout';

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 30;
        const newProgress = Math.min(prev + increment, 90);
        if (newProgress >= 90) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500);
        }
        return newProgress;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loading-progress">
      <div className="loading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const PageTransition = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: '100%', height: '100%' }}>
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: 'white' }}>Загрузка...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'SUPER_ADMIN') {
    if (user?.role === 'NEWBIE') return <Navigate to="/dashboard" replace />;
    if (user?.role === 'MENTOR') return <Navigate to="/mentor/dashboard" replace />;
    if (user?.role === 'HR_MANAGER' || user?.role === 'HR_SPECIALIST') return <Navigate to="/hr/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, user, hasCompletedOnboarding } = useAuth();

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/invite/:token" element={<PageTransition><InviteAccept /></PageTransition>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  // HR Routes
  if (user?.role === 'HR_MANAGER' || user?.role === 'HR_SPECIALIST') {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/hr/dashboard" replace />} />
          <Route path="/hr/dashboard" element={<ProtectedRoute requiredRole="HR_MANAGER"><HRLayout><PageTransition><HRDashboard /></PageTransition></HRLayout></ProtectedRoute>} />
          <Route path="/hr/templates" element={<ProtectedRoute requiredRole="HR_MANAGER"><HRLayout><PageTransition><Templates /></PageTransition></HRLayout></ProtectedRoute>} />
          <Route path="/hr/analytics" element={<ProtectedRoute requiredRole="HR_MANAGER"><HRLayout><PageTransition><Analytics /></PageTransition></HRLayout></ProtectedRoute>} />
          <Route path="/hr/employees" element={<ProtectedRoute requiredRole="HR_MANAGER"><HRLayout><PageTransition><Employees /></PageTransition></HRLayout></ProtectedRoute>} />
          <Route path="/hr/panel" element={<ProtectedRoute requiredRole="HR_MANAGER"><HRLayout><PageTransition><HRPanel /></PageTransition></HRLayout></ProtectedRoute>} />
          <Route path="/hr/achievements" element={<ProtectedRoute requiredRole="HR_MANAGER"><HRLayout><PageTransition><AchievementsManager /></PageTransition></HRLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  // Mentor Routes
  if (user?.role === 'MENTOR') {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/mentor/dashboard" replace />} />
          <Route path="/mentor/dashboard" element={<ProtectedRoute requiredRole="MENTOR"><MentorLayout><PageTransition><MentorDashboard /></PageTransition></MentorLayout></ProtectedRoute>} />
          <Route path="/mentor/mentees" element={<ProtectedRoute requiredRole="MENTOR"><MentorLayout><PageTransition><Mentees /></PageTransition></MentorLayout></ProtectedRoute>} />
          <Route path="/mentor/tasks" element={<ProtectedRoute requiredRole="MENTOR"><MentorLayout><PageTransition><TasksForMentees /></PageTransition></MentorLayout></ProtectedRoute>} />
          <Route path="/mentor/schedule" element={<ProtectedRoute requiredRole="MENTOR"><MentorLayout><PageTransition><ScheduleMeeting /></PageTransition></MentorLayout></ProtectedRoute>} />
          <Route path="/mentor/meeting" element={<ProtectedRoute requiredRole="MENTOR"><MentorLayout><PageTransition><ScheduleMeeting /></PageTransition></MentorLayout></ProtectedRoute>} />
          <Route path="/mentor/progress" element={<ProtectedRoute requiredRole="MENTOR"><MentorLayout><PageTransition><UpdateProgress /></PageTransition></MentorLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/mentor/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  // Employee Routes
  if (!hasCompletedOnboarding) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/welcome" element={<ProtectedRoute><EmployeeLayout><PageTransition><Welcome /></PageTransition></EmployeeLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><EmployeeLayout><PageTransition><Dashboard /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><EmployeeLayout><PageTransition><Roadmap /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute><EmployeeLayout><PageTransition><Directory /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><EmployeeLayout><PageTransition><Feedback /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><EmployeeLayout><PageTransition><ChatAssistant /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><EmployeeLayout><PageTransition><Achievements /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/glossary" element={<ProtectedRoute><EmployeeLayout><PageTransition><Glossary /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/knowledge" element={<ProtectedRoute><EmployeeLayout><PageTransition><KnowledgeBase /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/daily-tasks" element={<ProtectedRoute><EmployeeLayout><PageTransition><DailyTasks /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><EmployeeLayout><PageTransition><Shop /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/contests" element={<ProtectedRoute><EmployeeLayout><PageTransition><Contests /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EmployeeLayout><PageTransition><Events /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/polls" element={<ProtectedRoute><EmployeeLayout><PageTransition><Polls /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><EmployeeLayout><PageTransition><Leaderboard /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/pet" element={<ProtectedRoute><EmployeeLayout><PageTransition><PandaHouse /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><EmployeeLayout><PageTransition><Profile /></PageTransition></EmployeeLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PetProvider>
          <Router>
            <div className="App">
              <LoadingProgress />
              <AnimatedRoutes />
            </div>
          </Router>
        </PetProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;