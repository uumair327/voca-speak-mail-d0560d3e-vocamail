import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Volume2, VolumeX, Reply, Trash2, Star, StarOff,
  Send, Wand2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatTimestamp } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import VoiceCompose from '@/components/VoiceCompose';
import { callGemini } from '@/lib/gemini';

export default function EmailDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { emails, markAsRead, deleteEmail, toggleImportant, moveToTrash, sendEmail, voiceSpeed, geminiKey, currentUser } = useApp();
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const hasLoadedReplies = useRef(false);

  const email = emails.find((e) => e.id === id);

  useEffect(() => {
    if (email) markAsRead(email.id);
  }, [email?.id]);

  useEffect(() => {
    if (email && geminiKey && !hasLoadedReplies.current) {
      hasLoadedReplies.current = true;
      generateSmartReplies();
    } else if (email && !geminiKey) {
      setSmartReplies(['Thank you for your email.', "I'll review and get back to you.", 'Sounds good!']);
    }
  }, [email?.id, geminiKey]);

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const generateSmartReplies = async () => {
    if (!email || !geminiKey) return;
    setLoadingReplies(true);
    try {
      const result = await callGemini(
        geminiKey,
        `Generate exactly 3 short, natural smart replies for this email. Return a JSON array of 3 strings only. Each reply should be 4-8 words.\n\nSubject: ${email.subject}\n\n${email.message}`
      );
      try {
        // Try to extract JSON array from response
        const jsonMatch = result.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            setSmartReplies(parsed.slice(0, 3));
            setLoadingReplies(false);
            return;
          }
        }
      } catch { /* fallback below */ }
      setSmartReplies(['Thank you for your email.', "I'll review and get back to you.", 'Sounds good!']);
    } catch (err) {
      console.error('Smart replies error:', err);
      setSmartReplies(['Thank you for your email.', "I'll review and get back to you.", 'Sounds good!']);
    }
    setLoadingReplies(false);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!email) return;
    const utterance = new SpeechSynthesisUtterance(
      `From ${email.senderName}. Subject: ${email.subject}. ${email.message}`
    );
    utterance.rate = voiceSpeed;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDelete = () => {
    if (!email) return;
    moveToTrash(email.id);
    toast({ title: 'Email moved to Trash', description: 'You can restore it from Trash.' });
    navigate('/dashboard');
  };

  const handleSmartReply = (reply: string) => {
    if (!email) return;
    sendEmail(email.senderEmail, `Re: ${email.subject}`, reply);
    toast({ title: 'Smart Reply Sent ✓', description: `Replied: "${reply}"` });
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Email not found.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-cyan hover:underline text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="flex-1 text-base font-bold text-foreground truncate">Email Detail</h1>
        <button
          onClick={() => toggleImportant(email.id)}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center transition-colors hover:bg-muted"
        >
          {email.isImportant
            ? <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            : <StarOff className="w-5 h-5 text-muted-foreground" />
          }
        </button>
      </div>

      <div className="flex-1 px-4 py-5 overflow-y-auto pb-6">
        {/* Email Header */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <h2 className="text-xl font-bold text-foreground mb-4 leading-tight">{email.subject}</h2>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center text-cyan text-sm font-bold">
              {email.senderName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{email.senderName}</p>
              <p className="text-xs text-muted-foreground">{email.senderEmail}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-3">
            <span>To: {email.receiverEmail}</span>
            <span>{formatTimestamp(email.timestamp)}</span>
          </div>
        </div>

        {/* Message Body */}
        <div className="glass-card rounded-2xl p-5 mb-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{email.message}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleSpeak}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all ${
              isSpeaking
                ? 'bg-cyan/20 border-cyan/40 text-cyan'
                : 'bg-secondary border-border text-foreground hover:bg-muted'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? 'Stop' : 'Speak'}
          </button>

          <button
            onClick={() => setReplyOpen(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-secondary border border-border text-foreground hover:bg-muted transition-all"
          >
            <Reply className="w-4 h-4 text-cyan" />
            Reply
          </button>

          <button
            onClick={() => { generateSmartReplies(); }}
            disabled={loadingReplies}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-secondary border border-border text-foreground hover:bg-muted transition-all disabled:opacity-60"
          >
            <Wand2 className="w-4 h-4 text-cyan" />
            {loadingReplies ? 'Loading...' : 'AI Replies'}
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        {/* Smart Replies */}
        {smartReplies.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Smart Replies</p>
            <div className="flex flex-wrap gap-2">
              {smartReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSmartReply(reply)}
                  className="flex items-center gap-2 bg-cyan/10 border border-cyan/25 text-cyan text-sm px-4 py-2.5 rounded-full hover:bg-cyan/20 transition-all"
                >
                  <Send className="w-3 h-3" />
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <VoiceCompose isOpen={replyOpen} onClose={() => setReplyOpen(false)} prefillTo={email.senderEmail} />
    </div>
  );
}
