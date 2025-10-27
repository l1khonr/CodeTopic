'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PARTY_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];

export function PartyMode({ enabled }: { enabled: boolean }) {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % PARTY_COLORS.length);
    }, 200);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Disco background */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          backgroundColor: PARTY_COLORS[colorIndex],
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Disco ball */}
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="text-6xl">🪩</div>
      </motion.div>

      {/* Party text */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          className="text-4xl font-bold text-white drop-shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        >
          🎉 PARTY MODE 🎉
        </motion.div>
      </div>

      {/* Floating emojis */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-4xl pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            rotate: 360,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {['🎉', '🎊', '🎈', '✨', '🌟', '💫', '🎆', '🎇'][i % 8]}
        </motion.div>
      ))}

      {/* Strobe lights */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40"
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
        }}
      />
    </>
  );
}

