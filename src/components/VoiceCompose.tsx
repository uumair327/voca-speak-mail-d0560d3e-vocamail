import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Send, Wand2, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { callGemini, validateGeminiKey } from '@/lib/gemini';

interface VoiceComposeProps {
  isOpen: boolean;
  onClose: () => void;
  prefillTo?: string;
}

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

export default function VoiceCompose({ isOpen, onClose, prefillTo }: VoiceComposeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [to, setTo] = useState(prefillTo || '');
  const [subject, setSubject] = useState('');
  const [improving, setImproving] = useState(false);
  const [sending, setSending] = useState(false);
  const [micError, setMicError] = useState('');
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const isListeningRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const { sendEmail, geminiKey } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    if (prefillTo) setTo(prefillTo);
  }, [prefillTo]);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setSubject('');
      setMicError('');
      finalTranscriptRef.current = '';
      if (!prefillTo) setTo('');
    }
  }, [isOpen]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Request mic permission first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setMicError('');
        finalTranscriptRef.current = transcript; // preserve existing text

        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
        };

        recognition.onresult = (event) => {
          let finalText = finalTranscriptRef.current;
          let interimText = '';
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalText += result[0].transcript;
            } else {
              interimText += result[0].transcript;
            }
          }
          finalTranscriptRef.current = finalText;
          setTranscript(finalText + interimText);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setMicError('Microphone access denied. Please allow mic permission in your browser settings and try again.');
            isListeningRef.current = false;
            setIsListening(false);
          } else if (event.error === 'no-speech') {
            // No speech detected — will auto-restart via onend
            console.log('No speech detected, waiting...');
          } else if (event.error === 'network') {
            setMicError('Network error during speech recognition. Please check your connection.');
            isListeningRef.current = false;
            setIsListening(false);
          } else if (event.error === 'aborted') {
            // User or system aborted, don't restart
          } else {
            toast({
              title: 'Speech recognition error',
              description: `Error: ${event.error}. Please try again.`,
              variant: 'destructive',
            });
          }
        };

        // Auto-restart when browser stops (silence timeout ~5-10s)
        recognition.onend = () => {
          if (isListeningRef.current) {
            console.log('Speech recognition ended, auto-restarting...');
            try {
              recognition.start();
            } catch {
              // If restart fails, stop gracefully
              isListeningRef.current = false;
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch {
          setMicError('Could not start microphone. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Microphone access denied:', err);
        setMicError('Microphone access denied. Please enable microphone permission in your browser settings.');
      });
  }, [stopListening, transcript, toast]);

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleAIImprove = async () => {
    if (!transcript.trim()) return;
    if (!geminiKey) {
      toast({ title: 'Gemini API Key Missing', description: 'Go to Settings to add your Google Gemini API key.', variant: 'destructive' });
      return;
    }
    if (!validateGeminiKey(geminiKey)) {
      toast({ title: 'Invalid API Key', description: 'Please check your Gemini API key in Settings.', variant: 'destructive' });
      return;
    }
    setImproving(true);
    try {
      const result = await callGemini(
        geminiKey,
        `You are an email writing assistant. Given a rough voice transcript, return a JSON object with two keys: "improved" (the polished email message) and "subject" (a professional 1-line subject). Return only valid JSON, nothing else.\n\nVoice transcript: "${transcript}"`
      );
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.improved) setTranscript(parsed.improved);
          if (parsed.subject) setSubject(parsed.subject);
          toast({ title: '✨ AI improved your message!', description: 'Subject and message updated.' });
        } else {
          setTranscript(result);
          toast({ title: '✨ AI improved your message!', description: 'Message has been polished.' });
        }
      } catch {
        setTranscript(result);
        toast({ title: '✨ AI improved your message!', description: 'Message has been polished.' });
      }
    } catch (err) {
      console.error('AI improve error:', err);
      toast({ title: 'AI Error', description: err instanceof Error ? err.message : 'Could not improve message.', variant: 'destructive' });
    }
    setImproving(false);
  };

  const handleSend = async () => {
    if (!to.trim() || !transcript.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill in the To field and record a message.', variant: 'destructive' });
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    sendEmail(to.trim(), subject || 'Voice Email', transcript.trim());
    toast({ title: 'Email Sent Successfully ✓', description: `Your email to ${to} has been sent.` });
    setSending(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full animate-slide-up">
        <div className="glass-card rounded-t-3xl border-t border-border p-6 max-h-[85vh] overflow-y-auto">
          {/* Handle */}
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Mic className="w-5 h-5 text-cyan" /> Voice Compose
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* To Field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">To</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@email.com"
                className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Auto-generated by AI or type here..."
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all"
            />
          </div>

          {/* Listening Animation */}
          <div className="flex justify-center mb-5">
            <div className="relative flex items-center justify-center">
              {isListening && (
                <>
                  <div className="ripple-ring w-24 h-24" style={{ animationDelay: '0s' }} />
                  <div className="ripple-ring w-24 h-24" style={{ animationDelay: '0.5s' }} />
                  <div className="ripple-ring w-24 h-24" style={{ animationDelay: '1s' }} />
                </>
              )}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                    : 'bg-cyan hover:bg-cyan/90 cyan-glow'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8 text-primary-foreground" />}
              </button>
            </div>
          </div>

          {/* Wave bars when listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1 mb-4 h-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mb-4">
            {isListening ? '🔴 Listening... tap to stop' : 'Tap mic to start recording'}
          </p>

          {micError && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm mb-4">
              {micError}
            </div>
          )}

          {/* Transcript */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Message</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              placeholder="Your voice transcript will appear here... or type directly."
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAIImprove}
              disabled={improving || !transcript.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-secondary border border-border text-foreground font-medium py-3 rounded-xl text-sm hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4 text-cyan" />
              {improving ? 'Improving...' : 'AI Improve'}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !transcript.trim() || !to.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan text-primary-foreground font-semibold py-3 rounded-xl text-sm hover:bg-cyan/90 transition-all cyan-glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
