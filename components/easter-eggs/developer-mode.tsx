'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DevModeProps {
  enabled: boolean;
  onClose: () => void;
}

const DEV_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are only 10 types of people in the world: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I JOIN you?'",
  "Why do Java developers wear glasses? Because they can't C#! 😎",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Programmer: A machine that turns coffee into code. ☕→💻",
  "I would tell you a UDP joke, but you might not get it.",
  "!false - It's funny because it's true!",
  "Why did the developer go broke? Because he used up all his cache! 💰",
  "I'm not lazy, I'm just on my energy saving mode. 💤"
];

const DEV_COMMANDS = [
  { cmd: '/joke', desc: 'Get a random developer joke' },
  { cmd: '/matrix', desc: 'Enable Matrix mode' },
  { cmd: '/party', desc: 'Start party mode 🎉' },
  { cmd: '/zen', desc: 'Enter zen mode' },
  { cmd: '/stats', desc: 'Show system stats' },
  { cmd: '/clear', desc: 'Clear chat history' },
  { cmd: '/theme [name]', desc: 'Change theme (dark, light, hacker)' },
  { cmd: '/speed', desc: 'Toggle turbo mode' },
];

export function DeveloperMode({ enabled, onClose }: DevModeProps) {
  const [stats, setStats] = useState({
    messages: 0,
    uptime: '00:00:00',
    memoryUsage: '0 MB',
  });

  useEffect(() => {
    if (!enabled) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      setStats((prev) => ({
        ...prev,
        uptime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        memoryUsage: (window.performance as any).memory
          ? `${((window.performance as any).memory.usedJSHeapSize / 1048576).toFixed(2)} MB`
          : 'N/A',
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 bg-black text-green-400 p-4 rounded-lg shadow-2xl border border-green-500 max-w-md font-mono text-sm"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">👨‍💻 DEVELOPER MODE</h3>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-400 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-300">ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span className="text-blue-400">{stats.uptime}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-yellow-400">{stats.memoryUsage}</span>
          </div>
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="text-purple-400">GOD MODE</span>
          </div>
        </div>

        <div className="border-t border-green-500 pt-3">
          <p className="text-xs mb-2 text-gray-400">Available Commands:</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {DEV_COMMANDS.map((cmd) => (
              <div key={cmd.cmd} className="flex text-xs">
                <span className="text-cyan-400 mr-2">{cmd.cmd}</span>
                <span className="text-gray-400">{cmd.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-green-500">
          <p className="text-xs text-gray-400">
            Press <kbd className="px-1 bg-gray-800 rounded">Ctrl+Shift+D</kbd> to toggle
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function DevJoke() {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    setJoke(DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white shadow-lg"
    >
      <p className="text-lg">{joke}</p>
    </motion.div>
  );
}

