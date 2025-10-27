/**
 * Next.js ChatGPT SDK Bootstrap
 * Patches browser APIs for iframe embedding
 */

'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __NEXT_CHAT_SDK_BASE_URL__?: string;
  }
}

export function NextChatSDKBootstrap({ baseUrl }: { baseUrl: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Store base URL globally
    window.__NEXT_CHAT_SDK_BASE_URL__ = baseUrl;

    // Patch history.pushState and history.replaceState
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const url = args[2];
      if (typeof url === 'string' && !url.startsWith('http')) {
        args[2] = new URL(url, baseUrl).toString();
      }
      return originalPushState.apply(window.history, args);
    };

    window.history.replaceState = function (...args) {
      const url = args[2];
      if (typeof url === 'string' && !url.startsWith('http')) {
        args[2] = new URL(url, baseUrl).toString();
      }
      return originalReplaceState.apply(window.history, args);
    };

    // Patch window.fetch for same-origin requests
    const originalFetch = window.fetch;
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      if (typeof input === 'string') {
        try {
          const url = new URL(input, window.location.origin);
          if (url.origin === window.location.origin) {
            // Rewrite same-origin requests to use base URL
            input = new URL(url.pathname + url.search, baseUrl).toString();
          }
        } catch {
          // Invalid URL, use as-is
        }
      }
      return originalFetch.call(this, input, init);
    };

    // Patch HTML attribute observer to prevent ChatGPT from modifying root element
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.target === document.documentElement) {
            // Revert any changes to <html> element
            mutation.target.removeAttribute('class');
            mutation.target.removeAttribute('style');
            mutation.target.removeAttribute('data-theme');
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-theme'],
      });
    }

    // Cleanup
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.fetch = originalFetch;
    };
  }, [baseUrl]);

  return null;
}

