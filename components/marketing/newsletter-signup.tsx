/**
 * Newsletter Signup Form Component
 * Email collection with beautiful UI
 */

'use client';

import { useState } from 'react';
import * as icons from '@radix-ui/react-icons';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // In production, integrate with your email service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-primary py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-heading-32 font-bold tracking-tight font-serif text-primary-foreground">
            Stay in the loop
          </h2>
          <p className="mt-4 text-copy-16 text-primary-foreground/90">
            Get the latest updates on AI agents, workflows, and more.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 sm:flex sm:max-w-md">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-4 py-3 text-copy-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground sm:text-copy-16"
            />
            <div className="mt-4 sm:ml-4 sm:flex-shrink-0 sm:flex-shrink sm:mt-0">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-foreground px-6 py-3 text-copy-14 font-medium text-primary hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 sm:text-copy-16 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <icons.ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>Subscribe</>
                )}
              </button>
            </div>
          </form>
          
          {status === 'success' && (
            <div className="mt-4 flex items-center justify-center text-copy-14 text-primary-foreground">
              <icons.CheckIcon className="mr-2 h-4 w-4" />
              Thanks for subscribing!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

