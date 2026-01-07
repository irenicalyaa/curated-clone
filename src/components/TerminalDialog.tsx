import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface TerminalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TerminalLine {
  type: 'input' | 'output';
  content: string;
}

const OPENROUTER_API_KEY = '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';

const TerminalDialog = ({ open, onOpenChange }: TerminalDialogProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to alisaa\'s terminal. Type "help" for commands.' },
  ]);
  const [chatMode, setChatMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const sendChatMessage = async (message: string) => {
    setIsLoading(true);
    setHistory(prev => [
      ...prev,
      { type: 'input', content: `> ${message}` },
      { type: 'output', content: '🤖 Thinking...' },
    ]);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'alisaa terminal',
        },
        body: JSON.stringify({
          model: 'z-ai/glm-4.5-air:free',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant in a terminal. Keep responses concise and terminal-friendly. Use simple text formatting.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { type: 'output', content: `🤖 ${content}` };
          return newHistory;
        });
      } else {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { type: 'output', content: '🤖 No response received.' };
          return newHistory;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { type: 'output', content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to get response.'}` };
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();

    // If in chat mode, handle chat commands
    if (chatMode) {
      if (command === 'exit' || command === 'quit') {
        setChatMode(false);
        setHistory(prev => [
          ...prev,
          { type: 'input', content: `> ${cmd}` },
          { type: 'output', content: '👋 Exited chatbot mode. Type "help" for commands.' },
        ]);
        setInput('');
        return;
      }
      
      // Send message to AI
      sendChatMessage(cmd);
      setInput('');
      return;
    }

    let response: string;

    switch (command) {
      case 'help':
        response = `Available commands:
  1. server   - Discord server invite
  2. about    - About me
  3. webinfo  - Website information
  4. discord  - My Discord username
  5. chatbot  - Start AI chatbot
  6. clear    - Clear terminal`;
        break;
      case 'server':
        response = '🎮 Discord Server: discord.gg/aerox';
        break;
      case 'about':
        response = `👤 About Me:
  Name: Alya
  Age: 20
  Profession: Graphic Design / Web Development`;
        break;
      case 'webinfo':
        response = `🌐 Website Info:
  Inspiration: cursi.ng
  Created by: Alya`;
        break;
      case 'discord':
        response = '💬 Discord: arcticayl';
        break;
      case 'chatbot':
        setChatMode(true);
        response = `🤖 Chatbot mode enabled!
  Type your message to chat with AI.
  Type "exit" or "quit" to leave chatbot mode.`;
        break;
      case 'clear':
        setHistory([{ type: 'output', content: 'Terminal cleared. Type "help" for commands.' }]);
        setInput('');
        return;
      default:
        response = `Command not found: "${command}". Type "help" for available commands.`;
    }

    setHistory(prev => [
      ...prev,
      { type: 'input', content: `> ${cmd}` },
      { type: 'output', content: response },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim() && !isLoading) {
      handleCommand(input);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-0 text-foreground max-w-md p-0 overflow-hidden">
        <div className="bg-background/80 px-3 py-2 border-b border-border/30 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            terminal {chatMode && '(chatbot)'}
          </span>
        </div>
        <div 
          ref={containerRef}
          className="p-3 font-mono text-xs max-h-64 overflow-y-auto space-y-1"
        >
          {history.map((line, index) => (
            <div 
              key={index} 
              className={line.type === 'input' ? 'text-primary' : 'text-muted-foreground whitespace-pre-wrap'}
            >
              {line.content}
            </div>
          ))}
          <div className="flex items-center gap-1">
            <span className="text-primary">{chatMode ? '🤖>' : '>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground font-mono"
              placeholder={chatMode ? 'ask me anything...' : 'type a command...'}
              autoComplete="off"
              spellCheck={false}
              disabled={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TerminalDialog;