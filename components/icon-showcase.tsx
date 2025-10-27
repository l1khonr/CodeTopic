/**
 * Radix Icons Showcase Component
 * Demonstrates various Radix UI icons
 */

'use client';

import * as icons from '@radix-ui/react-icons';

export function IconShowcase() {
  const iconGroups = [
    {
      name: 'Common',
      icons: [
        <icons.FaceIcon key="face" className="h-6 w-6" />,
        <icons.SunIcon key="sun" className="h-6 w-6" />,
        <icons.ImageIcon key="image" className="h-6 w-6" />,
        <icons.GearIcon key="gear" className="h-6 w-6" />,
        <icons.MagnifyingGlassIcon key="search" className="h-6 w-6" />,
      ],
    },
    {
      name: 'Actions',
      icons: [
        <icons.CheckIcon key="check" className="h-6 w-6" />,
        <icons.Cross2Icon key="close" className="h-6 w-6" />,
        <icons.PlusIcon key="plus" className="h-6 w-6" />,
        <icons.MinusIcon key="minus" className="h-6 w-6" />,
        <icons.TrashIcon key="trash" className="h-6 w-6" />,
      ],
    },
    {
      name: 'Navigation',
      icons: [
        <icons.ChevronLeftIcon key="left" className="h-6 w-6" />,
        <icons.ChevronRightIcon key="right" className="h-6 w-6" />,
        <icons.DoubleArrowLeftIcon key="double-left" className="h-6 w-6" />,
        <icons.DoubleArrowRightIcon key="double-right" className="h-6 w-6" />,
        <icons.HomeIcon key="home" className="h-6 w-6" />,
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {iconGroups.map((group) => (
        <div key={group.name}>
          <h3 className="mb-3 font-sans text-sm font-medium">{group.name}</h3>
          <div className="flex flex-wrap gap-4 text-foreground">
            {group.icons.map((icon, idx) => (
              <div
                key={idx}
                className="flex h-12 w-12 items-center justify-center rounded-lg border bg-gray-50 dark:bg-gray-900"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const CommonIcons = icons;

