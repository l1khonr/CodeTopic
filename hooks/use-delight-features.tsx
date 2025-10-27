'use client';

import { useState, useCallback, createContext, useContext } from 'react';

interface DelightFeaturesContextType {
  // UI Modes
  matrixMode: boolean;
  zenMode: boolean;
  partyMode: boolean;
  terminalMode: boolean;
  
  // Visual Effects
  particleCursor: boolean;
  trailCursor: boolean;
  
  // Developer Features
  devMode: boolean;
  
  // Panels
  showAchievements: boolean;
  showQuiz: boolean;
  showTypingGame: boolean;
  
  // Toggles
  toggleMatrixMode: () => void;
  toggleZenMode: () => void;
  togglePartyMode: () => void;
  toggleTerminalMode: () => void;
  toggleParticleCursor: () => void;
  toggleTrailCursor: () => void;
  toggleDevMode: () => void;
  toggleAchievements: () => void;
  toggleQuiz: () => void;
  toggleTypingGame: () => void;
  
  // Triggers
  triggerConfetti: () => void;
  triggerSparkle: (x: number, y: number) => void;
}

const DelightFeaturesContext = createContext<DelightFeaturesContextType | null>(null);

export function DelightFeaturesProvider({ children }: { children: React.ReactNode }) {
  // UI Modes
  const [matrixMode, setMatrixMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  
  // Visual Effects
  const [particleCursor, setParticleCursor] = useState(false);
  const [trailCursor, setTrailCursor] = useState(false);
  
  // Developer Features
  const [devMode, setDevMode] = useState(false);
  
  // Panels
  const [showAchievements, setShowAchievements] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTypingGame, setShowTypingGame] = useState(false);

  const toggleMatrixMode = useCallback(() => {
    setMatrixMode((prev) => !prev);
    if (!matrixMode) {
      setZenMode(false);
      setPartyMode(false);
    }
  }, [matrixMode]);

  const toggleZenMode = useCallback(() => {
    setZenMode((prev) => !prev);
    if (!zenMode) {
      setMatrixMode(false);
      setPartyMode(false);
    }
  }, [zenMode]);

  const togglePartyMode = useCallback(() => {
    setPartyMode((prev) => !prev);
    if (!partyMode) {
      setMatrixMode(false);
      setZenMode(false);
    }
  }, [partyMode]);

  const toggleTerminalMode = useCallback(() => setTerminalMode((prev) => !prev), []);
  const toggleParticleCursor = useCallback(() => setParticleCursor((prev) => !prev), []);
  const toggleTrailCursor = useCallback(() => setTrailCursor((prev) => !prev), []);
  const toggleDevMode = useCallback(() => setDevMode((prev) => !prev), []);
  const toggleAchievements = useCallback(() => setShowAchievements((prev) => !prev), []);
  const toggleQuiz = useCallback(() => setShowQuiz((prev) => !prev), []);
  const toggleTypingGame = useCallback(() => setShowTypingGame((prev) => !prev), []);

  const triggerConfetti = useCallback(() => {
    // This will be handled by a confetti component listening to this
    window.dispatchEvent(new CustomEvent('trigger-confetti'));
  }, []);

  const triggerSparkle = useCallback((x: number, y: number) => {
    window.dispatchEvent(new CustomEvent('trigger-sparkle', { detail: { x, y } }));
  }, []);

  const value: DelightFeaturesContextType = {
    matrixMode,
    zenMode,
    partyMode,
    terminalMode,
    particleCursor,
    trailCursor,
    devMode,
    showAchievements,
    showQuiz,
    showTypingGame,
    toggleMatrixMode,
    toggleZenMode,
    togglePartyMode,
    toggleTerminalMode,
    toggleParticleCursor,
    toggleTrailCursor,
    toggleDevMode,
    toggleAchievements,
    toggleQuiz,
    toggleTypingGame,
    triggerConfetti,
    triggerSparkle,
  };

  return (
    <DelightFeaturesContext.Provider value={value}>
      {children}
    </DelightFeaturesContext.Provider>
  );
}

export function useDelightFeatures() {
  const context = useContext(DelightFeaturesContext);
  if (!context) {
    throw new Error('useDelightFeatures must be used within DelightFeaturesProvider');
  }
  return context;
}

