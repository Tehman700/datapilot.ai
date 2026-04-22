import { Send, Sparkles, CheckCircle2, Undo2 } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  biasChange?: { from: number; to: number };
  timestamp: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onUndo: (messageId: string) => void;
}

export function ChatPanel({ messages, onSendMessage, onUndo }: ChatPanelProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full transition-colors duration-300">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.type === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-[70%] px-4 py-3 rounded-2xl bg-muted border border-border">
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#A3E635] to-[#10B981] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#0A0A0A]" />
                </div>
                <div className="flex-1">
                  <div className="max-w-[85%] p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{message.content}</p>
                        {message.biasChange && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Bias score:</span>
                            <span className="text-xs text-muted-foreground line-through">
                              {message.biasChange.from.toFixed(2)}
                            </span>
                            <span className="text-xs text-[#A3E635]">→</span>
                            <span className="text-xs text-[#10B981] font-semibold">
                              {message.biasChange.to.toFixed(2)}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] font-medium">
                              -{(message.biasChange.from - message.biasChange.to).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onUndo(message.id)}
                    className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-[#3B82F6] transition-colors"
                  >
                    <Undo2 className="h-3 w-3" />
                    Undo action
                  </button>
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground px-2">
              {message.timestamp}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to modify dataset..."
            className="w-full px-6 py-4 pr-14 rounded-[20px] bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#A3E635] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#A3E635] hover:bg-[#10B981] disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="h-5 w-5 text-[#0A0A0A]" />
          </button>
        </form>
      </div>
    </div>
  );
}
