import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Globe, Trash2, Bot, User } from 'lucide-react';
import { supabase, type ChatMessage, getSessionId } from '../lib/supabase';
import { generateResponse, languages } from '../lib/assistant';
import { Card, Badge } from '../components/ui';

const intentBadge: Record<string, { variant: 'info' | 'success' | 'warning' | 'error' | 'neutral'; label: string }> = {
  navigation: { variant: 'info', label: 'Navigation' },
  crowd: { variant: 'warning', label: 'Crowd' },
  accessibility: { variant: 'info', label: 'Accessibility' },
  transport: { variant: 'neutral', label: 'Transport' },
  sustainability: { variant: 'success', label: 'Sustainability' },
  schedule: { variant: 'info', label: 'Schedule' },
  facilities: { variant: 'neutral', label: 'Facilities' },
  safety: { variant: 'error', label: 'Safety' },
  food: { variant: 'neutral', label: 'Food' },
  tickets: { variant: 'info', label: 'Tickets' },
  greeting: { variant: 'success', label: 'Greeting' },
  help: { variant: 'info', label: 'Help' },
  unknown: { variant: 'neutral', label: 'General' },
};

export default function AssistantView({ stadiumId }: { stadiumId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = getSessionId();

  useEffect(() => {
    supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true }).then(({ data }) => {
      if (data && data.length > 0) {
        setMessages(data);
      } else {
        const greeting = generateResponse('hello', 'en', stadiumId);
        const msg: Omit<ChatMessage, 'id' | 'created_at'> = {
          session_id: sessionId,
          role: 'assistant',
          content: greeting.content,
          language: 'en',
          intent: 'greeting',
        };
        supabase.from('chat_messages').insert(msg).then(({ data: inserted }) => {
          if (inserted && inserted[0]) setMessages([inserted[0] as ChatMessage]);
          else setMessages([{ ...msg, id: 'temp', created_at: new Date().toISOString() } as ChatMessage]);
        });
      }
    });
  }, [sessionId, stadiumId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');
    setLoading(true);

    const userMsg: Omit<ChatMessage, 'id' | 'created_at'> = {
      session_id: sessionId,
      role: 'user',
      content,
      language: lang,
      intent: null,
    };
    const { data: insertedUser } = await supabase.from('chat_messages').insert(userMsg).select('*');
    if (insertedUser && insertedUser[0]) setMessages(prev => [...prev, insertedUser[0] as ChatMessage]);

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 600));
    const response = generateResponse(content, lang, stadiumId);

    const aiMsg: Omit<ChatMessage, 'id' | 'created_at'> = {
      session_id: sessionId,
      role: 'assistant',
      content: response.content,
      language: lang,
      intent: response.intent,
    };
    const { data: insertedAi } = await supabase.from('chat_messages').insert(aiMsg).select('*');
    if (insertedAi && insertedAi[0]) setMessages(prev => [...prev, insertedAi[0] as ChatMessage]);
    setLoading(false);
  };

  const clearChat = async () => {
    await supabase.from('chat_messages').delete().eq('session_id', sessionId);
    const greeting = generateResponse('hello', lang, stadiumId);
    const msg: Omit<ChatMessage, 'id' | 'created_at'> = {
      session_id: sessionId,
      role: 'assistant',
      content: greeting.content,
      language: lang,
      intent: 'greeting',
    };
    const { data } = await supabase.from('chat_messages').insert(msg).select('*');
    setMessages(data && data[0] ? [data[0] as ChatMessage] : []);
  };

  const currentLang = languages.find(l => l.code === lang);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] animate-fade-in">
      {/* Header */}
      <Card className="p-4 mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">AI Assistant</h2>
            <p className="text-xs text-slate-400">Multilingual GenAI support — 8 languages</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setShowLangs(!showLangs)} className="btn-ghost flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{currentLang?.flag} {currentLang?.label}</span>
            </button>
            {showLangs && (
              <div className="absolute right-0 top-full mt-2 w-44 glass-card p-1 z-50 animate-slide-up">
                {languages.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLangs(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${lang === l.code ? 'bg-primary-500/15 text-primary-300' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                    <span>{l.flag}</span> {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={clearChat} className="btn-ghost flex items-center gap-2" title="Clear conversation">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-primary-500 to-primary-700'}`}>
                {m.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'}`}>
                  <p className="text-sm whitespace-pre-line">{m.content}</p>
                </div>
                {m.role === 'assistant' && m.intent && m.intent !== 'unknown' && (
                  <div className="mt-1.5">
                    <Badge variant={intentBadge[m.intent]?.variant ?? 'neutral'}>{intentBadge[m.intent]?.label ?? m.intent}</Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3 flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-700/50 flex flex-wrap gap-2">
            {generateResponse(messages[messages.length - 1]?.content ?? '', lang, stadiumId).suggestions?.map((s, i) => (
              <button key={i} onClick={() => send(s)} className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-primary-500/15 hover:text-primary-300 text-slate-400 text-xs font-medium transition-all border border-slate-700/40">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about navigation, crowds, accessibility, transport..."
              className="input-field"
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
