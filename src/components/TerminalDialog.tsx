import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface TerminalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TerminalLine {
  type: 'input' | 'output';
  content: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TerminalDialog = ({ open, onOpenChange }: TerminalDialogProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Alyaa\'s terminal. Type "help" for commands.' },
  ]);
  const [chatMode, setChatMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
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
      { type: 'output', content: '✨ Silvia is thinking...' },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message, chatHistory },
      });

      if (error) {
        console.error('Chatbot error:', error);
        throw new Error(error.message || 'Failed to get response');
      }

      const content = data?.content;

      if (content) {
        // Update chat history for memory
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: content },
        ]);

        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { type: 'output', content: `✨ Silvia: ${content}` };
          return newHistory;
        });
      } else {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { type: 'output', content: '✨ Silvia: No response received.' };
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
  5. chatbot  - Start AI chatbot (Silvia)
  6. clear    - Clear terminal`;
        break;
      case 'server':
        response = '🎮 Discord Server: discord.gg/aerox';
        break;
      case 'about':
        response = `👤 About Me:
  Name: Alyaa (Alisaa)
  Age: 20
  Profession: Graphic Design / Web Development`;
        break;
      case 'webinfo':
        response = `🌐 Website Info:
  Inspiration: cursi.ng
  Created by: Alyaa (Alisaa)
  AI Assistant: Silvia`;
        break;
      case 'discord':
        response = '💬 Discord: arcticayl';
        break;
      case 'chatbot':
        setChatMode(true);
        response = `✨ Silvia activated!
  Hi! I'm Silvia, Alyaa's AI assistant.
  Ask me anything about Alyaa or the website!
  Type "exit" or "quit" to leave chat mode.`;
        break;
      case 'clear':
        setHistory([{ type: 'output', content: 'Terminal cleared. Type "help" for commands.' }]);
        setChatHistory([]); // Also clear chat memory
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
            terminal {chatMode && '(Silvia ✨)'}
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
            <span className="text-primary">{chatMode ? '✨>' : '>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground font-mono"
              placeholder={chatMode ? 'ask Silvia anything...' : 'type a command...'}
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
