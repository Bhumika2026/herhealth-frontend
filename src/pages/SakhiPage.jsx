// src/pages/SakhiPage.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCycle } from '@/context/CycleContext';
import clsx from 'clsx';

const QUICK_PROMPTS = [
  'Why is my period late?',
  'Foods for period pain?',
  'Natural cramp relief?',
  'Ayurveda for PCOS?',
  'What phase am I in?',
  'Tips for bloating?',
];

const TOPICS = [
  { id: 'cycle',   emoji: '🩸', label: 'Cycle' },
  { id: 'symptoms',emoji: '🤕', label: 'Symptoms' },
  { id: 'nutrition',emoji: '🥗', label: 'Nutrition' },
  { id: 'ayurveda',emoji: '🌿', label: 'Ayurveda' },
  { id: 'mental',  emoji: '🧘', label: 'Mental Health' },
];

async function callSakhi(messages, userContext) {
  try {
    const systemPrompt = `You are Sakhi, a warm, knowledgeable Indian women's health companion on the HerHealth app.
You specialize in:
- Menstrual cycle health and tracking
- Ayurvedic remedies for women's health
- Indian diet and nutrition for hormonal balance
- PCOS, thyroid, endometriosis management
- Mental wellness and emotional support
- Natural home remedies

User context: ${JSON.stringify(userContext)}

Always give practical, compassionate advice. Include Indian dietary tips when relevant. Keep responses concise (3-4 sentences max unless explaining something complex). Always remind users to consult a doctor for serious concerns.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || 'I\'m sorry, I couldn\'t process that. Please try again.';
  } catch {
    return 'Network error. Please check your connection and try again.';
  }
}

export default function SakhiPage() {
  const { user } = useAuth();
  const { cycleInfo, phaseInfo } = useCycle();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! 🙏 I'm **Sakhi**, your personal health companion.\n\nI'm here to help you with:\n• 📅 Understanding your menstrual cycle\n• 🌿 Ayurvedic remedies & wellness tips\n• 🍽️ Indian diet & nutrition advice\n• 💆‍♀️ Managing symptoms naturally\n• 🧘 Mental wellness support\n\nHow can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const userContext = {
    name: user?.name,
    phase: cycleInfo?.phase,
    dayOfCycle: cycleInfo?.dayOfCycle,
    healthConditions: user?.healthProfile?.healthConditions,
    dietPreference: user?.healthProfile?.dietPreference,
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Build API messages (exclude first system message)
    const apiMessages = newMessages
      .filter((_, i) => i > 0 || messages.length > 1)
      .map(m => ({ role: m.role, content: m.content }));

    const reply = await callSakhi(apiMessages, userContext);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const formatContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n•/g, '<br/>•')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-gradient-to-r from-rose-light to-lilac-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose flex items-center justify-center shadow-soft">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-charcoal">Sakhi AI</h1>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-sage rounded-full pulse-rose" />
              <p className="text-xs text-gray-400">Your Health Companion</p>
            </div>
          </div>
        </div>

        {/* Topic pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => { setActiveTopic(t.id); sendMessage(`Tell me about ${t.label.toLowerCase()} in my current phase`); }}
              className={clsx('flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                activeTopic === t.id
                  ? 'bg-rose text-white border-rose'
                  : 'bg-white text-gray-500 border-gray-200')}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-rose flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1">
                🌸
              </div>
            )}
            <div className={clsx('max-w-[82%] px-4 py-3 rounded-3xl text-sm',
              m.role === 'user'
                ? 'bg-rose text-white rounded-br-sm'
                : 'bg-white shadow-card rounded-bl-sm text-charcoal')}>
              <span dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-xl bg-rose flex items-center justify-center mr-2">🌸</div>
            <div className="bg-white shadow-card rounded-3xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-rose/40 rounded-full animate-bounce"
                     style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-5 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-1.5 bg-rose-light text-rose text-xs font-medium rounded-full
                         hover:bg-rose hover:text-white transition-all">
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-5 pb-28 pt-2 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="input flex-1"
            placeholder="Ask Sakhi anything…" disabled={loading} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center transition-all',
              input.trim() && !loading ? 'bg-rose text-white shadow-soft' : 'bg-gray-100 text-gray-300')}>
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2">
          For informational purposes only. Always consult a doctor for medical advice.
        </p>
      </div>
    </div>
  );
}
