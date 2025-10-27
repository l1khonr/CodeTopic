'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CODE_SNIPPETS = [
  "const greeting = 'Hello, World!';",
  "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
  "const sortArray = arr => [...arr].sort((a, b) => a - b);",
  "class Rectangle { constructor(width, height) { this.width = width; this.height = height; } }",
  "const API_KEY = process.env.NEXT_PUBLIC_API_KEY;",
  "export default async function handler(req, res) { res.status(200).json({ success: true }); }",
  "const [state, setState] = useState(initialValue);",
  "import { motion } from 'framer-motion';",
];

interface TypingGameProps {
  onClose: () => void;
}

export function TypingGame({ onClose }: TypingGameProps) {
  const [snippet, setSnippet] = useState('');
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSnippet(CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typed.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (typed === snippet && snippet.length > 0) {
      setEndTime(Date.now());
      calculateStats();
    }

    // Calculate real-time accuracy
    if (typed.length > 0) {
      const correctChars = typed.split('').filter((char, i) => char === snippet[i]).length;
      setAccuracy(Math.round((correctChars / typed.length) * 100));
    }
  }, [typed, snippet, startTime]);

  const calculateStats = () => {
    if (startTime && endTime) {
      const timeInMinutes = (endTime - startTime) / 1000 / 60;
      const words = snippet.length / 5; // Standard: 5 characters = 1 word
      const calculatedWpm = Math.round(words / timeInMinutes);
      setWpm(calculatedWpm);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > snippet.length) return;

    if (value[value.length - 1] !== snippet[value.length - 1]) {
      setErrors(errors + 1);
    }

    setTyped(value);
  };

  const handleRestart = () => {
    setSnippet(CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
    setTyped('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    inputRef.current?.focus();
  };

  const isComplete = typed === snippet && snippet.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⌨️ Speed Coding Challenge
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {!isComplete ? (
          <>
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg font-mono text-sm">
              {snippet.split('').map((char, i) => {
                const typedChar = typed[i];
                const isTyped = i < typed.length;
                const isCorrect = typedChar === char;
                const isCurrent = i === typed.length;

                return (
                  <span
                    key={i}
                    className={`${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isTyped
                        ? isCorrect
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg mb-6 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              placeholder="Start typing..."
              autoFocus
            />

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((typed.length / snippet.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {errors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              🎯
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Challenge Complete!
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {wpm}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {wpm > 80
                ? 'Lightning fast! ⚡'
                : wpm > 60
                ? 'Excellent speed! 🚀'
                : wpm > 40
                ? 'Good job! Keep practicing! 💪'
                : 'Keep going! Practice makes perfect! 📚'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

