import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Maximize2, Send, Bot, User, Loader } from 'lucide-react';

const WELCOME_MSG = {
  id: 'welcome',
  role: 'ai',
  text: "Hi! I'm FreshLync AI 🥬 I can help you find products, check availability, get pricing info, or answer any questions about your orders. How can I help you today?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const QUICK_PROMPTS = [
  'What fish is available today?',
  'How do I track my order?',
  'Minimum order quantities?',
  'Compare salmon prices',
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchAIResponse(message, history) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to get a response.');
  }
  const data = await res.json();
  return data.reply;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('fl_chat');
      return saved ? JSON.parse(saved) : [WELCOME_MSG];
    } catch { return [WELCOME_MSG]; }
  });
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem('fl_chat', JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => {
      const updated = [...prev, userMsg];
      // Kick off AI response with the updated history
      (async () => {
        setTyping(true);
        try {
          const historyForAI = updated.filter(m => m.id !== 'welcome');
          const reply = await fetchAIResponse(msg, historyForAI.slice(0, -1)); // exclude the just-added user msg
          setMessages(p => [...p, { id: Date.now() + 1, role: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (err) {
          setMessages(p => [...p, { id: Date.now() + 1, role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
          setTyping(false);
        }
      })();
      return updated;
    });
  };


  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const clearChat = () => { setMessages([WELCOME_MSG]); sessionStorage.removeItem('fl_chat'); };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 9999,
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #15803d, #1f9d55)',
            color: 'white', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(21, 128, 61, 0.45)',
            animation: 'chatbot-pulse 2.5s ease-in-out infinite',
            transition: 'transform 0.2s',
          }}
          title="Chat with FreshLync AI"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 9999,
          width: minimized ? 320 : 380,
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(15,23,42,0.22)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'white',
          display: 'flex', flexDirection: 'column',
          animation: 'slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #15803d, #1f9d55)',
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={20} style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>FreshLync AI</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} /> Online · Replies instantly
              </div>
            </div>
            <button onClick={clearChat} title="Clear chat" style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', fontSize: '0.7rem' }}>Clear</button>
            <button onClick={() => setMinimized(m => !m)} style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
              {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
              <X size={18} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', minHeight: 320, maxHeight: 380, background: '#f8fafc' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'ai' ? 'linear-gradient(135deg, #15803d, #1f9d55)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {msg.role === 'ai' ? <Bot size={14} style={{ color: 'white' }} /> : <User size={14} style={{ color: '#64748b' }} />}
                    </div>
                    <div style={{ maxWidth: '75%' }}>
                      <div style={{
                        padding: '0.625rem 0.875rem', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        background: msg.role === 'user' ? 'linear-gradient(135deg, #15803d, #1f9d55)' : 'white',
                        color: msg.role === 'user' ? 'white' : 'var(--color-text-main)',
                        fontSize: '0.85rem', lineHeight: 1.5,
                        boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
                        border: msg.role === 'ai' ? '1px solid var(--color-border)' : 'none',
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #15803d, #1f9d55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={14} style={{ color: 'white' }} />
                    </div>
                    <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px 16px 16px 16px', padding: '0.625rem 1rem', boxShadow: '0 2px 8px rgba(15,23,42,0.08)' }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {[0, 0.3, 0.6].map(d => (
                          <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: `typing-dot 1.2s ${d}s ease-in-out infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Prompts */}
              <div style={{ padding: '0.625rem 1rem', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto' }}>
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => sendMessage(p)} style={{ flexShrink: 0, padding: '0.3rem 0.7rem', borderRadius: 999, border: '1px solid var(--color-border)', background: 'white', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ padding: '0.875rem 1rem', background: 'white', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about products, orders, pricing..."
                  rows={1}
                  style={{ flex: 1, resize: 'none', border: '1px solid var(--color-border)', borderRadius: 12, padding: '0.6rem 0.875rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', lineHeight: 1.4, maxHeight: 100, overflowY: 'auto' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || typing}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg, #15803d, #1f9d55)' : 'var(--color-border)', color: 'white', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                >
                  {typing ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
