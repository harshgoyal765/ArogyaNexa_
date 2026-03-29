'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Plus, History } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import { ToastContainer } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  warning?: string;
}

const SUGGESTED_TOPICS = [
  { title: 'Medicine side effects', sub: 'Verify common reactions' },
  { title: 'Dosage for paracetamol', sub: 'Age-based calculations' },
  { title: 'Drug interactions', sub: 'Check polypharmacy safety' },
  { title: 'Supplement stacking', sub: 'Safe combinations' },
];

const RECENT_CHATS = ['Antibiotic Course Timing', 'Pediatric Cough Syrup', 'Vitamin D3 Deficiency'];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI Clinical Assistant. I can help you with medication information, drug interactions, dosage guidance, and general health queries. How can I assist you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));

    const responses: Record<string, { content: string; warning?: string }> = {
      default: {
        content: 'Thank you for your query. Based on clinical guidelines, I recommend consulting with your pharmacist or physician for personalized advice. I can provide general information, but individual medical decisions should always involve a qualified healthcare professional.',
        warning: 'This assistant provides information only. Always consult a licensed healthcare professional for medical decisions.',
      },
    };

    const lowerQuery = query.toLowerCase();
    let response = responses.default;

    if (lowerQuery.includes('paracetamol') || lowerQuery.includes('ibuprofen')) {
      response = {
        content: 'Paracetamol (Acetaminophen) and Ibuprofen can generally be taken together as they work through different mechanisms. Paracetamol acts centrally while Ibuprofen is an NSAID that reduces inflammation. However, always follow recommended dosages: max 4,000mg paracetamol and 1,200mg ibuprofen per 24 hours.',
        warning: 'Do not exceed recommended doses. If symptoms persist beyond 3 days, seek medical attention immediately.',
      };
    } else if (lowerQuery.includes('vitamin d') || lowerQuery.includes('supplement')) {
      response = {
        content: 'Vitamin D3 (Cholecalciferol) is the preferred form for supplementation. The recommended daily intake for adults is 600-800 IU, though many clinicians recommend 1,000-2,000 IU for optimal levels. Best absorbed with a fat-containing meal. Toxicity is rare but possible at very high doses (>10,000 IU/day long-term).',
      };
    } else if (lowerQuery.includes('interaction') || lowerQuery.includes('drug')) {
      response = {
        content: 'Drug interactions can be pharmacokinetic (affecting absorption, distribution, metabolism, or excretion) or pharmacodynamic (affecting the drug\'s mechanism of action). Common interactions to watch: blood thinners with NSAIDs, SSRIs with MAOIs, and statins with certain antibiotics. Always disclose all medications to your pharmacist.',
        warning: 'Never stop or change medications without consulting your healthcare provider.',
      };
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      warning: response.warning,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThinking(false);
    setMessages(prev => [...prev, assistantMsg]);
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 h-screen flex overflow-hidden bg-surface">
        {/* Left sidebar */}
        <aside className="hidden lg:flex w-80 h-full bg-surface-container-low flex-col border-r border-outline-variant/10">
          <div className="p-6 border-b border-outline-variant/15">
            <h2 className="font-headline text-xl text-primary mb-1">Clinical Consults</h2>
            <p className="section-label text-[10px]">Historical Context</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <section>
              <h3 className="section-label text-[10px] mb-3 px-2">Suggested Topics</h3>
              <div className="space-y-2">
                {SUGGESTED_TOPICS.map((topic) => (
                  <button
                    key={topic.title}
                    onClick={() => sendMessage(topic.title)}
                    className="w-full text-left p-3 rounded-xl bg-surface-container-lowest hover:translate-x-1 transition-transform"
                  >
                    <span className="text-sm font-medium text-primary block">{topic.title}</span>
                    <span className="text-[10px] text-on-surface-variant">{topic.sub}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="section-label text-[10px] mb-3 px-2">Recent Chats</h3>
              <div className="space-y-1">
                {RECENT_CHATS.map((chat) => (
                  <div key={chat} className="p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3">
                    <History size={14} className="text-outline flex-shrink-0" />
                    <span className="text-sm text-on-surface truncate">{chat}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="p-4 bg-surface-container-lowest/50 backdrop-blur-sm">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="btn-primary w-full justify-center text-sm py-3"
            >
              <Plus size={16} /> New Clinical Query
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <section className="flex-1 flex flex-col">
          {/* Chat header */}
          <header className="h-16 px-6 flex items-center justify-between border-b border-outline-variant/15 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">clinical_notes</span>
              </div>
              <div>
                <h1 className="font-headline text-lg text-primary">AI Clinical Assistant</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
                  <span className="section-label text-[10px]">Real-time Analysis Active</span>
                </div>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
            <div className="text-center">
              <span className="section-label text-[10px]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3')}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                )}
                <div className={cn('max-w-[80%] space-y-3', msg.role === 'user' ? 'max-w-[75%]' : '')}>
                  <div className={cn(
                    'rounded-3xl p-4',
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-tr-none shadow-[4px_4px_15px_rgba(0,65,130,0.2)]'
                      : 'bg-gradient-to-br from-white to-surface-container-low border border-white/50 shadow-[4px_4px_15px_rgba(0,65,130,0.05),-4px_-4px_15px_rgba(255,255,255,0.8)] rounded-tl-none text-on-surface-variant'
                  )}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <span className={cn('text-[10px] mt-2 block italic', msg.role === 'user' ? 'text-white/70 text-right' : 'text-outline')}>
                      {msg.timestamp}
                    </span>
                  </div>
                  {msg.warning && (
                    <div className="bg-error-container/20 text-on-error-container p-3 rounded-xl flex gap-2 items-start border border-error/10">
                      <span className="material-symbols-outlined text-error text-sm flex-shrink-0 mt-0.5">warning</span>
                      <p className="text-xs leading-relaxed">{msg.warning}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                  <span className="section-label text-[10px] ml-2">Consulting Pharmacist Database...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <footer className="p-6 bg-white/80 backdrop-blur-lg border-t border-outline-variant/10">
            <div className="max-w-4xl mx-auto flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your medical query here..."
                  rows={1}
                  className="w-full bg-surface-container-high border-none rounded-2xl px-6 py-4 text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none outline-none"
                />
                <div className="absolute right-4 bottom-3 flex items-center gap-2">
                  <button className="p-1.5 text-outline hover:text-primary transition-colors"><Paperclip size={16} /></button>
                  <button className="p-1.5 text-outline hover:text-primary transition-colors"><Mic size={16} /></button>
                </div>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || thinking}
                className="h-[52px] w-[52px] clinical-gradient text-white rounded-2xl flex items-center justify-center shadow-primary-md hover:opacity-90 transition-all active:scale-90 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="max-w-4xl mx-auto text-[10px] text-center text-on-surface-variant/60 mt-3 uppercase tracking-[0.2em]">
              This assistant provides information only. Consult a healthcare professional for clinical diagnosis.
            </p>
          </footer>
        </section>
      </div>
      <ToastContainer />
    </>
  );
}
