'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { FullscreenModal } from './fullscreen-modal';

const inlineCardVariants = cva(
  'rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-200',
  {
    variants: {
      size: {
        default: 'w-full max-w-md',
        sm: 'w-full max-w-sm',
        lg: 'w-full max-w-lg',
      },
      expanded: {
        false: '',
        true: 'max-h-screen',
      },
    },
    defaultVariants: {
      size: 'default',
      expanded: false,
    },
  }
);

export interface InlineCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineCardVariants> {
  title?: React.ReactNode;
  showExpand?: boolean;
  showShowMore?: boolean;
  onExpand?: () => void;
  onShowMore?: () => void;
  editControls?: React.ReactNode;
  primaryActions?: React.ReactNode;
  children?: React.ReactNode;
  persistState?: boolean;
  defaultExpanded?: boolean;
}

const InlineCard = React.forwardRef<HTMLDivElement, InlineCardProps>(
  ({
    className,
    size,
    title,
    showExpand = false,
    showShowMore = false,
    onExpand,
    onShowMore,
    editControls,
    primaryActions,
    children,
    persistState = false,
    defaultExpanded = false,
    ...props
  }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    const handleExpand = () => {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      onExpand?.();
    };

    return (
      <div
        ref={ref}
        className={cn(inlineCardVariants({ size, expanded: isExpanded }), className)}
        {...props}
      >
        {/* Header with title and controls */}
        {(title || showExpand || showShowMore || editControls) && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-copy-16 font-medium text-foreground">
                  {title}
                </h3>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editControls}
              {showExpand && (
                <button
                  onClick={handleExpand}
                  className="rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </button>
              )}
              {showShowMore && (
                <button
                  onClick={onShowMore}
                  className="rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  aria-label="Show more"
                >
                  Show more
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className={cn(
          "space-y-3",
          !isExpanded && "max-h-60 overflow-hidden"
        )}>
          {children}
        </div>

        {/* Primary actions at bottom */}
        {primaryActions && (
          <div className="mt-4 flex gap-2">
            {primaryActions}
          </div>
        )}
      </div>
    );
  }
);

InlineCard.displayName = 'InlineCard';

export { InlineCard, inlineCardVariants };