import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Mic, X, Star, Circle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatTimestamp, Email } from '@/lib/mockData';
import NavDrawer from '@/components/NavDrawer';
import VoiceCompose from '@/components/VoiceCompose';

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('inbox');
  const navigate = useNavigate();
  const { currentUser, getInboxEmails, getSentEmails, getDraftEmails, getSpamEmails, getTrashEmails, markAsRead } = useApp();

  const folderEmails: Record<string, Email[]> = {
    inbox: getInboxEmails(),
    sent: getSentEmails(),
    drafts: getDraftEmails(),
    spam: getSpamEmails(),
    trash: getTrashEmails(),
  };

  const allEmails = folderEmails[activeFolder] || [];
  const filtered = searchQuery
    ? allEmails.filter(
        (e) =>
          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allEmails;

  const folderLabel = activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1);

  const handleEmailClick = (email: Email) => {
    markAsRead(email.id);
    navigate(`/email/${email.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="glass-card border-b border-border px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {searchOpen ? (
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <h1 className="flex-1 text-center text-lg font-bold text-foreground">{folderLabel}</h1>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Avatar */}
        {!searchOpen && (
          <div className="w-10 h-10 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center text-cyan text-sm font-bold shrink-0">
            {currentUser?.avatar || 'U'}
          </div>
        )}
      </div>

      {/* Email List or Empty State */}
      <div className="flex-1 px-4 py-4 overflow-y-auto pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center cyan-glow">
                <Mic className="w-12 h-12 text-cyan" />
              </div>
              <div className="absolute inset-0 rounded-full border border-cyan/20 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {searchQuery ? 'No results found' : 'No Emails Yet'}
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              {searchQuery
                ? 'Try a different search term'
                : 'Start by sending your first voice email. Tap the mic button below!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {filtered.map((email) => (
              <button
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className="w-full glass-card rounded-2xl p-4 text-left hover:border-cyan/30 transition-all hover:cyan-glow-sm active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                    {(activeFolder === 'sent' ? email.receiverEmail : email.senderName).slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold truncate ${!email.isRead && activeFolder === 'inbox' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {activeFolder === 'sent' ? email.receiverEmail : email.senderName}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {email.isImportant && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                        <span className="text-xs text-muted-foreground">{formatTimestamp(email.timestamp)}</span>
                      </div>
                    </div>
                    <p className={`text-sm truncate mb-1 ${!email.isRead && activeFolder === 'inbox' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {email.message.replace(/\n/g, ' ')}
                    </p>
                  </div>

                  {!email.isRead && activeFolder === 'inbox' && (
                    <div className="shrink-0 mt-1">
                      <Circle className="w-2.5 h-2.5 fill-cyan text-cyan" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Mic Button */}
      <button
        onClick={() => setVoiceOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-cyan flex items-center justify-center shadow-2xl cyan-glow hover:scale-110 active:scale-95 transition-all z-20"
      >
        <Mic className="w-7 h-7 text-primary-foreground" />
      </button>

      <NavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
      />

      <VoiceCompose isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
}
