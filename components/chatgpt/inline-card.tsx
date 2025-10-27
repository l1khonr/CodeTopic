/**
 * ChatGPT Inline Card Component
 * Follows ChatGPT design guidelines for inline displays
 */

'use client';

import { useState } from 'react';
import * as icons from '@radix-ui/react-icons';

interface InlineCardProps {
  title?: string;
  children: React.ReactNode;
  expandable?: boolean;
  onExpand?: () => void;
  showMore?: boolean;
  onShowMore?: () => void;
  editControls?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function InlineCard({
  title,
  children,
  expandable,
  onExpand,
  showMore,
  onShowMore,
  editControls,
  primaryAction,
  secondaryAction,
}: InlineCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Header */}
      {(title || expandable || editControls) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {title && (
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          )}
          
          <div className="flex items-center gap-2">
            {editControls && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 hover:bg-muted rounded"
                aria-label="Edit"
              >
                <icons.Pencil1Icon className="h-4 w-4" />
              </button>
            )}
            
            {expandable && (
              <button
                onClick={onExpand}
                className="p-1 hover:bg-muted rounded"
                aria-label="Expand to fullscreen"
              >
                <icons.EnterFullScreenIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {isEditing && editControls ? editControls : children}
      </div>

      {/* Show More */}
      {showMore && (
        <div className="px-4 pb-3">
          <button
            onClick={onShowMore}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Show more
            <icons.ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="px-4 py-3 border-t border-border flex gap-2">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="flex-1 px-4 py-2 rounded-md border border-border bg-white dark:bg-gray-900 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
          
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="flex-1 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

