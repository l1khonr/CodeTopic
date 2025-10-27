'use client';

import { CodetopicHero } from '@/components/marketing/codetopic-hero';
import { FeatureShowcase } from '@/components/marketing/feature-showcase';
import { Providers } from './providers';
import { EnhancedChat } from '@/components/enhanced-chat';

/**
 * Main Home component that renders the Codetopic AI chat application
 *
 * Features:
 * - Hero section with marketing content
 * - Feature showcase section
 * - Enhanced interactive chat interface with AI
 * - User delight features (animations, confetti, particle effects)
 * - Developer Easter eggs (Konami code, dev mode, secret commands)
 * - Educational mini-games (code quiz, typing game)
 * - Alternate UI modes (Matrix, Zen, Terminal, Party)
 * - Achievement system with unlockable rewards
 * - Real-time message handling and display
 */
export default function Home() {
  return (
    <Providers>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Marketing banner with main value proposition */}
      <CodetopicHero />

      {/* Feature Showcase - Display key features and capabilities */}
      <FeatureShowcase />

        {/* Enhanced Chat Interface with all delight features */}
        <EnhancedChat />
      </div>
    </Providers>
  );
}
