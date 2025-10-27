'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const ZEN_QUOTES = [
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "The best error message is the one that never shows up.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Code never lies, comments sometimes do.",
  "Clean code always looks like it was written by someone who cares.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
];

interface ZenModeProps {
  enabled: boolean;
  children: React.ReactNode;
}

export function ZenMode({ enabled, children }: ZenModeProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (enabled) {
      setQuote(ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)]);
    }
  }, [enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative min-h-screen">
      {/* Zen background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 -z-10" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 -z-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Zen quote */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-40 max-w-2xl"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <p className="text-white text-lg font-light italic">"{quote}"</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content with zen styling */}
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
        >
          {children}
        </motion.div>
      </div>

      {/* Zen mode indicator */}
      <div className="fixed bottom-4 right-4 z-50 bg-white/10 backdrop-blur-lg text-white px-4 py-2 rounded-full border border-white/20 text-sm">
        🧘 Zen Mode Active
      </div>
    </div>
  );
}

