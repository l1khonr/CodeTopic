'use client';

import { DelightFeaturesProvider } from '@/hooks/use-delight-features';
import { AchievementProvider } from '@/components/achievements/achievement-system';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AchievementProvider>
      <DelightFeaturesProvider>
        {children}
      </DelightFeaturesProvider>
    </AchievementProvider>
  );
}

