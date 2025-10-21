# Voice Interviewer Agent 🎙️

> **AI-Powered Voice Interview Platform for Market Research**
>
> A hackathon project building two independent Next.js extensions: Clerk Authentication and Voice AI Interviewer, designed to revolutionize market research through asynchronous, AI-driven voice interviews.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## 🎯 Problem Statement

Traditional market research interviews face a critical **scheduling mismatch**:
- Researchers need insights quickly
- Respondents have limited availability
- Coordinating live interviews is time-consuming and expensive
- Quality suffers when respondents are rushed or interrupted

## 💡 Solution

**Voice Interviewer Agent** solves this by enabling:
1. **Asynchronous Interviews**: Respondents participate on their own schedule
2. **AI-Driven Conversations**: Natural, adaptive follow-up questions powered by GPT
3. **Secure Authentication**: Role-based access for interviewers and respondents
4. **Voice-First UX**: Natural conversation flow with speech-to-text and text-to-speech

---

## 🏗️ Architecture

This project consists of **two independent Next.js extensions** that can be integrated into a larger market research platform:

```
voice-interviewer-agent/
├── clerk-auth-extension/          # Authentication & user management
│   ├── Clerk integration
│   ├── Role-based access (interviewer/respondent)
│   ├── Session management
│   └── Protected routes
│
├── voice-interviewer-extension/   # AI voice interview platform
│   ├── Voice recording (MediaRecorder API)
│   ├── Real-time transcription (OpenAI Whisper)
│   ├── AI question generation (GPT-3.5/4)
│   ├── Voice synthesis (ElevenLabs)
│   └── Interview analytics & export
│
└── docs/                          # Integration guides & API contracts
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Modern React framework with SSR |
| **Authentication** | Clerk | Secure user auth & session management |
| **AI Models** | OpenAI (GPT-3.5/4, Whisper) | Question generation & transcription |
| **Voice Synthesis** | ElevenLabs API | Natural-sounding AI interviewer voice |
| **Styling** | Tailwind CSS | Responsive, utility-first design |
| **Language** | TypeScript | Type-safe development |
| **Deployment** | Vercel | Edge-optimized hosting |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **API Keys** (see [Environment Setup](#environment-setup))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/voice-interviewer-agent.git
cd voice-interviewer-agent
```

### 2️⃣ Environment Setup

Create `.env.local` files in both extension directories:

#### Clerk Authentication Extension
```bash
cd clerk-auth-extension
cp .env.example .env.local
```

Add your Clerk credentials to `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_<your-key>
CLERK_SECRET_KEY=sk_test_<your-secret>
```

