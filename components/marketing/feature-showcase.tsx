'use client';

import { useState } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';

const features = [
  {
    id: 'structured-prompts',
    title: 'XML-Structured Prompts',
    description: 'Leverage the power of structured XML prompts for precise and context-aware code assistance.',
    code: `<instructions>
  <role>Codetopic AI - Expert Coding Assistant</role>
  <capabilities>
    <code-analysis>Pattern recognition</code-analysis>
    <suggestions>Intelligent code fixes</suggestions>
  </capabilities>
  <guidelines>
    <best-practices>Follow language conventions</best-practices>
  </guidelines>
</instructions>`,
  },
  {
    id: 'code-analysis',
    title: 'Intelligent Code Analysis',
    description: 'Deep understanding of code patterns, architecture, and potential improvements.',
    code: `// Sample code analysis
function analyzeCode(file: string) {
  const patterns = detectPatterns(file);
  const suggestions = generateSuggestions(patterns);
  const bestPractices = validateAgainstGuidelines(file);
  
  return {
    patterns,
    suggestions,
    bestPractices
  };
}`,
  },
  {
    id: 'auto-docs',
    title: 'Automated Documentation',
    description: 'Generate comprehensive documentation from your code automatically.',
    code: `/**
 * @name UserAuthentication
 * @description Handles user authentication workflow
 * @param {Object} credentials - User login credentials
 * @returns {Promise<AuthResult>} Authentication result
 */
async function authenticateUser(credentials) {
  // Implementation details documented automatically
}`,
  }
];

export function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <div className="bg-white dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            AI-Powered Features
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Discover how Codetopic AI revolutionizes your coding workflow
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedFeature.id === feature.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                  <ChevronRightIcon
                    className={`h-5 w-5 transform transition-transform ${
                      selectedFeature.id === feature.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                <p
                  className={`mt-2 text-sm ${
                    selectedFeature.id === feature.id
                      ? 'text-white/80'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {feature.description}
                </p>
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <div className="relative">
            <motion.div
              key={selectedFeature.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 rounded-lg p-4 overflow-hidden"
            >
              <pre className="text-sm">
                <code className="text-gray-100 font-mono whitespace-pre-wrap">
                  {selectedFeature.code}
                </code>
              </pre>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}