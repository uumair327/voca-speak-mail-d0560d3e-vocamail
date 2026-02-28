import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Email, DEMO_USERS, DEMO_EMAILS } from '@/lib/mockData';

interface AppContextType {
  currentUser: User | null;
  emails: Email[];
  voiceSpeed: number;
  geminiKey: string;
  login: (email: string, password: string) => boolean;
  signup: (fullName: string, email: string, password: string) => boolean;
  logout: () => void;
  sendEmail: (to: string, subject: string, message: string) => void;
  deleteEmail: (id: string) => void;
  markAsRead: (id: string) => void;
  toggleImportant: (id: string) => void;
  moveToTrash: (id: string) => void;
  setVoiceSpeed: (speed: number) => void;
  setGeminiKey: (key: string) => void;
  getInboxEmails: () => Email[];
  getSentEmails: () => Email[];
  getDraftEmails: () => Email[];
  getSpamEmails: () => Email[];
  getTrashEmails: () => Email[];
  updateProfile: (fullName: string, email: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'vocamail_state';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [emails, setEmails] = useState<Email[]>([]);
  const [voiceSpeed, setVoiceSpeedState] = useState(1);
  const [geminiKey, setGeminiKeyState] = useState('');

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentUserId) {
          const allUsers = parsed.users || DEMO_USERS;
          const user = allUsers.find((u: User) => u.id === parsed.currentUserId);
          if (user) setCurrentUser(user);
        }
        setUsers(parsed.users || DEMO_USERS);
        setEmails(parsed.emails || DEMO_EMAILS);
        setVoiceSpeedState(parsed.voiceSpeed || 1);
        setGeminiKeyState(parsed.geminiKey || parsed.openAIKey || '');
      } else {
        setEmails(DEMO_EMAILS);
      }
    } catch {
      setEmails(DEMO_EMAILS);
    }
  }, []);

  // Persist state (debounced to avoid excessive writes)
  const persistTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    persistTimeoutRef.current = setTimeout(() => {
      const state = {
        currentUserId: currentUser?.id || null,
        users,
        emails,
        voiceSpeed,
        geminiKey,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 300);
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    };
  }, [currentUser, users, emails, voiceSpeed, geminiKey]);

  const login = useCallback((email: string, password: string): boolean => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const signup = useCallback((fullName: string, email: string, password: string): boolean => {
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;
    const newUser: User = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      password,
      avatar: fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const sendEmail = useCallback((to: string, subject: string, message: string) => {
    if (!currentUser) return;
    const receiver = users.find((u) => u.email.toLowerCase() === to.toLowerCase());
    const newEmail: Email = {
      id: `email_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      receiverId: receiver?.id || 'external',
      receiverEmail: to,
      subject,
      message,
      category: 'sent',
      isRead: true,
      isImportant: false,
      timestamp: new Date().toISOString(),
    };
    setEmails((prev) => [newEmail, ...prev]);

    // Also add to receiver's inbox if they exist
    if (receiver) {
      const inboxEmail: Email = {
        ...newEmail,
        id: `email_${Date.now()}_inbox`,
        receiverId: receiver.id,
        category: 'inbox',
        isRead: false,
      };
      setEmails((prev) => [inboxEmail, ...prev]);
    }
  }, [currentUser, users]);

  const deleteEmail = useCallback((id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setEmails((prev) => prev.map((e) => e.id === id ? { ...e, isRead: true } : e));
  }, []);

  const toggleImportant = useCallback((id: string) => {
    setEmails((prev) => prev.map((e) => e.id === id ? { ...e, isImportant: !e.isImportant } : e));
  }, []);

  const moveToTrash = useCallback((id: string) => {
    setEmails((prev) => prev.map((e) => e.id === id ? { ...e, category: 'trash' } : e));
  }, []);

  const setVoiceSpeed = useCallback((speed: number) => {
    setVoiceSpeedState(speed);
  }, []);

  const setGeminiKey = useCallback((key: string) => {
    setGeminiKeyState(key);
  }, []);

  const updateProfile = useCallback((fullName: string, email: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, fullName, email };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => u.id === currentUser.id ? updated : u));
  }, [currentUser]);

  const getInboxEmails = useCallback(() =>
    emails.filter((e) => e.receiverId === currentUser?.id && e.category === 'inbox')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  [emails, currentUser]);

  const getSentEmails = useCallback(() =>
    emails.filter((e) => e.senderId === currentUser?.id && e.category === 'sent')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  [emails, currentUser]);

  const getDraftEmails = useCallback(() =>
    emails.filter((e) => e.senderId === currentUser?.id && e.category === 'drafts'),
  [emails, currentUser]);

  const getSpamEmails = useCallback(() =>
    emails.filter((e) => e.receiverId === currentUser?.id && e.category === 'spam'),
  [emails, currentUser]);

  const getTrashEmails = useCallback(() =>
    emails.filter((e) =>
      (e.senderId === currentUser?.id || e.receiverId === currentUser?.id) && e.category === 'trash'
    ),
  [emails, currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser, emails, voiceSpeed, geminiKey,
      login, signup, logout, sendEmail, deleteEmail,
      markAsRead, toggleImportant, moveToTrash,
      setVoiceSpeed, setGeminiKey, updateProfile,
      getInboxEmails, getSentEmails, getDraftEmails, getSpamEmails, getTrashEmails,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
