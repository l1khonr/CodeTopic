/**
 * Terminal styling utilities following style guidelines
 */

// ANSI escape codes
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// Foreground colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';

export type StyleOptions = {
  bold?: boolean;
  dim?: boolean;
  color?: 'default' | 'cyan' | 'green' | 'red' | 'magenta';
};

/**
 * Applies styling to text following the style guide
 */
export const style = (text: string, options: StyleOptions = {}): string => {
  let styled = '';
  
  // Apply weight
  if (options.bold) styled += BOLD;
  if (options.dim) styled += DIM;
  
  // Apply color
  switch (options.color) {
    case 'cyan':
      styled += CYAN;
      break;
    case 'green':
      styled += GREEN;
      break;
    case 'red':
      styled += RED;
      break;
    case 'magenta':
      styled += MAGENTA;
      break;
  }
  
  // Add text and reset
  styled += text + RESET;
  return styled;
};

// Header styling
export const header = (text: string): string => {
  return style(text, { bold: true });
};

// Secondary text styling
export const secondary = (text: string): string => {
  return style(text, { dim: true });
};

// Success message styling
export const success = (text: string): string => {
  return style(text, { color: 'green' });
};

// Error message styling
export const error = (text: string): string => {
  return style(text, { color: 'red' });
};

// User input/selection styling
export const userInput = (text: string): string => {
  return style(text, { color: 'cyan' });
};

// Codex styling
export const codex = (text: string): string => {
  return style(text, { color: 'magenta' });
};

// Helper for status indicators
export const status = (text: string, type: 'success' | 'error' | 'info'): string => {
  switch (type) {
    case 'success':
      return success(`✓ ${text}`);
    case 'error':
      return error(`✗ ${text}`);
    case 'info':
      return userInput(`ℹ ${text}`);
  }
};