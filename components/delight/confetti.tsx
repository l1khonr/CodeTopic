'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const triggerConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setPieces(newPieces);

    // Clear confetti after animation
    setTimeout(() => setPieces([]), 3000);
  };

  useEffect(() => {
    const handleTrigger = () => triggerConfetti();
    window.addEventListener('trigger-confetti', handleTrigger);
    return () => {
      window.removeEventListener('trigger-confetti', handleTrigger);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ x: piece.x, y: piece.y, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            x: piece.x + (Math.random() - 0.5) * 200,
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: piece.color,
            transform: `scale(${piece.scale})`,
          }}
        />
      ))}
    </div>
  );
}

export function SparkleEffect({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed pointer-events-none z-40"
      style={{ left: x, top: y }}
    >
      <div className="text-4xl">✨</div>
    </motion.div>
  );
}

export function HeartBurst({ x, y }: { x: number; y: number }) {
  const hearts = Array.from({ length: 8 });

  return (
    <div className="fixed pointer-events-none z-40" style={{ left: x, top: y }}>
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i * Math.PI * 2) / 8) * 100,
            y: Math.sin((i * Math.PI * 2) / 8) * 100,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute text-red-500"
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

export function FloatingEmoji({ emoji, duration = 3 }: { emoji: string; duration?: number }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration * 1000);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -200, opacity: 0, scale: 1.5 }}
      transition={{ duration, ease: 'easeOut' }}
      className="fixed left-1/2 bottom-20 -translate-x-1/2 pointer-events-none z-40 text-6xl"
    >
      {emoji}
    </motion.div>
  );
}

export function RippleEffect({ x, y, color = 'rgba(59, 130, 246, 0.5)' }: { x: number; y: number; color?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed pointer-events-none rounded-full z-30"
      style={{
        left: x - 25,
        top: y - 25,
        width: '50px',
        height: '50px',
        border: `3px solid ${color}`,
      }}
    />
  );
}

