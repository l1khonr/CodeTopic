# Radix UI Primitives - Complete Control Over Styling

## What are Radix Primitives?

Radix UI provides **headless, unstyled, accessible components** that work with any styling solution. shadcn/ui builds on top of these primitives, adding Tailwind CSS.

## Why Radix?

✅ **Unstyled** - Complete control over appearance  
✅ **Accessible** - Keyboard navigation, ARIA attributes  
✅ **Composable** - Build complex UIs from simple primitives  
✅ **Framework Agnostic** - Works with any CSS solution  
✅ **Production Ready** - Used by companies like GitHub, Linear

## Radix Primitives in This Project

### Available Primitives

- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-select` - Select components
- `@radix-ui/react-tabs` - Tab navigation
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-accordion` - Accordion UI
- `@radix-ui/react-alert-dialog` - Alert dialogs
- `@radix-ui/react-toast` - Toast notifications

### Creating Custom Radix Components

Instead of using shadcn/ui, you can build your own:

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { styled } from 'tailwindcss';

// Create a custom dialog
const StyledOverlay = styled(Dialog.Overlay, 'fixed inset-0 bg-black/50');
const StyledContent = styled(Dialog.Content, 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg');

function CustomDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <StyledOverlay />
      <StyledContent>
        <Dialog.Title>Custom Dialog</Dialog.Title>
        <Dialog.Description>Completely styled by you!</Dialog.Description>
      </StyledContent>
    </Dialog.Root>
  );
}
```

## Styling Options

### 1. Tailwind CSS (Current Setup)

```tsx
<div className="rounded-lg p-4 bg-white shadow-lg">
  {/* Your content */}
</div>
```

### 2. CSS Modules

```tsx
import styles from './dialog.module.css';

<Dialog.Overlay className={styles.overlay} />
```

### 3. Styled Components

```tsx
import styled from 'styled-components';

const StyledOverlay = styled(Dialog.Overlay)`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
`;
```

### 4. CSS-in-JS

```tsx
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
};

<Dialog.Overlay style={overlayStyle} />
```

### 5. Zero Runtime (Vanilla Extract, Tailwind)

```tsx
// Completely unstyled, add your own CSS
<div className="my-custom-dialog">
  <Dialog.Root>...</Dialog.Root>
</div>
```

## Custom Component Examples

### Unstyled Dialog

```tsx
import * as Dialog from '@radix-ui/react-dialog';

export function UnstyledDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn-primary">
        Open Dialog
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">
            Custom Title
          </Dialog.Title>
          
          <Dialog.Description className="dialog-description">
            Your custom description
          </Dialog.Description>
          
          <Dialog.Close className="dialog-close">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Custom Select

```tsx
import * as Select from '@radix-ui/react-select';

export function CustomSelect() {
  return (
    <Select.Root>
      <Select.Trigger className="custom-select-trigger">
        <Select.Value placeholder="Choose..." />
        <Select.Icon />
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content className="custom-select-content">
          <Select.Viewport>
            <Select.Item value="option1" className="custom-select-item">
              <Select.ItemText>Option 1</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

## Accessibility Features

Radix handles accessibility automatically:

- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Proper focus trapping
- **ARIA Attributes** - Screen reader support
- **Touch Gestures** - Mobile-friendly
- **Portal Rendering** - Proper z-index management

## Using Radix with shadcn/ui

shadcn/ui = Radix Primitives + Tailwind CSS

To customize shadcn/ui components:

```tsx
// Copy the component from shadcn
// Modify the styling as needed
// Your component now has full control

import * as Dialog from '@radix-ui/react-dialog';

export function MyCustomDialog() {
  return (
    <Dialog.Root>
      {/* Custom implementation */}
    </Dialog.Root>
  );
}
```

## Best Practices

1. **Start with shadcn/ui** - Fast development
2. **Customize when needed** - Extend shadcn components
3. **Build from scratch** - For unique requirements
4. **Maintain accessibility** - Use Radix props
5. **Keep it unstyled** - Add your own CSS

## Animation Support

### CSS Animations

The project includes pre-built animations in `app/animations.css`:

- Dialog fade and slide
- Popover scale
- Toast slide
- Dropdown fade-in-up
- Tab content fade
- Tooltip fade

### React Spring Integration

```tsx
import { AnimatedDialog } from '@/components/animated-dialog';
import { useSpringAnimation } from '@/components/animated-dialog';

function MyComponent() {
  const styles = useSpringAnimation(true);

  return (
    <animated.div style={styles}>
      <AnimatedDialog title="Animated!" />
    </animated.div>
  );
}
```

### Custom Animations

Create your own animations:

```css
@keyframes my-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}

[data-state="open"] {
  animation: my-animation 300ms ease-out;
}
```

## Radix Icons

The project includes @radix-ui/react-icons:

```tsx
import { FaceIcon, SunIcon, ImageIcon } from '@radix-ui/react-icons';

<FaceIcon className="h-6 w-6" />
```

See `components/icon-showcase.tsx` for examples.

## Resources

- [Radix UI Docs](https://www.radix-ui.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [This Project Components](../components/)

## Your Project

This project uses:
- **shadcn/ui** for most components
- **Radix Primitives** directly for custom needs
- **Tailwind CSS** for styling
- **Geist** for typography
- **Complete control** over appearance

