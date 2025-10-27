'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface EditableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EditableText = React.forwardRef<HTMLDivElement, EditableTextProps>(
  ({ value, onChange, placeholder, className, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      setEditValue(value);
    }, [value]);

    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const handleSave = () => {
      onChange(editValue);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditValue(value);
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (isEditing) {
      return (
        <div className="relative">
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              'w-full border-b-2 border-primary bg-transparent px-1 py-0.5 text-foreground outline-none',
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        onClick={() => setIsEditing(true)}
        className={cn(
          'cursor-text rounded px-1 py-0.5 hover:bg-accent/50',
          className
        )}
        {...props}
      >
        {value || (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>
    );
  }
);

EditableText.displayName = 'EditableText';

export { EditableText };