import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Wand2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { callGemini, validateGeminiKey } from '@/lib/gemini';

export default function Compose() {
  const [searchParams] = useSearchParams();
  const [to, setTo] = useState(searchParams.get('to') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [message, setMessage] = useState('');
  const [generatingSubject, setGeneratingSubject] = useState(false);
  const [sending, setSending] = useState(false);
  const { sendEmail, geminiKey } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateSubject = async () => {
    if (!message.trim()) {
      toast({ title: 'Write your message first', description: 'AI needs message content to generate a subject.', variant: 'destructive' });
      return;
    }
    if (!geminiKey) {
      toast({ title: 'Gemini API Key Missing', description: 'Go to Settings to add your Google Gemini API key.', variant: 'destructive' });
      return;
    }
    if (!validateGeminiKey(geminiKey)) {
      toast({ title: 'Invalid API Key', description: 'Please check your Gemini API key in Settings.', variant: 'destructive' });
      return;
    }
    setGeneratingSubject(true);
    try {
      const result = await callGemini(
        geminiKey,
        `Generate a single professional email subject line for the following message. Return only the subject line text, nothing else.\n\nMessage:\n${message}`
      );
      setSubject(result.replace(/^["']|["']$/g, '')); // strip quotes if any
      toast({ title: '✨ Subject generated!', description: 'AI created a professional subject line.' });
    } catch (err) {
      console.error('AI subject error:', err);
      toast({ title: 'AI Error', description: err instanceof Error ? err.message : 'Could not generate subject.', variant: 'destructive' });
    }
    setGeneratingSubject(false);
  };

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !message.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields before sending.', variant: 'destructive' });
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    sendEmail(to.trim(), subject.trim(), message.trim());
    toast({ title: 'Email Sent Successfully ✓', description: `Your email to ${to} has been sent.` });
    setSending(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto animate-fade-in">
      {/* Top Bar */}
      <div className="glass-card border-b border-border px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-foreground">Compose Email</h1>
        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-2 bg-cyan text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-cyan/90 transition-all cyan-glow-sm disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">
        {/* To */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">To</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@email.com"
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all"
          />
        </div>

        {/* Subject */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</label>
            <button
              onClick={handleGenerateSubject}
              disabled={generatingSubject}
              className="flex items-center gap-1 text-xs text-cyan hover:text-cyan/80 transition-colors disabled:opacity-60"
            >
              <Wand2 className="w-3 h-3" />
              {generatingSubject ? 'Generating...' : 'AI Generate'}
            </button>
          </div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all"
          />
        </div>

        {/* Message */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={12}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
