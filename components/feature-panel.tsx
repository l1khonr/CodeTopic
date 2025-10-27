'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDelightFeatures } from '@/hooks/use-delight-features';
import { useAchievements } from './achievements/achievement-system';

export function FeaturePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const features = useDelightFeatures();
  const { achievements } = useAchievements();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:shadow-purple-500/50 transition-shadow"
      >
        {isOpen ? '✕' : '✨'}
      </motion.button>

      {/* Feature Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 h-screen w-96 bg-white dark:bg-gray-900 shadow-2xl z-30 overflow-y-auto border-l border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                🎮 Feature Center
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Unlock the magic of Codetopic!
              </p>

              {/* Achievements Preview */}
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">🏆 Achievements</h3>
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                    {unlockedCount}/{achievements.length}
                  </span>
                </div>
                <button
                  onClick={features.toggleAchievements}
                  className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium transition-colors"
                >
                  View All
                </button>
              </div>

              {/* UI Modes */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  🎨 UI Modes
                </h3>
                <div className="space-y-2">
                  <FeatureButton
                    active={features.matrixMode}
                    onClick={features.toggleMatrixMode}
                    label="Matrix Mode"
                    icon="🕶️"
                    description="Enter the Matrix"
                  />
                  <FeatureButton
                    active={features.zenMode}
                    onClick={features.toggleZenMode}
                    label="Zen Mode"
                    icon="🧘"
                    description="Find inner peace"
                  />
                  <FeatureButton
                    active={features.partyMode}
                    onClick={features.togglePartyMode}
                    label="Party Mode"
                    icon="🎉"
                    description="Let's celebrate!"
                  />
                  <FeatureButton
                    active={features.terminalMode}
                    onClick={features.toggleTerminalMode}
                    label="Terminal Mode"
                    icon="⌨️"
                    description="Hacker mode activated"
                  />
                </div>
              </div>

              {/* Visual Effects */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  ✨ Visual Effects
                </h3>
                <div className="space-y-2">
                  <FeatureButton
                    active={features.particleCursor}
                    onClick={features.toggleParticleCursor}
                    label="Particle Cursor"
                    icon="🌟"
                    description="Magical cursor trail"
                  />
                  <FeatureButton
                    active={features.trailCursor}
                    onClick={features.toggleTrailCursor}
                    label="Trail Cursor"
                    icon="✨"
                    description="Smooth cursor trail"
                  />
                </div>
              </div>

              {/* Mini Games */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  🎮 Mini Games
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={features.toggleQuiz}
                    className="w-full p-3 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-lg border border-blue-300 dark:border-blue-700 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧠</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Code Quiz
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Test your knowledge
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={features.toggleTypingGame}
                    className="w-full p-3 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-lg border border-green-300 dark:border-green-700 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⌨️</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Speed Typing
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Type code fast!
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Developer Tools */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  👨‍💻 Developer Tools
                </h3>
                <div className="space-y-2">
                  <FeatureButton
                    active={features.devMode}
                    onClick={features.toggleDevMode}
                    label="Developer Mode"
                    icon="💻"
                    description="Advanced stats & commands"
                  />
                </div>
              </div>

              {/* Easter Eggs Hint */}
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                  🥚 Secret Codes
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                  Discover hidden features and unlock achievements!
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Try the Konami code: ↑↑↓↓←→←→BA</li>
                  <li>• Press Ctrl+Shift+D for dev tools</li>
                  <li>• Type /commands in terminal mode</li>
                  <li>• Chat at 3 AM for a surprise 🦉</li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <button
                  onClick={features.triggerConfetti}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-semibold shadow-lg transition-all"
                >
                  🎊 Trigger Confetti
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface FeatureButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
  description: string;
}

function FeatureButton({ active, onClick, label, icon, description }: FeatureButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg border-2 transition-all ${
        active
          ? 'bg-green-100 dark:bg-green-900/40 border-green-500 dark:border-green-600'
          : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {label}
            {active && <span className="text-green-600 text-sm">✓</span>}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{description}</div>
        </div>
      </div>
    </button>
  );
}

