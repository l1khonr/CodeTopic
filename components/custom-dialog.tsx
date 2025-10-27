/**
 * Custom Dialog Component using Radix UI
 * Updated to follow ChatGPT design guidelines
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface CustomDialogProps {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function CustomDialog({
  trigger,
  children,
  title,
  description,
  className,
}: CustomDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || (
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Open Dialog
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay - following system design */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Content - using system colors and spacing */}
        <Dialog.Content className={cn(
          "fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}>
          {title && (
            <Dialog.Title className="mb-4 text-heading-20 text-foreground">
              {title}
            </Dialog.Title>
          )}

          {description && (
            <Dialog.Description className="mb-4 text-copy-14 text-muted-foreground">
              {description}
            </Dialog.Description>
          )}

          {children}

          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 rounded-sm p-1 opacity-70 hover:opacity-100 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <span className="sr-only">Close</span>
              <svg
                width="16"
                height="16"
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
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

