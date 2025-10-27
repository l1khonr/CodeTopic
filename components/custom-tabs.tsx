/**
 * Custom Tabs Component using Radix UI
 * Unstyled primitive with custom styling
 */

'use client';

import * as Tabs from '@radix-ui/react-tabs';

export function CustomTabs({
  items,
  defaultValue,
}: {
  items: { value: string; label: string; content: React.ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <Tabs.Root defaultValue={defaultValue || items[0]?.value}>
      <Tabs.List className="flex border-b border-border">
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            value={item.value}
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {items.map((item) => (
        <Tabs.Content
          key={item.value}
          value={item.value}
          className="mt-4"
        >
          {item.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

