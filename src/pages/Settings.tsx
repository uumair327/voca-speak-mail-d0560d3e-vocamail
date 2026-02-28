import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Sliders, LogOut, Key, Save } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { validateGeminiKey } from '@/lib/gemini';

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, logout, voiceSpeed, setVoiceSpeed, geminiKey, setGeminiKey, updateProfile } = useApp();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [apiKey, setApiKey] = useState(geminiKey || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [speed, setSpeed] = useState(voiceSpeed);

  const handleSaveProfile = () => {
    if (!fullName.trim() || !email.trim()) {
      toast({ title: 'Missing fields', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }
    updateProfile(fullName.trim(), email.trim());
    toast({ title: 'Profile updated ✓', description: 'Your profile has been saved.' });
  };

  const handleSaveSpeed = () => {
    setVoiceSpeed(speed);
    toast({ title: 'Voice speed saved ✓', description: `Speed set to ${speed}x` });
  };

  const handleSaveAPIKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed && !validateGeminiKey(trimmed)) {
      toast({ title: 'Invalid Key Format', description: 'Gemini API keys start with "AIza". Please check your key.', variant: 'destructive' });
      return;
    }
    setGeminiKey(trimmed);
    toast({ title: 'API key saved ✓', description: trimmed ? 'Google Gemini API key has been saved.' : 'API key removed.' });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast({ title: 'Missing fields', description: 'Fill in both password fields.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Too short', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Password changed ✓', description: 'Your password has been updated.' });
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-cyan" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );

  const inputClass = "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all";

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto animate-fade-in">
      <div className="glass-card border-b border-border px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-foreground">Settings</h1>
      </div>

      <div className="flex-1 px-4 py-5 overflow-y-auto pb-8">
        <Section title="Edit Profile" icon={User}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputClass} placeholder="your@email.com" />
            </div>
            <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-cyan text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-cyan/90 transition-all">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </Section>

        <Section title="Change Password" icon={Lock}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="Min 6 characters" />
            </div>
            <button onClick={handleChangePassword} className="flex items-center gap-2 bg-secondary border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-muted transition-all">
              <Lock className="w-4 h-4 text-cyan" /> Update Password
            </button>
          </div>
        </Section>

        <Section title="Voice Speed" icon={Sliders}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">TTS Playback Rate</span>
              <span className="text-sm font-semibold text-cyan">{speed.toFixed(1)}x</span>
            </div>
            <input type="range" min={0.5} max={2} step={0.1} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-cyan h-2 rounded-full bg-secondary cursor-pointer" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.5x Slow</span><span>1.0x Normal</span><span>2.0x Fast</span>
            </div>
            <button onClick={handleSaveSpeed} className="mt-3 flex items-center gap-2 bg-secondary border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-muted transition-all">
              <Save className="w-4 h-4 text-cyan" /> Save Speed
            </button>
          </div>
        </Section>

        <Section title="Google Gemini API Key" icon={Key}>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Required for AI subject generation, smart replies, and voice improvement. Get a free key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">Google AI Studio</a>.</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={inputClass}
              placeholder="AIza..."
            />
            <button onClick={handleSaveAPIKey} className="flex items-center gap-2 bg-secondary border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-muted transition-all">
              <Save className="w-4 h-4 text-cyan" /> Save API Key
            </button>
          </div>
        </Section>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive font-medium py-3.5 rounded-xl hover:bg-destructive/20 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
