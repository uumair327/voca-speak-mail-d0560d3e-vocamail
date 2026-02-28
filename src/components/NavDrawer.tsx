import { useNavigate, useLocation } from 'react-router-dom';
import {
  Inbox, Send, FileText, AlertCircle, Trash2,
  Settings, LogOut, X, Mic
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFolder: string;
  onFolderChange: (folder: string) => void;
}

const menuItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'spam', label: 'Spam', icon: AlertCircle },
  { id: 'trash', label: 'Trash', icon: Trash2 },
];

export default function NavDrawer({ isOpen, onClose, activeFolder, onFolderChange }: NavDrawerProps) {
  const navigate = useNavigate();
  const { currentUser, logout, getInboxEmails } = useApp();
  const unreadCount = getInboxEmails().filter((e) => !e.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFolderClick = (id: string) => {
    onFolderChange(id);
    onClose();
  };

  const handleCompose = () => {
    onClose();
    navigate('/compose');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } glass-card border-r border-border flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                <Mic className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">VocaMail</h2>
                <p className="text-xs text-muted-foreground">Voice & AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User info */}
          {currentUser && (
            <div className="flex items-center gap-3 bg-secondary rounded-xl p-3">
              <div className="w-9 h-9 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center text-cyan text-sm font-bold">
                {currentUser.avatar}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">{currentUser.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Compose Button */}
        <div className="px-4 pt-4">
          <button
            onClick={handleCompose}
            className="w-full bg-cyan text-primary-foreground font-semibold py-3 rounded-xl text-sm hover:bg-cyan/90 transition-all cyan-glow-sm"
          >
            ✏️ Compose Email
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 pt-4 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeFolder === id;
            return (
              <button
                key={id}
                onClick={() => handleFolderClick(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan/15 text-cyan border border-cyan/20'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
                {id === 'inbox' && unreadCount > 0 && (
                  <span className="ml-auto text-xs bg-cyan text-primary-foreground px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border px-3 py-4 space-y-1">
          <button
            onClick={() => { navigate('/settings'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
