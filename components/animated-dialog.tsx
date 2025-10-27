/**
 * Animated Dialog Component using Radix + React Spring
 * Demonstrates JavaScript animation library integration
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useTransition, animated, config } from 'react-spring';
import { useSpring, a } from '@react-spring/web';
import * as icons from '@radix-ui/react-icons';

interface AnimatedDialogProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function AnimatedDialog({
  trigger,
  title,
  description,
  children,
}: AnimatedDialogProps) {
  const [open, setOpen] = React.useState(false);

  const transitions = useTransition(open, {
    from: { opacity: 0, y: -20, scale: 0.9 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: -20, scale: 0.9 },
    config: config.stiff,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || <button className="btn-primary">Open Dialog</button>}
      </Dialog.Trigger>

      {transitions((styles, item) =>
        item ? (
          <>
            <Dialog.Portal>
              <Dialog.Overlay forceMount asChild>
                <animated.div
                  style={{ opacity: styles.opacity }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />
              </Dialog.Overlay>

              <Dialog.Content forceMount asChild>
                <animated.div
                  style={{
                    opacity: styles.opacity,
                    transform: styles.y.to((y) => `translate(-50%, ${y}px) scale(${styles.scale})`),
                  }}
                  className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none dark:bg-brand-black"
                >
                  {title && (
                    <Dialog.Title className="mb-4 font-serif text-xl font-bold">
                      {title}
                    </Dialog.Title>
                  )}

                  {description && (
                    <Dialog.Description className="mb-4 text-sm text-muted-foreground">
                      {description}
                    </Dialog.Description>
                  )}

                  {children}

                  <Dialog.Close asChild>
                    <button className="absolute right-4 top-4 opacity-70 hover:opacity-100">
                      <icons.Cross2Icon />
                      <span className="sr-only">Close</span>
                    </button>
                  </Dialog.Close>
                </animated.div>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        ) : null,
      )}
    </Dialog.Root>
  );
}

/**
 * Spring-based animation hook for any component
 */
export function useSpringAnimation(active: boolean) {
  const styles = useSpring({
    opacity: active ? 1 : 0,
    y: active ? 0 : -20,
    config: config.gentle,
  });

  return styles;
}

/**
 * Animated wrapper component using Spring
 */
export function AnimatedWrapper({
  children,
  className,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  const styles = useSpringAnimation(active ?? true);

  return (
    <a.div
      className={className}
      style={{
        opacity: styles.opacity,
        transform: styles.y.to((y) => `translateY(${y}px)`),
      }}
    >
      {children}
    </a.div>
  );
}

