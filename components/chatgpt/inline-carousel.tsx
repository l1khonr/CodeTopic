/**
 * ChatGPT Inline Carousel Component
 * For presenting 3-8 similar items side-by-side
 */

'use client';

import { useRef } from 'react';
import * as icons from '@radix-ui/react-icons';

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  metadata?: string[];
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface InlineCarouselProps {
  items: CarouselItem[];
  title?: string;
}

export function InlineCarousel({ items, title }: InlineCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-foreground mb-3 px-4">
          {title}
        </h3>
      )}

      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <icons.ChevronLeftIcon className="h-4 w-4" />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-2 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-64 rounded-lg border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-video bg-muted relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.badge && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/75 text-white text-xs font-medium">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                  {item.title}
                </h4>
                
                {item.metadata && (
                  <div className="space-y-1 mb-3">
                    {item.metadata.slice(0, 2).map((meta, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground line-clamp-1">
                        {meta}
                      </p>
                    ))}
                  </div>
                )}

                {/* Action */}
                {item.action && (
                  <button
                    onClick={item.action.onClick}
                    className="w-full px-3 py-2 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
                  >
                    {item.action.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <icons.ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

