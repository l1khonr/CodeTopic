import { tool } from 'ai';
import { z } from 'zod';

/**
 * Weather Tool - Get current weather for a location
 */
export const weatherTool = tool({
  description: 'Get the current weather for a specific location',
  parameters: z.object({
    location: z.string().describe('The city and state/country, e.g. "San Francisco, CA"'),
  }),
  execute: async ({ location }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tools/weather?location=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        error: 'Failed to fetch weather data',
        location,
      };
    }
  },
});

/**
 * Calculate Tool - Perform mathematical calculations
 */
export const calculateTool = tool({
  description: 'Perform mathematical calculations',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 2", "sqrt(16)")'),
  }),
  execute: async ({ expression }) => {
    try {
      // Use a safe math evaluator (in production, use a library like mathjs)
      const result = Function(`"use strict"; return (${expression})`)();
      return {
        expression,
        result,
      };
    } catch (error) {
      return {
        error: 'Invalid mathematical expression',
        expression,
      };
    }
  },
});

/**
 * Search Tool - Search the web for information
 */
export const searchTool = tool({
  description: 'Search the internet for current information',
  parameters: z.object({
    query: z.string().describe('Search query'),
  }),
  execute: async ({ query }) => {
    // In production, use a search API like Tavily, Serper, or Tavily
    return {
      query,
      results: [
        {
          title: `Information about: ${query}`,
          url: 'https://example.com',
          snippet: `This is information about ${query}`,
        },
      ],
      note: 'Using mock search results. Integrate with a real search API in production.',
    };
  },
});

/**
 * All available tools
 */
export const tools = {
  weather: weatherTool,
  calculate: calculateTool,
  search: searchTool,
};

