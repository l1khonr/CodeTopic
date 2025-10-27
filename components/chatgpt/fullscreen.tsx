/**
 * ChatGPT Fullscreen Component
 * Immersive experience for rich tasks and deep exploration
 */

'use client';

import { useEffect, useState } from 'react';
import * as icons from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog';

interface FullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showComposer?: boolean;
}

export function Fullscreen({
  isOpen,
  onClose,
  children,
  title,
  showComposer = true,
}: FullscreenProps) {
  const [composerInput, setComposerInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastResponse, setLastResponse] = useState('');

  const handleSend = () => {
    if (!composerInput.trim()) return;

    setIsThinking(true);
    // Simulate AI response
    setTimeout(() => {
      setLastResponse(`Response to: ${composerInput}`);
      setComposerInput('');
      setIsThinking(false);
    }, 1500);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        
        <Dialog.Content className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            {title && (
              <Dialog.Title className="text-sm font-medium">
                {title}
              </Dialog.Title>
            )}
            
            <Dialog.Close asChild>
              <button
                className="p-1 hover:bg-muted rounded"
                aria-label="Close"
              >
                <icons.Cross2Icon className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* ChatGPT Composer (Always Present) */}
          {showComposer && (
            <div className="border-t border-border bg-white dark:bg-gray-900 p-4">
              {/* Last Response Snippet */}
              {lastResponse && (
                <div className="mb-2 px-3 py-2 rounded-md bg-muted text-xs text-muted-foreground truncate">
                  {lastResponse}
                </div>
              )}

              {/* Composer Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={composerInput}
                  onChange={(e) => setComposerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isThinking ? 'Thinking...' : 'Continue conversation...'}
                  disabled={isThinking}
                  className={`flex-1 px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-950 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground ${
                    isThinking ? 'animate-pulse' : ''
                  }`}
                />
                
                <button
                  onClick={handleSend}
                  disabled={!composerInput.trim() || isThinking}
                  className="px-4 py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <icons.PaperPlaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

