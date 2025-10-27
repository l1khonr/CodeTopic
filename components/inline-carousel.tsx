'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '../lib/utils';

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  metadata: string[];
  badge?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export interface InlineCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CarouselItem[];
  className?: string;
}

const InlineCarousel = React.forwardRef<HTMLDivElement, InlineCarouselProps>(
  ({ items, className, ...props }, ref) => {
    if (!items.length || items.length > 8) {
      console.warn('InlineCarousel: Items should be between 1-8. Received:', items.length);
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-4 overflow-x-auto pb-2 scrollbar-hide',
          className
        )}
        {...props}
      >
        {items.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="flex min-w-[200px] flex-col rounded-lg border border-border bg-card shadow-sm"
          >
            {/* Image */}
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3">
              {/* Badge */}
              {item.badge && (
                <div className="mb-2 flex">
                  <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Title */}
              <h4 className="mb-2 text-copy-14 font-medium text-foreground line-clamp-2">
                {item.title}
              </h4>

              {/* Metadata */}
              <div className="flex-1 space-y-1">
                {item.metadata.slice(0, 2).map((meta, index) => (
                  <p
                    key={index}
                    className="text-copy-12 text-muted-foreground line-clamp-1"
                  >
                    {meta}
                  </p>
                ))}
              </div>

              {/* Action */}
              {item.onAction && item.actionLabel && (
                <div className="mt-3">
                  <button
                    onClick={item.onAction}
                    className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {item.actionLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

InlineCarousel.displayName = 'InlineCarousel';

export { InlineCarousel };