Get your keys from [Clerk Dashboard](https://dashboard.clerk.com/)

#### Voice Interviewer Extension
```bash
cd voice-interviewer-extension
cp .env.example .env.local
```

Add your API credentials to `.env.local`:
```bash
OPENAI_API_KEY=sk-<your-openai-key>
ELEVENLABS_API_KEY=<your-elevenlabs-key>
```

Get your keys from:
- [OpenAI Platform](https://platform.openai.com/api-keys)
- [ElevenLabs](https://elevenlabs.io/)

### 3️⃣ Install Dependencies

```bash
# Install for both extensions
cd clerk-auth-extension && npm install
cd ../voice-interviewer-extension && npm install
```

### 4️⃣ Run Development Servers

**Option A: Run both simultaneously (recommended)**
```bash
# From project root
npm run dev:all
```

**Option B: Run individually**
```bash
# Terminal 1 - Clerk Auth
cd clerk-auth-extension
npm run dev
# Runs on http://localhost:3000

# Terminal 2 - Voice Interviewer
cd voice-interviewer-extension
npm run dev -- -p 3001
# Runs on http://localhost:3001
```

### 5️⃣ Access the Applications

- **Clerk Auth Extension**: http://localhost:3000
  - Sign up / Sign in
  - View user dashboard
  - Test protected routes

- **Voice Interviewer**: http://localhost:3001
  - Start voice interview
  - Record responses
  - See AI-generated follow-up questions

---

## 📋 Project Structure

```
voice-interviewer-agent/
├── clerk-auth-extension/
│   ├── app/
│   │   ├── api/auth/verify/          # Token validation endpoint
│   │   ├── sign-in/[[...sign-in]]/   # Clerk sign-in page
│   │   ├── sign-up/[[...sign-up]]/   # Clerk sign-up page
│   │   ├── dashboard/                # Protected user dashboard
│   │   └── layout.tsx                # ClerkProvider wrapper
│   ├── components/
│   │   ├── AuthButton.tsx            # Sign in/out button
│   │   └── UserProfile.tsx           # User info display
│   ├── middleware.ts                 # Route protection
│   └── lib/auth.ts                   # Auth utilities
│
├── voice-interviewer-extension/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transcribe/           # Speech-to-text endpoint
│   │   │   ├── generate-question/    # AI question generation
│   │   │   └── synthesize-voice/     # Text-to-speech endpoint
│   │   └── interview/                # Interview interface
│   ├── components/
│   │   ├── VoiceRecorder.tsx         # Audio recording controls
│   │   ├── TranscriptDisplay.tsx     # Conversation history
│   │   └── AIInterviewer.tsx         # Main interview component
│   ├── hooks/
│   │   └── useRecorder.ts            # MediaRecorder hook
│   └── lib/
│       ├── openai.ts                 # OpenAI client
│       └── elevenlabs.ts             # ElevenLabs client
│
├── docs/
│   ├── integration-guide.md          # How to integrate extensions
│   ├── API_CONTRACT.md               # API specifications
│   └── demo-script.md                # Demo presentation guide
│
├── PLAN.md                           # Phased implementation plan
├── PRODUCT.md                        # Product requirements
└── Tech.md                           # Technical specifications
```

---

## 🎬 Demo Flow

### User Journey
1. **Sign Up** → Create account with Clerk (email/password or magic link)
2. **Authenticate** → Securely log in and access dashboard
3. **Start Interview** → Navigate to interview page
4. **Voice Interaction**:
   - AI asks opening question (plays audio)
   - User records response
   - AI transcribes and generates follow-up question
   - Conversation continues for 5-10 exchanges
5. **Review & Export** → View transcript and download results

---

---

## 🔗 API Endpoints

### Clerk Auth Extension

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/verify` | POST | Validate session token |

**Request:**
```json
{
  "token": "jwt_session_token"
}
```

**Response:**
```json
{
  "authenticated": true,
  "userId": "user_123",
  "role": "respondent"
}
```

### Voice Interviewer Extension

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/transcribe` | POST | Convert audio to text |
| `/api/generate-question` | POST | Generate follow-up question |
| `/api/synthesize-voice` | POST | Convert text to speech |

See [API_CONTRACT.md](docs/API_CONTRACT.md) for detailed specifications.

---

## 🛠️ Development

See [PLAN.md](PLAN.md) for detailed phase-based development plan with validation criteria.

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/voice-recording

# Make changes, then commit
git add .
git commit -m "feat: implement voice recording with MediaRecorder API"

# Push and create PR
git push origin feature/voice-recording
gh pr create --title "Add voice recording" --body "Implements Phase 2 voice capture"
```

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

#### Deploy Clerk Auth Extension
```bash
cd clerk-auth-extension
vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

#### Deploy Voice Interviewer Extension
```bash
cd voice-interviewer-extension
vercel --prod
```

Add environment variables in Vercel dashboard:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`

---

## 🎯 Roadmap

### Hackathon MVP (Day 1)
- [x] Project scaffolding
- [x] Clerk authentication integration
- [x] Voice recording capability
- [ ] OpenAI question generation
- [ ] ElevenLabs voice synthesis
- [ ] Basic transcript export

### Post-Hackathon (Week 1-4)
- [ ] Integrate both extensions into main market research app
- [ ] Interview scheduling system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Enterprise SSO integration

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Clerk** - For seamless authentication APIs
- **OpenAI** - For GPT and Whisper models
- **ElevenLabs** - For natural voice synthesis
- **Vercel** - For edge-optimized deployment

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/voice-interviewer-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/voice-interviewer-agent/discussions)

---

<div align="center">

**Built with ❤️ for the Hackathon**

🤖 *Generated with [Claude Code](https://claude.com/claude-code)*

</div>
