'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../lib/utils';

export interface FullscreenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  composer?: React.ReactNode;
  className?: string;
}

const FullscreenModal = React.forwardRef<HTMLDivElement, FullscreenModalProps>(
  ({ open, onOpenChange, children, composer, className }, ref) => {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          {/* Fullscreen overlay */}
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

          {/* Fullscreen content */}
          <Dialog.Content
            ref={ref}
            className={cn(
              'fixed inset-0 z-50 flex flex-col bg-background',
              className
            )}
          >
            {/* System close button */}
            <div className="flex justify-end p-4">
              <Dialog.Close className="rounded-full bg-card p-2 shadow-sm hover:bg-accent">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Dialog.Close>
            </div>

            {/* Fullscreen view content */}
            <div className="flex-1 overflow-auto p-4">
              {children}
            </div>

            {/* Composer overlay - always present */}
            {composer && (
              <div className="border-t border-border bg-card p-4">
                {composer}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

FullscreenModal.displayName = 'FullscreenModal';

export { FullscreenModal };