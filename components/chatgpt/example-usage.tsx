/**
 * Example Usage of ChatGPT Components
 * Demonstrates all UI patterns in context
 */

'use client';

import { useState } from 'react';
import { InlineCard } from './inline-card';
import { InlineCarousel, type CarouselItem } from './inline-carousel';
import { Fullscreen } from './fullscreen';
import { PictureInPicture } from './picture-in-picture';
import * as icons from '@radix-ui/react-icons';

export function ChatGPTExamples() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);

  // Example: Weather Card
  const WeatherCard = () => (
    <InlineCard
      title="Weather in San Francisco"
      expandable
      onExpand={() => setIsFullscreen(true)}
      primaryAction={{
        label: 'Set Alert',
        onClick: () => console.log('Alert set'),
      }}
      secondaryAction={{
        label: 'Share',
        onClick: () => console.log('Shared'),
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="text-4xl">☀️</div>
          <div>
            <div className="text-2xl font-bold">72°F</div>
            <div className="text-sm text-muted-foreground">Sunny</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">High</div>
            <div className="font-medium">75°F</div>
          </div>
          <div>
            <div className="text-muted-foreground">Low</div>
            <div className="font-medium">65°F</div>
          </div>
          <div>
            <div className="text-muted-foreground">Wind</div>
            <div className="font-medium">8 mph</div>
          </div>
        </div>
      </div>
    </InlineCard>
  );

  // Example: Restaurant Carousel
  const restaurants: CarouselItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      title: 'The Italian Place',
      metadata: ['Italian • $$', '4.5 ★ (234 reviews)', 'Open until 10pm'],
      badge: 'Popular',
      action: {
        label: 'Book Table',
        onClick: () => console.log('Booking'),
      },
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      title: 'Sushi Garden',
      metadata: ['Japanese • $$$', '4.8 ★ (456 reviews)', 'Open now'],
      badge: 'Top Rated',
      action: {
        label: 'Book Table',
        onClick: () => console.log('Booking'),
      },
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      title: 'Burger Spot',
      metadata: ['American • $', '4.2 ★ (189 reviews)', 'Closes at 11pm'],
      action: {
        label: 'Order Now',
        onClick: () => console.log('Ordering'),
      },
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
      title: 'Thai Kitchen',
      metadata: ['Thai • $$', '4.6 ★ (312 reviews)', 'Open until 9pm'],
      action: {
        label: 'Book Table',
        onClick: () => console.log('Booking'),
      },
    },
  ];

  // Example: Search Results with Edit
  const SearchResultsCard = () => {
    const [query, setQuery] = useState('AI chatbots');

    return (
      <InlineCard
        title="Search Results"
        showMore
        onShowMore={() => console.log('Show more')}
        editControls={
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Edit search query:
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm"
            />
          </div>
        }
        primaryAction={{
          label: 'Search',
          onClick: () => console.log('Searching:', query),
        }}
      >
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pb-3 border-b border-border last:border-0">
              <h4 className="text-sm font-medium mb-1">
                Result {i}: {query}
              </h4>
              <p className="text-xs text-muted-foreground">
                This is a sample search result showing relevant information
                about {query}.
              </p>
            </div>
          ))}
        </div>
      </InlineCard>
    );
  };

  // Example: Interactive Map in Fullscreen
  const MapFullscreen = () => (
    <Fullscreen
      isOpen={isFullscreen}
      onClose={() => setIsFullscreen(false)}
      title="Interactive Map"
      showComposer
    >
      <div className="h-full flex items-center justify-center bg-muted">
        <div className="text-center space-y-4">
          <icons.GlobeIcon className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">Interactive Map View</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This fullscreen view would contain an interactive map with pins,
            routes, and other rich content. The ChatGPT composer below allows
            you to continue the conversation.
          </p>
        </div>
      </div>
    </Fullscreen>
  );

  // Example: Game Session in PiP
  const GamePiP = () => {
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);

    return (
      <PictureInPicture
        isActive={isPiPActive}
        onClose={() => setIsPiPActive(false)}
        title="Word Game - Round {round}"
      >
        <div className="text-center space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Score</div>
            <div className="text-3xl font-bold">{score}</div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Current Word:</div>
            <div className="text-xl font-bold">CHATGPT</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setScore(score + 10);
                setRound(round + 1);
              }}
              className="flex-1 px-3 py-2 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
            >
              Correct
            </button>
            <button
              onClick={() => setRound(round + 1)}
              className="flex-1 px-3 py-2 rounded-md border border-border text-xs font-medium hover:bg-muted"
            >
              Skip
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Keep playing while you chat!
          </p>
        </div>
      </PictureInPicture>
    );
  };

  return (
    <div className="space-y-8 p-4 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold mb-4">ChatGPT UI Components</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Examples of inline cards, carousels, fullscreen, and picture-in-picture
          following ChatGPT's design guidelines.
        </p>
      </div>

      {/* Weather Card Example */}
      <section>
        <h3 className="text-sm font-medium mb-3">Inline Card</h3>
        <WeatherCard />
      </section>

      {/* Search Results with Edit */}
      <section>
        <h3 className="text-sm font-medium mb-3">Inline Card with Edit</h3>
        <SearchResultsCard />
      </section>

      {/* Restaurant Carousel */}
      <section>
        <h3 className="text-sm font-medium mb-3">Inline Carousel</h3>
        <InlineCarousel items={restaurants} title="Restaurants Nearby" />
      </section>

      {/* Fullscreen Trigger */}
      <section>
        <h3 className="text-sm font-medium mb-3">Fullscreen Experience</h3>
        <button
          onClick={() => setIsFullscreen(true)}
          className="px-4 py-2 rounded-md bg-foreground text-background hover:bg-foreground/90"
        >
          Open Interactive Map
        </button>
      </section>

      {/* PiP Trigger */}
      <section>
        <h3 className="text-sm font-medium mb-3">Picture-in-Picture</h3>
        <button
          onClick={() => setIsPiPActive(true)}
          className="px-4 py-2 rounded-md bg-foreground text-background hover:bg-foreground/90"
        >
          Start Game Session
        </button>
      </section>

      {/* Fullscreen Modal */}
      <MapFullscreen />

      {/* PiP Window */}
      <GamePiP />
    </div>
  );
}

