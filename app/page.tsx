'use client';

import { useState } from 'react';
import { CodetopicHero } from '@/components/marketing/codetopic-hero';
import { FeatureShowcase } from '@/components/marketing/feature-showcase';
import { Message } from 'ai';
import { nanoid } from 'nanoid';

/**
 * Main Home component that renders the Codetopic AI chat application
 *
 * Features:
 * - Hero section with marketing content
 * - Feature showcase section
 * - Interactive chat interface with AI
 * - Real-time message handling and display
 */
export default function Home() {
  // State for managing chat messages - array of Message objects from AI SDK
  const [messages, setMessages] = useState<Message[]>([]);

  // Loading state to show spinner and disable inputs during API calls
  const [loading, setLoading] = useState(false);

  /**
   * Handles sending a message to the Codetopic AI API
   * Manages the complete message flow: user message -> API call -> AI response
   *
   * @param message - The user's input message string
   */
  const handleMessage = async (message: string) => {
    try {
      // Set loading state to true and add user message to chat
      setLoading(true);
      const newMessage: Message = { id: nanoid(), role: 'user', content: message };
      setMessages(prev => [...prev, newMessage]);

      // Make API call to Codetopic endpoint with current messages
      const response = await fetch('/api/codetopic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] })
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Parse response and add AI message to chat
      const data = await response.json();
      const aiMessage: Message = { id: nanoid(), ...data.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Log errors for debugging
      console.error('Error sending message:', error);
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  /**
   * Render the complete UI layout with hero, features, and chat interface
   */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Marketing banner with main value proposition */}
      <CodetopicHero />

      {/* Feature Showcase - Display key features and capabilities */}
      <FeatureShowcase />

      {/* Chat Interface - Main interactive AI chat section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
          {/* Messages Display Area - Scrollable chat history */}
          <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary/10 ml-auto max-w-[80%]'
                    : 'bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]'
                }`}
              >
                <p className="text-gray-900 dark:text-white">{msg.content}</p>
              </div>
            ))}
            {/* Loading Spinner - Shows while waiting for AI response */}
            {loading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Message Input Form - User input and send functionality */}
          <div className="mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('message') as HTMLInputElement;
                if (input.value.trim()) {
                  handleMessage(input.value);
                  input.value = '';
                }
              }}
              className="flex space-x-4"
            >
              <input
                type="text"
                name="message"
                placeholder="Ask Codetopic AI..."
                className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
