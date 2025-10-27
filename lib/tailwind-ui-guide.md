# Tailwind UI - Beautiful Marketing Components

## Overview

Tailwind UI provides beautiful, production-ready components crafted by the makers of Tailwind CSS. This includes feature sections, newsletter forms, pricing tables, and more.

## Integration with This Project

This project already uses Tailwind CSS with Radix UI primitives. You can enhance it with:

1. **Headless UI** - Accessible, unstyled components (installed ✅)
2. **Tailwind UI patterns** - Marketing-focused components
3. **Custom designs** - Using the same principles

## Available Components

### Marketing

- **Hero sections** - Eye-catching landing headers
- **Feature sections** - Highlight product capabilities
- **Testimonials** - Social proof and reviews
- **Pricing tables** - Pricing plans and comparisons
- **Newsletter forms** - Email collection
- **CTAs** - Call-to-action sections
- **Footers** - Complete page footers

### Application UI

- **Dashboards** - Analytics and metrics
- **Navigation** - Sidebars and headers
- **Data displays** - Tables and lists
- **Forms** - Input fields and controls
- **Overlays** - Modals and dialogs
- **Empty states** - Placeholder content

## Using Headless UI

Headless UI is similar to Radix UI - unstyled, accessible primitives:

```tsx
import { Dialog } from '@headlessui/react';

function MyDialog({ isOpen, setIsOpen }) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <Dialog.Backdrop />
      <Dialog.Panel>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog description</Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
}
```

## Styling with Tailwind

Combine Headless UI with Tailwind for complete control:

```tsx
<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
  {/* Content */}
</Dialog.Panel>
```

## Marketing Component Examples

### Hero Section

```tsx
export function HeroSection() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Data to enrich your</span>{' '}
                <span className="block text-indigo-600 xl:inline">online business</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

### Feature Grid

```tsx
export function FeatureGrid() {
  const features = [
    {
      name: 'Easy to use',
      description: 'Get started in minutes',
      icon: (props) => <ChatBubbleLeftRightIcon {...props} />,
    },
    // More features...
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.name} className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-5 text-base text-gray-500">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Pricing Table

```tsx
export function PricingTable() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {/* Pricing cards */}
      <div className="flex flex-col rounded-lg shadow-lg">
        <div className="px-6 py-8 sm:p-10 sm:pb-6">
          <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
          <p className="mt-4 text-base text-gray-500">Perfect for getting started</p>
        </div>
        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckIcon className="h-6 w-6 flex-shrink-0 text-indigo-500" />
              <span className="ml-3 text-base text-gray-700">Feature 1</span>
            </li>
          </ul>
          <button className="mt-8 block w-full bg-indigo-500 border border-transparent rounded-md py-3 text-center text-base font-medium text-white hover:bg-indigo-600">
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Best Practices

1. **Copy and customize** - Start with Tailwind UI examples
2. **Use your brand colors** - Replace with your palette
3. **Keep it consistent** - Use the same spacing/typography
4. **Make it responsive** - Mobile-first approach
5. **Add animations** - Subtle transitions enhance UX

## Tailwind UI Access

For official Tailwind UI components:
- Visit https://tailwindui.com
- Browse component categories
- Copy HTML/React code
- Customize to your brand

## Resources

- [Tailwind UI](https://tailwindui.com)
- [Headless UI Docs](https://headlessui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Project Components](../components/)

