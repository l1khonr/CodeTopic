/**
 * ChatGPT Picture-in-Picture Component
 * Persistent floating window for ongoing/live sessions
 */

'use client';

import { useState, useEffect } from 'react';
import * as icons from '@radix-ui/react-icons';

interface PictureInPictureProps {
  isActive: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function PictureInPicture({
  isActive,
  onClose,
  children,
  title,
}: PictureInPictureProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-pin on scroll
  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsPinned(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className={`${
        isPinned
          ? 'fixed top-4 right-4 z-50'
          : 'relative w-full max-w-md mx-auto my-4'
      } rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl overflow-hidden transition-all duration-300`}
      style={{
        width: isPinned ? '320px' : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
        {title && (
          <span className="text-xs font-medium text-foreground truncate">
            {title}
          </span>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-muted rounded"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? (
              <icons.PlusIcon className="h-3 w-3" />
            ) : (
              <icons.MinusIcon className="h-3 w-3" />
            )}
          </button>
          
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded"
            aria-label="Close"
          >
            <icons.Cross2Icon className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4">
          {children}
        </div>
      )}

      {/* Status Indicator */}
      {isPinned && (
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      )}
    </div>
  );
}

/**
 * Example Usage: Game Session PiP
 */
export function GamePiP() {
  const [isActive, setIsActive] = useState(true);
  const [score, setScore] = useState(0);

  return (
    <PictureInPicture
      isActive={isActive}
      onClose={() => setIsActive(false)}
      title="Word Game"
    >
      <div className="text-center space-y-4">
        <div className="text-3xl font-bold">{score}</div>
        <p className="text-sm text-muted-foreground">
          Keep playing while you chat!
        </p>
        <button
          onClick={() => setScore(score + 10)}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Score Point
        </button>
      </div>
    </PictureInPicture>
  );
}

