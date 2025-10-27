/**
 * Hero Section Component
 * Perfect for landing pages and marketing sites
 */

'use client';

import * as icons from '@radix-ui/react-icons';
import { ChatBubbleIcon, LightningBoltIcon, RocketIcon } from '@radix-ui/react-icons';

export function HeroSection() {
  return (
    <div className="relative bg-white dark:bg-brand-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-heading-48 tracking-tight font-extrabold font-serif text-foreground sm:text-heading-56 md:text-heading-64">
                <span className="block xl:inline">AI that doesn't just</span>{' '}
                <span className="block text-primary xl:inline">answer questions</span>{' '}
                <span className="block xl:inline">it executes work</span>
              </h1>
              <p className="mt-6 text-copy-18 text-muted-foreground sm:mt-8 sm:text-copy-20 lg:text-left">
                Transform your AI from a chatbot into an action engine. Connect to GitHub, Notion, 
                Slack, and more. Execute workflows, not just conversations.
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90">
                    Get started
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-secondary px-8 py-3 text-base font-medium text-secondary-foreground hover:bg-secondary/90">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-y-0 right-0 w-screen bg-gray-50 dark:bg-gray-900 lg:w-full lg:pl-10" />
    </div>
  );
}

