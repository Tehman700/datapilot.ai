import { Send, Sparkles, CheckCircle2, Undo2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [input, setInput]     = useState('');
  const [focused, setFocused] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) { onSendMessage(input); setInput(''); }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full transition-colors duration-300">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx === 0 ? 0 : 0 }}
              className="space-y-2"
            >
              {message.type === 'user' ? (
                <div className="flex justify-end">
                  <motion.div
                    initial={{ x: 20 }} animate={{ x: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[70%] px-4 py-3 rounded-sm bg-muted border border-border"
                  >
                    <p className="text-sm text-foreground">{message.content}</p>
                  </motion.div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex-shrink-0 h-8 w-8 rounded-sm flex items-center justify-center"
                    style={{ background: '#1710E6', boxShadow: '0 0 16px rgba(23,16,230,0.2)' }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: '#f6f4ef' }} />
                  </motion.div>

                  <div className="flex-1">
                    <motion.div
                      initial={{ x: -16 }} animate={{ x: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-[85%] p-4 rounded-sm bg-card border border-border"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#8DC651' }} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{message.content}</p>
                          {message.biasChange && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.35 }}
                              className="mt-3 flex items-center gap-2"
                            >
                              <span className="text-xs text-muted-foreground">Bias score:</span>
                              <span className="text-xs text-muted-foreground line-through">{message.biasChange.from.toFixed(2)}</span>
                              <span className="text-xs" style={{ color: '#8DC651' }}>→</span>
                              <span className="text-xs font-semibold" style={{ color: '#8DC651' }}>{message.biasChange.to.toFixed(2)}</span>
                              <motion.span
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
                                className="text-xs px-2 py-1 rounded-sm font-medium"
                                style={{ background: 'rgba(141,198,81,0.15)', color: '#0e0e12', border: '1px solid rgba(141,198,81,0.4)' }}
                              >
                                -{(message.biasChange.from - message.biasChange.to).toFixed(2)}
                              </motion.span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      onClick={() => onUndo(message.id)}
                      whileHover={{ x: -2 }}
                      className="mt-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1710E6')}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}
                    >
                      <Undo2 className="h-3 w-3" />
                      Undo action
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground px-2">{message.timestamp}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        className="p-6 border-t border-border"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <motion.input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask AI to modify dataset..."
            animate={{ borderColor: focused ? 'rgba(23,16,230,0.5)' : undefined }}
            className="w-full px-6 py-4 pr-14 rounded-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
            style={{ fontFamily: 'inherit' }}
          />
          <motion.button
            type="submit"
            disabled={!input.trim()}
            whileHover={input.trim() ? { scale: 1.1 } : {}}
            whileTap={input.trim() ? { scale: 0.9 } : {}}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-sm disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            style={{
              background: input.trim() ? '#1710E6' : undefined,
              border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send className="h-5 w-5" style={{ color: input.trim() ? '#f6f4ef' : undefined }} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
