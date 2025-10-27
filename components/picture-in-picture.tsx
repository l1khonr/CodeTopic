'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface PictureInPictureProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isActive?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const PictureInPicture = React.forwardRef<HTMLDivElement, PictureInPictureProps>(
  ({ children, isActive = true, onDismiss, className, ...props }, ref) => {
    const [isPinned, setIsPinned] = React.useState(false);

    React.useEffect(() => {
      if (!isActive) {
        setIsPinned(false);
      }
    }, [isActive]);

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed top-4 right-4 z-40 w-80 max-w-sm rounded-lg border border-border bg-card shadow-lg transition-all duration-300 ease-in-out',
          isPinned ? 'scale-100 opacity-100' : 'scale-95 opacity-90 hover:scale-100 hover:opacity-100',
          className
        )}
        {...props}
      >
        {/* Header with dismiss button */}
        <div className="flex items-center justify-between border-b border-border p-3">
          <div className="flex-1" />
          <button
            onClick={onDismiss}
            className="rounded p-1 hover:bg-accent"
            aria-label="Dismiss"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    );
  }
);

PictureInPicture.displayName = 'PictureInPicture';

export { PictureInPicture };