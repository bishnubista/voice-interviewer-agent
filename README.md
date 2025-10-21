# Empathetic Insights: Emotion-Adaptive Voice AI 🎙️💡

> **The First Market Research Tool That Reads Between the Lines**
>
> An emotion-adaptive AI interviewer that analyzes what people say AND how they say it, uncovering the truth behind consumer responses through real-time emotional context detection.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## 🎯 The $76B Authenticity Gap

Market research faces a fundamental problem: **it captures what people say, but misses how they say it.**

### The Challenge
- **87% product failure rate** despite massive research spending
- Respondents provide socially acceptable answers, not true feelings
- Text-based analysis misses crucial emotional context
- Survey fatigue leads to disengaged, superficial responses

### Real-World Failures
- **Google Glass**: Surveys were positive, but voice patterns would have revealed underlying discomfort
- **New Coke**: Taste tests showed preference, but lacked emotional attachment detection

## 💡 Solution: Emotion-Adaptive AI Interviewer

Our platform revolutionizes market research by combining **voice pattern analysis** with **adaptive questioning** to create the first truly empathetic research tool.

### Key Differentiators

#### 1. Real-Time Emotion Detection
Analyzes vocal patterns during interviews to detect:
- **Enthusiasm** → AI accelerates questioning to capture momentum
- **Uncertainty** → AI slows down and simplifies questions
- **Frustration** → AI pivots topics or adjusts approach
- **Engagement Level** → AI adapts question depth accordingly

#### 2. Multi-Modal Insight Synthesis
Creates three-dimensional insight maps:
- **Text Analysis**: What respondents say (sentiment analysis)
- **Voice Pattern Analysis**: How they say it (tone, pace, volume, pitch)
- **Response Timing**: When they hesitate (micro-pauses, latency)

#### 3. Authenticity Detection
Identifies gaps between stated opinions and true feelings:
- Flags stock phrases prompting authentic elaboration
- Detects rehearsed vs. genuine responses
- Measures conviction strength behind statements
- Identifies emotional disconnects

---

## 🏗️ Architecture

This project consists of **two independent Next.js extensions** that can be integrated into any market research platform:

```
empathetic-insights/
├── clerk-auth-extension/          # Secure authentication
│   ├── Clerk integration with role-based access
│   ├── Session management & JWT tokens
│   └── Protected routes for interviews
│
├── voice-interviewer-extension/   # Emotion-adaptive AI interviewer
│   ├── Voice recording (MediaRecorder API)
│   ├── Real-time emotion analysis ⭐
│   │   ├── Volume/amplitude tracking
│   │   ├── Speech rate calculation
│   │   ├── Pause detection
│   │   └── Response latency measurement
│   ├── Adaptive questioning (GPT-3.5/4) ⭐
│   ├── Multi-modal analysis ⭐
│   │   ├── Text sentiment (OpenAI)
│   │   ├── Voice patterns
│   │   └── Timing analysis
│   ├── Authenticity detection ⭐
│   ├── Real-time emotional dashboard 📊
│   ├── Transcription (OpenAI Whisper)
│   ├── Voice synthesis (ElevenLabs)
│   └── Multi-dimensional insights export
│
└── docs/                          # Integration guides & API contracts
```
⭐ = **Core differentiators**

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Modern React framework with SSR |
| **Authentication** | Clerk | Secure user auth & session management |
| **AI Models** | OpenAI (GPT-3.5/4, Whisper) | Adaptive questions & transcription |
| **Voice Synthesis** | ElevenLabs API | Natural AI interviewer voice |
| **Emotion Analysis** | Custom (Web Audio API + OpenAI) | Real-time emotional context detection |
| **Visualization** | Recharts + Lucide React | Real-time emotional dashboard |
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

**Option A: Install all at once (recommended)**
```bash
# From project root - installs dependencies for both apps
npm run install:all
```

**Option B: Install individually**
```bash
# Install root dependencies first
npm install

# Then install for each extension
cd clerk-auth-extension && npm install
cd ../voice-interviewer-extension && npm install
```

### 4️⃣ Run Development Servers

**Option A: Run both simultaneously (recommended)**
```bash
# From project root
npm run dev:all
```

This starts both apps concurrently:
- Clerk Auth Extension on http://localhost:3000
- Voice Interviewer on http://localhost:3001

**Option B: Run individually**
```bash
# Terminal 1 - Clerk Auth
npm run dev:auth
# Runs on http://localhost:3000

# Terminal 2 - Voice Interviewer
npm run dev:interview
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
3. **Start Interview** → Navigate to split-screen interview interface
4. **Emotion-Adaptive Voice Interaction** (The "Wow Moment"):
   - Left panel: Conversation interface
   - Right panel: **Real-time emotional dashboard** 📊
   - AI asks opening question (natural voice synthesis)
   - User records response
   - **Dashboard updates immediately** showing:
     - Detected emotion (enthusiasm/uncertainty/frustration/neutral)
     - Engagement level meter
     - Response timing visualization
     - Authenticity indicators
   - AI analyzes emotional context and **adapts next question** accordingly
   - Example: Enthusiasm detected → AI asks deeper probing questions
   - Example: Uncertainty detected → AI simplifies and provides examples
   - Conversation continues for 5-10 exchanges with continuous adaptation
5. **Review Multi-Modal Insights** → View comprehensive analysis:
   - Full transcript with timestamps
   - Emotional arc over the interview
   - Text sentiment vs. voice pattern comparison
   - Authenticity flags and conviction measurements
   - Key themes and actionable insights
6. **Export** → Download multi-dimensional data (JSON, CSV, PDF report)

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

### Available Scripts

Run these commands from the **project root**:

| Script | Description |
|--------|-------------|
| `npm run dev:all` | Run both apps concurrently (Auth on :3000, Interview on :3001) |
| `npm run dev:auth` | Run only the Clerk Auth extension |
| `npm run dev:interview` | Run only the Voice Interviewer extension |
| `npm run build:all` | Build both apps for production |
| `npm run build:auth` | Build only the Clerk Auth extension |
| `npm run build:interview` | Build only the Voice Interviewer extension |
| `npm run install:all` | Install dependencies for both apps |
| `npm run test:all` | Run tests for both apps |
| `npm run clean` | Remove all node_modules and .next build directories |

### Development Workflow

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
