'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRightIcon, CodeIcon, LightningBoltIcon, RocketIcon } from '@radix-ui/react-icons';

export function CodetopicHero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex justify-center lg:justify-start py-6">
          <Image 
            src="/CODETOPIC.png" 
            alt="Codetopic Logo" 
            width={48}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>

        <div className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-24 lg:max-w-2xl lg:w-full">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl font-serif">
              <span className="block xl:inline">Your Intelligent</span>{' '}
              <span className="block text-primary xl:inline">Coding Partner</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Experience coding reimagined with Codetopic AI. Our XML-powered AI agent understands your code deeply, providing intelligent suggestions, documentation, and automation across all major programming languages.
            </p>
            
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <a
                  href="#get-started"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Get Started
                  <ArrowRightIcon className={`ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="#demo"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg md:px-10"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<CodeIcon className="h-6 w-6" />}
              title="Structured Intelligence"
              description="XML-powered system prompts for precise and context-aware coding assistance"
            />
            <Feature
              icon={<LightningBoltIcon className="h-6 w-6" />}
              title="Smart Adaptation"
              description="AI agent that learns and adapts to your coding style and preferences"
            />
            <Feature
              icon={<RocketIcon className="h-6 w-6" />}
              title="Full Stack Support"
              description="Expert assistance across frontend, backend, and DevOps tasks"
            />
            <Feature
              icon={<LightningBoltIcon className="h-6 w-6" />}
              title="Code Analysis"
              description="Deep understanding of code patterns and architectural best practices"
            />
            <Feature
              icon={<CodeIcon className="h-6 w-6" />}
              title="Documentation Pro"
              description="Automated documentation generation with XML-structured clarity"
            />
            <Feature
              icon={<RocketIcon className="h-6 w-6" />}
              title="Automation Hub"
              description="Streamline workflows and eliminate repetitive coding tasks"
            />
          </div>
        </div>
      </div>

      {/* Decorative background pattern */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/15),transparent)]" />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <dl className="relative">
      <dt className="flex items-center space-x-3">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
          {icon}
        </div>
        <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{title}</p>
      </dt>
      <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">{description}</dd>
    </dl>
  );
}