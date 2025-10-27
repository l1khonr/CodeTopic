'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'chat' | 'games' | 'easter-eggs' | 'social' | 'expert';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-message',
    title: 'Hello World',
    description: 'Send your first message',
    icon: '👋',
    unlocked: false,
    category: 'chat',
  },
  {
    id: 'chat-master',
    title: 'Chat Master',
    description: 'Send 100 messages',
    icon: '💬',
    unlocked: false,
    category: 'chat',
  },
  {
    id: 'quiz-novice',
    title: 'Quiz Novice',
    description: 'Complete your first code quiz',
    icon: '🎓',
    unlocked: false,
    category: 'games',
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Get perfect score on code quiz',
    icon: '🏆',
    unlocked: false,
    category: 'games',
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Type 80+ WPM in typing game',
    icon: '⚡',
    unlocked: false,
    category: 'games',
  },
  {
    id: 'konami-code',
    title: 'Secret Keeper',
    description: 'Discover the Konami code',
    icon: '🎮',
    unlocked: false,
    category: 'easter-eggs',
  },
  {
    id: 'dev-mode',
    title: 'Developer',
    description: 'Activate developer mode',
    icon: '👨‍💻',
    unlocked: false,
    category: 'easter-eggs',
  },
  {
    id: 'matrix-mode',
    title: 'Neo',
    description: 'Enter the Matrix',
    icon: '🕶️',
    unlocked: false,
    category: 'easter-eggs',
  },
  {
    id: 'terminal-master',
    title: 'Terminal Master',
    description: 'Use terminal mode',
    icon: '⌨️',
    unlocked: false,
    category: 'easter-eggs',
  },
  {
    id: 'zen-master',
    title: 'Zen Master',
    description: 'Find inner peace in Zen mode',
    icon: '🧘',
    unlocked: false,
    category: 'easter-eggs',
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Use the app at 3 AM',
    icon: '🦉',
    unlocked: false,
    category: 'expert',
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Use the app at 6 AM',
    icon: '🌅',
    unlocked: false,
    category: 'expert',
  },
];

interface AchievementContextType {
  achievements: Achievement[];
  unlock: (id: string) => void;
  checkAchievement: (id: string) => boolean;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [notification, setNotification] = useState<Achievement | null>(null);

  useEffect(() => {
    // Load achievements from localStorage
    const saved = localStorage.getItem('codetopic-achievements');
    if (saved) {
      try {
        const savedAchievements = JSON.parse(saved);
        setAchievements(savedAchievements);
      } catch (e) {
        console.error('Failed to load achievements:', e);
      }
    }

    // Check time-based achievements
    const hour = new Date().getHours();
    if (hour === 3) {
      unlock('night-owl');
    } else if (hour === 6) {
      unlock('early-bird');
    }
  }, []);

  const unlock = (id: string) => {
    setAchievements((prev) => {
      const updated = prev.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          const unlocked = { ...ach, unlocked: true, unlockedAt: new Date() };
          setNotification(unlocked);
          setTimeout(() => setNotification(null), 5000);
          return unlocked;
        }
        return ach;
      });
      
      // Save to localStorage
      localStorage.setItem('codetopic-achievements', JSON.stringify(updated));
      return updated;
    });
  };

  const checkAchievement = (id: string): boolean => {
    return achievements.find((ach) => ach.id === id)?.unlocked || false;
  };

  return (
    <AchievementContext.Provider value={{ achievements, unlock, checkAchievement }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl min-w-[300px]"
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">{notification.icon}</div>
              <div>
                <div className="font-bold text-lg">Achievement Unlocked!</div>
                <div className="text-sm">{notification.title}</div>
                <div className="text-xs opacity-90">{notification.description}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
}

export function AchievementPanel({ onClose }: { onClose: () => void }) {
  const { achievements } = useAchievements();
  
  const categories = ['chat', 'games', 'easter-eggs', 'social', 'expert'] as const;
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('chat');

  const filteredAchievements = achievements.filter((ach) => ach.category === activeCategory);
  const unlockedCount = achievements.filter((ach) => ach.unlocked).length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🏆 Achievements
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full flex items-center justify-center text-xs text-white font-bold"
              >
                {progress}%
              </motion.div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                      {achievement.unlocked && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

