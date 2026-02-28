export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
}

export interface Email {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  receiverEmail: string;
  subject: string;
  message: string;
  category: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';
  isRead: boolean;
  isImportant: boolean;
  timestamp: string;
}

export const DEMO_USERS: User[] = [
  {
    id: 'user_demo',
    fullName: 'Alex Johnson',
    email: 'demo@vocamail.ai',
    password: 'demo123',
    avatar: 'AJ',
  },
  {
    id: 'user_sarah',
    fullName: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'sarah123',
    avatar: 'SC',
  },
  {
    id: 'user_mike',
    fullName: 'Mike Williams',
    email: 'mike@example.com',
    password: 'mike123',
    avatar: 'MW',
  },
];

export const DEMO_EMAILS: Email[] = [
  {
    id: 'email_1',
    senderId: 'user_sarah',
    senderName: 'Sarah Chen',
    senderEmail: 'sarah@example.com',
    receiverId: 'user_demo',
    receiverEmail: 'demo@vocamail.ai',
    subject: 'Project Kickoff Meeting Tomorrow',
    message: `Hi Alex,\n\nI wanted to confirm our project kickoff meeting scheduled for tomorrow at 10:00 AM. We'll be covering the project scope, timeline, and team responsibilities.\n\nPlease make sure to review the attached brief beforehand. Looking forward to a productive session!\n\nBest regards,\nSarah`,
    category: 'inbox',
    isRead: false,
    isImportant: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'email_2',
    senderId: 'user_mike',
    senderName: 'Mike Williams',
    senderEmail: 'mike@example.com',
    receiverId: 'user_demo',
    receiverEmail: 'demo@vocamail.ai',
    subject: 'Q3 Report Review — Feedback Needed',
    message: `Hey Alex,\n\nI've finished the Q3 financial report and would love your feedback before we present to the board. Key highlights include a 23% revenue increase and a 15% reduction in operational costs.\n\nCould you take a look and share your thoughts by Thursday? Let me know if you have any questions.\n\nThanks,\nMike`,
    category: 'inbox',
    isRead: false,
    isImportant: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'email_3',
    senderId: 'user_sarah',
    senderName: 'Sarah Chen',
    senderEmail: 'sarah@example.com',
    receiverId: 'user_demo',
    receiverEmail: 'demo@vocamail.ai',
    subject: 'Design System Updates',
    message: `Hi Alex,\n\nJust pushing through the latest design system updates. We've refined the color palette, updated typography guidelines, and added new component variants.\n\nThe new glassmorphism cards look stunning on the dark theme. Check out the Figma link when you get a chance!\n\nCheers,\nSarah`,
    category: 'inbox',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'email_4',
    senderId: 'user_demo',
    senderName: 'Alex Johnson',
    senderEmail: 'demo@vocamail.ai',
    receiverId: 'user_mike',
    receiverEmail: 'mike@example.com',
    subject: 'Re: Q3 Report — Looks Great!',
    message: `Hi Mike,\n\nJust reviewed the Q3 report — excellent work! The revenue numbers are impressive and the cost reduction shows great operational efficiency.\n\nI have a few minor comments I'll send over in a separate document. Overall, I think we're in great shape for the board presentation.\n\nGreat job!\nAlex`,
    category: 'sent',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: 'email_5',
    senderId: 'user_mike',
    senderName: 'Mike Williams',
    senderEmail: 'mike@example.com',
    receiverId: 'user_demo',
    receiverEmail: 'demo@vocamail.ai',
    subject: 'Team Lunch This Friday 🍕',
    message: `Hey team,\n\nQuick reminder that we're doing a team lunch this Friday at 1 PM. We'll be heading to that new Italian place downtown.\n\nPlease RSVP by Wednesday so I can make the reservation. Vegetarian options are available!\n\nSee you there,\nMike`,
    category: 'inbox',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
