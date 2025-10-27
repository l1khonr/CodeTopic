'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalModeProps {
  onCommand: (command: string) => void;
  onClose: () => void;
}

const TERMINAL_WELCOME = `
╔═══════════════════════════════════════════════════════════╗
║          Welcome to Codetopic Terminal v1.0.0             ║
║                                                           ║
║  Type 'help' for available commands                       ║
║  Type 'exit' to return to normal mode                     ║
╚═══════════════════════════════════════════════════════════╝
`;

const TERMINAL_COMMANDS = {
  help: `Available commands:
  help          - Show this help message
  clear         - Clear terminal
  joke          - Get a random developer joke
  quiz          - Start code quiz
  typing        - Start typing game
  matrix        - Enable Matrix mode
  party         - Party mode!
  stats         - Show system statistics
  whoami        - Display user information
  date          - Show current date and time
  cowsay [text] - Make the cow say something
  exit          - Exit terminal mode`,
  
  whoami: 'root@codetopic ~ $ You are a legendary developer!',
  
  date: () => new Date().toString(),
  
  stats: `System Statistics:
  OS: Browser
  Platform: ${navigator.platform}
  User Agent: ${navigator.userAgent.substring(0, 50)}...
  Online: ${navigator.onLine ? 'Yes' : 'No'}
  Memory: ${(window.performance as any).memory ? ((window.performance as any).memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB' : 'N/A'}`,
  
  cowsay: (text: string) => `
   ${'-'.repeat(text.length + 2)}
  < ${text} >
   ${'-'.repeat(text.length + 2)}
      \\   ^__^
       \\  (oo)\\_______
          (__)\\       )\\/\\
              ||----w |
              ||     ||`,
};

export function TerminalMode({ onCommand, onClose }: TerminalModeProps) {
  const [history, setHistory] = useState<string[]>([TERMINAL_WELCOME]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory((prev) => [...prev, `$ ${trimmedCmd}`]);
    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const [command, ...args] = trimmedCmd.split(' ');
    const argument = args.join(' ');

    if (command === 'exit') {
      onClose();
      return;
    }

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (command === 'cowsay') {
      const text = argument || 'Moo!';
      setHistory((prev) => [...prev, TERMINAL_COMMANDS.cowsay(text)]);
      return;
    }

    if (command === 'date') {
      setHistory((prev) => [...prev, TERMINAL_COMMANDS.date()]);
      return;
    }

    if (command in TERMINAL_COMMANDS) {
      const response = TERMINAL_COMMANDS[command as keyof typeof TERMINAL_COMMANDS];
      setHistory((prev) => [...prev, typeof response === 'string' ? response : response()]);
    } else {
      setHistory((prev) => [...prev, `Command not found: ${command}. Type 'help' for available commands.`]);
    }

    onCommand(trimmedCmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const commands = Object.keys(TERMINAL_COMMANDS);
      const matches = commands.filter((cmd) => cmd.startsWith(input));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black z-50 flex flex-col p-4 font-mono text-green-400"
    >
      <div className="flex justify-between items-center mb-2 border-b border-green-700 pb-2">
        <h1 className="text-lg font-bold">Codetopic Terminal</h1>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-400 font-bold"
        >
          [X] CLOSE
        </button>
      </div>

      <div
        ref={historyRef}
        className="flex-1 overflow-y-auto mb-2 text-sm whitespace-pre-wrap break-words"
      >
        {history.map((line, i) => (
          <div key={i} className="mb-1">
            {line}
          </div>
        ))}
      </div>

      <div className="flex items-center border-t border-green-700 pt-2">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-green-400"
          autoFocus
        />
        <span className="animate-pulse">▊</span>
      </div>

      <div className="text-xs text-green-700 mt-2">
        Press TAB for autocomplete | ↑/↓ for history | Type 'help' for commands
      </div>
    </motion.div>
  );
}

