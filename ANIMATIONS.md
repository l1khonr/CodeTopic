# Radix UI Animations Guide

## Overview

This project includes comprehensive animation support for Radix UI primitives using both CSS and JavaScript animation libraries.

## CSS Animations

Pre-built animations are available in `app/animations.css` for:
- Dialog open/close
- Popover transitions
- Toast notifications
- Dropdown menus
- Tabs content
- Tooltips

### Usage

```css
/* Dialog animations are automatic when using data-state */
[data-radix-dialog-content][data-state="open"] {
  /* Animation is applied automatically */
}
```

## React Spring Animations

For more control, use React Spring:

```tsx
import { AnimatedDialog } from '@/components/animated-dialog';
import { useSpringAnimation } from '@/components/animated-dialog';

function MyComponent() {
  const styles = useSpringAnimation(true);

  return (
    <a.div style={styles}>
      {/* Content with spring animation */}
    </a.div>
  );
}
```

## Custom Animations

### CSS Approach

```css
@keyframes custom-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

[data-state="open"] {
  animation: custom-fade 300ms ease-out;
}
```

### JavaScript Approach (React Spring)

```tsx
import { useTransition } from 'react-spring';

const transitions = useTransition(open, {
  from: { opacity: 0, y: -10 },
  enter: { opacity: 1, y: 0 },
  leave: { opacity: 0, y: 10 },
});
```

## Animation Best Practices

1. **Keep it subtle** - 200-300ms for most animations
2. **Use easing** - `cubic-bezier(0.16, 1, 0.3, 1)` for smoothness
3. **Respect prefers-reduced-motion**
4. **Test on slow devices**
5. **Don't animate everything**

## Radix Icons

```tsx
import { FaceIcon, SunIcon } from '@radix-ui/react-icons';

function MyComponent() {
  return (
    <>
      <FaceIcon className="h-6 w-6" />
      <SunIcon className="h-6 w-6" />
    </>
  );
}
```

See `components/icon-showcase.tsx` for all available icons.

## Examples

See `components/animated-dialog.tsx` for complete implementation examples.

