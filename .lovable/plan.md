
## VocaMail – UI Prototype Plan

A high-fidelity, interactive frontend prototype with mock data. No backend needed — all emails, users, and actions are simulated in local state. Dark blue + cyan themed, mobile-first design.

---

### 🎨 Design System
- **Background**: Deep dark-blue gradient (`#0a0f1e` → `#0d1b3e`)
- **Accent**: Cyan (`#00e5ff` / `#22d3ee`)
- **Font**: Clean, large, readable (Inter or system sans-serif)
- **Cards**: Rounded, glassmorphism-style with subtle borders
- **Animations**: Smooth slide-in/fade-in transitions throughout

---

### 📱 Screen 1 — Auth (Login & Signup)
- **Signup page**: Full Name, Email, Password, Confirm Password — with validation (email format, min 6 chars, password match)
- **Login page**: Email + Password — with error message on wrong credentials
- Mock auth: saved to `localStorage` so sessions persist across page refreshes
- Redirect to Dashboard on success

---

### 📬 Screen 2 — Dashboard (Main Inbox)
- **Top App Bar**: Hamburger menu (left) → "Inbox" title (center) → Search + Avatar icons (right)
- **Empty State**: Large glowing mic icon, "No Emails Yet" text, subtext encouraging voice email
- **Email list** (shown when mock emails exist): Cards showing sender, subject, 2-line preview, timestamp, unread dot
- **Floating mic button**: Bottom-right, glowing cyan, visually dominant
- **Search bar**: Slides in on tap, filters emails by sender/subject/keyword in real-time

---

### 🗂️ Screen 3 — Hamburger Navigation Drawer
- Slides in from left with smooth animation
- Menu items with icons: Inbox, Sent, Drafts, Spam, Trash, Settings, Logout
- Active item highlighted in cyan
- Tap outside to close

---

### 🎤 Screen 4 — Voice Compose Panel (Bottom Sheet)
- Opens when mic button is tapped
- **Listening animation**: Animated sound wave / pulsing rings in cyan
- **Live transcript**: Text appears word-by-word as you speak (Web Speech API)
- **AI Improve button**: Sends transcript to OpenAI → returns polished version + suggested subject
- **To field**: Auto-extracted or manually entered
- **Send button**: Adds email to mock Sent folder + recipient's Inbox
- Confirmation toast: "Email Sent Successfully ✓"

---

### ✏️ Screen 5 — Manual Compose
- Accessible from Compose button in nav drawer
- Fields: To, Subject, Message (text area)
- **AI Generate Subject**: Button that sends message body to OpenAI and auto-fills subject
- Send button with same confirmation behavior as voice compose

---

### 📧 Screen 6 — Email Detail View
- Opens on email card tap, marks as read
- Displays: Sender, Receiver, Subject, Full Message, Timestamp
- **Action buttons**: 
  - 🔊 Speak — reads email aloud using Web Speech Synthesis (TTS)
  - ↩️ Reply — opens compose pre-filled with To field
  - 🗑️ Delete — removes from list
  - ⭐ Important — toggles star

- **Smart Replies section**: 3 AI-generated quick reply chips (e.g. "Thank you!", "I'll review this.", "Sounds good.") — tap to instantly send

---

### ⚙️ Screen 7 — Settings Page
- Edit Profile (name/email)
- Change Password (mock)
- Voice Speed Control (slider, affects TTS playback rate)
- Dark Theme Toggle (already dark by default, optional light mode)
- Logout

---

### 🤖 AI Features (OpenAI GPT)
- **Subject Generation**: Analyzes message body → returns 1 professional subject line
- **Smart Replies**: Analyzes email content → returns 3 short contextual reply suggestions
- OpenAI API key stored securely (user will provide it via the Secrets panel)
- Graceful error handling: "AI service unavailable — please try again" with retry option

---

### 🎙️ Voice Features
- **Speech-to-Text**: Browser Web Speech API (Chrome/Edge) — live transcript in compose panel
- **Text-to-Speech**: Browser `speechSynthesis` API — reads emails aloud with adjustable speed
- **Mic permission handling**: Friendly prompt if mic access is denied

---

### 📦 Mock Data
- Pre-loaded demo emails to show the UI fully populated
- Local state management (React useState/useContext) — no database
- Emails persist in `localStorage` so they survive page refresh

---

### 🗺️ App Navigation (Routes)
- `/` → Login
- `/signup` → Signup
- `/dashboard` → Inbox Dashboard
- `/compose` → Manual Compose
- `/email/:id` → Email Detail
- `/settings` → Settings
