'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useDelightFeatures } from '@/hooks/use-delight-features';

interface QuizQuestion {
  question: string;
  code?: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What will this JavaScript code output?",
    code: "console.log(typeof null);",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    correct: 2,
    explanation: "typeof null returns 'object' - this is actually a bug in JavaScript that has been kept for backwards compatibility!"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    explanation: "Binary search has O(log n) time complexity because it divides the search space in half with each iteration."
  },
  {
    question: "Which HTTP status code means 'Not Found'?",
    options: ["200", "404", "500", "301"],
    correct: 1,
    explanation: "404 is the HTTP status code for 'Not Found', meaning the requested resource could not be found on the server."
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Colorful Style Sheets"
    ],
    correct: 2,
    explanation: "CSS stands for Cascading Style Sheets, used for styling HTML documents."
  },
  {
    question: "What will this code output?",
    code: "console.log(0.1 + 0.2 === 0.3);",
    options: ["true", "false", "undefined", "NaN"],
    correct: 1,
    explanation: "Due to floating point precision issues in JavaScript, 0.1 + 0.2 equals 0.30000000000000004, not 0.3!"
  },
  {
    question: "What is the purpose of 'git rebase'?",
    options: [
      "Delete a branch",
      "Merge branches",
      "Reapply commits on top of another base",
      "Create a new repository"
    ],
    correct: 2,
    explanation: "Git rebase reapplies commits on top of another base tip, creating a linear history."
  },
  {
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Hash Table"],
    correct: 1,
    explanation: "A Stack uses LIFO - the last element added is the first one to be removed."
  },
  {
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Interface",
      "Application Process Interface",
      "Automated Programming Interface"
    ],
    correct: 0,
    explanation: "API stands for Application Programming Interface, which allows different software applications to communicate with each other."
  }
];

interface CodeQuizProps {
  onClose: () => void;
}

export function CodeQuiz({ onClose }: CodeQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { triggerConfetti } = useDelightFeatures();

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    if (index === question.correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      if (score >= QUIZ_QUESTIONS.length / 2) {
        triggerConfetti();
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🧠 Code Quiz Challenge
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {!quizComplete ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Score: {score}/{QUIZ_QUESTIONS.length}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                {question.question}
              </h3>
              {question.code && (
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-4 overflow-x-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    {question.code}
                  </code>
                </pre>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correct;
                const showResult = selectedAnswer !== null;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      !showResult
                        ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : isCorrect
                        ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500'
                        : isSelected
                        ? 'bg-red-100 dark:bg-red-900 border-2 border-red-500'
                        : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    {showResult && isCorrect && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="ml-2 text-red-600">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong className="text-blue-600 dark:text-blue-400">Explanation:</strong>{' '}
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              {score === QUIZ_QUESTIONS.length ? '🏆' : score >= QUIZ_QUESTIONS.length / 2 ? '🎉' : '📚'}
            </motion.div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Quiz Complete!
            </h3>
            <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
              Your Score: {score} / {QUIZ_QUESTIONS.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {score === QUIZ_QUESTIONS.length
                ? 'Perfect score! You are a coding wizard! 🧙‍♂️'
                : score >= QUIZ_QUESTIONS.length / 2
                ? 'Great job! Keep learning! 💪'
                : 'Keep practicing! You will get there! 🚀'}
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

