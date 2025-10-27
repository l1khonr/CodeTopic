'use client';

import { useState, useEffect } from 'react';
import { Message } from 'ai';
import { nanoid } from 'nanoid';
import { useDelightFeatures } from '@/hooks/use-delight-features';
import { useAchievements } from './achievements/achievement-system';
import { Confetti } from './delight/confetti';
import { ParticleCursor, TrailCursor } from './delight/particle-cursor';
import { KonamiCodeDetector } from './easter-eggs/konami-code';
import { DeveloperMode } from './easter-eggs/developer-mode';
import { CodeQuiz } from './mini-games/code-quiz';
import { TypingGame } from './mini-games/typing-game';
import { MatrixMode } from './ui-modes/matrix-mode';
import { ZenMode } from './ui-modes/zen-mode';
import { TerminalMode } from './ui-modes/terminal-mode';
import { PartyMode } from './ui-modes/party-mode';
import { AchievementPanel } from './achievements/achievement-system';
import { FeaturePanel } from './feature-panel';
import { motion, AnimatePresence } from 'framer-motion';

export function EnhancedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const features = useDelightFeatures();
  const { unlock, checkAchievement } = useAchievements();

  useEffect(() => {
    // Konami code achievement
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        features.toggleDevMode();
        unlock('dev-mode');
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [features, unlock]);

  useEffect(() => {
    // Listen for confetti trigger
    const handleConfetti = () => setConfettiTrigger(!confettiTrigger);
    window.addEventListener('trigger-confetti', handleConfetti);
    return () => window.removeEventListener('trigger-confetti', handleConfetti);
  }, [confettiTrigger]);

  const handleKonamiCode = () => {
    unlock('konami-code');
    features.togglePartyMode();
    setConfettiTrigger(!confettiTrigger);
  };

  const handleMessage = async (message: string) => {
    try {
      setLoading(true);
      const newMessage: Message = { id: nanoid(), role: 'user', content: message };
      setMessages(prev => [...prev, newMessage]);

      // Track achievements
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      
      if (newCount === 1) {
        unlock('first-message');
      } else if (newCount === 100) {
        unlock('chat-master');
      }

      // Check for special commands
      const lowerMsg = message.toLowerCase();
      if (lowerMsg === '/matrix') {
        features.toggleMatrixMode();
        unlock('matrix-mode');
      } else if (lowerMsg === '/terminal') {
        features.toggleTerminalMode();
        unlock('terminal-master');
      } else if (lowerMsg === '/zen') {
        features.toggleZenMode();
        unlock('zen-master');
      } else if (lowerMsg === '/party') {
        features.togglePartyMode();
        setConfettiTrigger(!confettiTrigger);
      } else if (lowerMsg === '/quiz') {
        features.toggleQuiz();
      } else if (lowerMsg === '/typing') {
        features.toggleTypingGame();
      }

      const response = await fetch('/api/codetopic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const aiMessage: Message = { id: nanoid(), ...data.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminalCommand = (cmd: string) => {
    const command = cmd.toLowerCase();
    if (command === 'joke') {
      // Show dev joke
    } else if (command === 'quiz') {
      features.toggleQuiz();
    } else if (command === 'typing') {
      features.toggleTypingGame();
    } else if (command === 'matrix') {
      features.toggleMatrixMode();
      unlock('matrix-mode');
    } else if (command === 'party') {
      features.togglePartyMode();
      setConfettiTrigger(!confettiTrigger);
    }
  };

  const chatContent = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-xl rounded-lg p-6"
      >
        {/* Messages Display Area */}
        <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary/10 ml-auto max-w-[80%]'
                    : 'bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]'
                }`}
              >
                <p className="text-gray-900 dark:text-white">{msg.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </motion.div>
          )}
        </div>

        {/* Message Input Form */}
        <div className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem('message') as HTMLInputElement;
              if (input.value.trim()) {
                handleMessage(input.value);
                input.value = '';
              }
            }}
            className="flex space-x-4"
          >
            <input
              type="text"
              name="message"
              placeholder="Ask Codetopic AI... (Try /matrix, /zen, /party, /quiz)"
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white px-4 py-2"
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
            >
              Send
            </motion.button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Tip: Try typing /matrix, /zen, /party, /quiz, /typing, or press the ✨ button!
          </p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Konami Code Detector */}
      <KonamiCodeDetector onActivate={handleKonamiCode} />

      {/* Visual Effects */}
      <ParticleCursor enabled={features.particleCursor} />
      <TrailCursor enabled={features.trailCursor} />
      <Confetti trigger={confettiTrigger} />

      {/* Developer Mode */}
      <DeveloperMode enabled={features.devMode} onClose={features.toggleDevMode} />

      {/* UI Modes */}
      <PartyMode enabled={features.partyMode} />
      
      {features.matrixMode ? (
        <MatrixMode enabled={features.matrixMode}>
          {chatContent}
        </MatrixMode>
      ) : features.zenMode ? (
        <ZenMode enabled={features.zenMode}>
          {chatContent}
        </ZenMode>
      ) : (
        chatContent
      )}

      {/* Terminal Mode */}
      {features.terminalMode && (
        <TerminalMode
          onCommand={handleTerminalCommand}
          onClose={features.toggleTerminalMode}
        />
      )}

      {/* Mini Games */}
      {features.showQuiz && (
        <CodeQuiz
          onClose={() => {
            features.toggleQuiz();
            unlock('quiz-novice');
          }}
        />
      )}
      {features.showTypingGame && (
        <TypingGame onClose={features.toggleTypingGame} />
      )}

      {/* Achievement Panel */}
      {features.showAchievements && (
        <AchievementPanel onClose={features.toggleAchievements} />
      )}

      {/* Feature Control Panel */}
      <FeaturePanel />
    </>
  );
}

