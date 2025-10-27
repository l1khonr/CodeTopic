# ChatGPT Design Guidelines

Complete implementation of ChatGPT's design system for inline cards, carousels, fullscreen, and picture-in-picture experiences.

## Components

### 1. Inline Card (`components/chatgpt/inline-card.tsx`)

Lightweight display embedded above model responses.

**Features:**
- Optional title
- Expand to fullscreen
- Show more for additional items
- Edit controls for inline edits
- Up to 2 primary actions

**Usage:**
```tsx
<InlineCard
  title="Search Results"
  expandable
  onExpand={() => setFullscreen(true)}
  primaryAction={{ label: 'Select', onClick: handleSelect }}
  secondaryAction={{ label: 'Cancel', onClick: handleCancel }}
>
  {/* Your content */}
</InlineCard>
```

**Rules:**
- ✅ Limit to 2 actions maximum
- ✅ No deep navigation or multiple views
- ✅ No nested scrolling
- ✅ No duplicative ChatGPT features

### 2. Inline Carousel (`components/chatgpt/inline-carousel.tsx`)

Side-by-side cards for scanning multiple similar items.

**Features:**
- Image + title + metadata
- Optional badge
- Single CTA per item
- Horizontal scrolling

**Usage:**
```tsx
<InlineCarousel
  title="Restaurants Nearby"
  items={[
    {
      id: '1',
      image: '/restaurant.jpg',
      title: 'Pizza Palace',
      metadata: ['Italian • $$', '4.5 ★ (234 reviews)'],
      badge: 'Popular',
      action: { label: 'Book', onClick: handleBook },
    },
  ]}
/>
```

**Rules:**
- ✅ 3-8 items per carousel
- ✅ 3 lines max of metadata
- ✅ Single optional CTA per card
- ✅ Consistent visual hierarchy

### 3. Fullscreen (`components/chatgpt/fullscreen.tsx`)

Immersive experience for rich tasks and exploration.

**Features:**
- Full viewport experience
- System close button
- ChatGPT composer overlay
- Conversational context maintained

**Usage:**
```tsx
<Fullscreen
  isOpen={isFullscreen}
  onClose={() => setIsFullscreen(false)}
  title="Interactive Map"
  showComposer
>
  {/* Rich interactive content */}
</Fullscreen>
```

**Rules:**
- ✅ Design for system composer presence
- ✅ Support conversational prompts
- ✅ Use for deepening engagement
- ✅ Not for replicating native app

### 4. Picture-in-Picture (`components/chatgpt/picture-in-picture.tsx`)

Persistent floating window for ongoing sessions.

**Features:**
- Auto-pins on scroll
- Stays visible during conversation
- Updates based on chat input
- Auto-closes when session ends

**Usage:**
```tsx
<PictureInPicture
  isActive={gameActive}
  onClose={() => setGameActive(false)}
  title="Word Game"
>
  {/* Live game content */}
</PictureInPicture>
```

**Rules:**
- ✅ Updates/responds to composer input
- ✅ Closes automatically when done
- ✅ Minimal controls
- ✅ Not for static content

## Visual Design

### Color

Use system colors for consistency:

```css
/* Text */
--foreground: System text color
--muted-foreground: Secondary text

/* Backgrounds */
--background: System background
--muted: Secondary background

/* Borders */
--border: System border color
```

**Rules:**
- ✅ Use system colors for UI elements
- ✅ Brand colors only for accents (badges, icons)
- ❌ Don't override text or background colors
- ❌ No custom gradients or patterns

### Typography

Uses system fonts:
- iOS: SF Pro
- Android: Roboto
- Web: System font stack

**Rules:**
- ✅ Inherit system font stack
- ✅ Use system sizing (body, body-small)
- ✅ Bold/italic only in content areas
- ❌ No custom fonts, even in fullscreen

### Spacing & Layout

```css
/* System spacing */
padding: 12px 16px;
gap: 8px;
border-radius: 8px;
```

**Rules:**
- ✅ Use system grid spacing
- ✅ Consistent padding (avoid cramming)
- ✅ Respect system corner rounds
- ✅ Clear visual hierarchy

### Icons & Imagery

**Rules:**
- ✅ Use system icons or monochromatic outlined icons
- ❌ Don't include your logo (ChatGPT adds it)
- ✅ Follow enforced aspect ratios
- ✅ Provide alt text for images

## Accessibility

**Requirements:**
- ✅ WCAG AA contrast ratio minimum
- ✅ Alt text for all images
- ✅ Support text resizing
- ✅ Keyboard navigation
- ✅ Screen reader support

## Tone & Proactivity

### Content Guidelines

- Keep content concise and scannable
- Context-driven responses
- Avoid spam, jargon, promotions
- Focus on helpfulness over brand

### Proactivity

**Allowed:**
- ✅ "Your order is ready for pickup"
- ✅ "Your ride is arriving"

**Not Allowed:**
- ❌ "Check out our latest deals"
- ❌ "Haven't used us in a while?"

## Examples

See `components/chatgpt/` for complete implementations:
- `inline-card.tsx` - Basic card with actions
- `inline-carousel.tsx` - Multi-item browsing
- `fullscreen.tsx` - Immersive experiences
- `picture-in-picture.tsx` - Persistent sessions

## Testing

Test your components in ChatGPT context:

1. Ensure they work in iframe
2. Test with system composer
3. Verify accessibility
4. Check on mobile viewports
5. Test dark mode

## Resources

- [ChatGPT Design Guidelines](https://platform.openai.com/docs/chatgpt-design)
- [Project Components](../components/chatgpt/)
- [MCP Integration](./CHATGPT_INTEGRATION.md)

