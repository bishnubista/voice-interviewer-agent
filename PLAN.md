# Hackathon Project Plan: Empathetic Insights - Emotion-Adaptive Voice AI

**Project**: Clerk Authentication + Emotion-Adaptive Voice AI Interviewer
**Unique Value Proposition**: First market research tool that analyzes emotional context in real-time to uncover the truth behind consumer responses
**Timeline**: Single Day Hackathon (9:00 AM - 4:00 PM)
**Team**: 3 developers (Dev 1: Auth, Dev 2: Voice AI, You: Coordination)

---

## Phase 1: Project Scaffolding & Environment Setup
**Duration**: 9:00-10:00 AM (1 hour)
**Goal**: Initialize both Next.js applications with proper dependencies and configuration

### Tasks

#### Clerk Authentication Extension (Dev 1)
- [ ] Create Next.js app: `npx create-next-app@latest clerk-auth-extension --typescript --tailwind --app`
- [ ] Install Clerk SDK: `npm install @clerk/nextjs`
- [ ] Create `.env.local` with Clerk API keys
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-key>
  CLERK_SECRET_KEY=<your-secret>
  ```
- [ ] Set up basic folder structure:
  ```
  app/
    ├── api/auth/
    ├── sign-in/
    ├── sign-up/
    └── dashboard/
  components/
  lib/
  ```
- [ ] Create `.env.example` template for documentation

#### Voice AI Interviewer Extension (Dev 2)
- [ ] Create Next.js app: `npx create-next-app@latest voice-interviewer-extension --typescript --tailwind --app`
- [ ] Install dependencies:
  ```bash
  npm install openai axios @types/dom-mediacapture-record
  npm install recharts lucide-react          # For emotional insights visualization
  npm install -D @types/node
  ```
- [ ] Create `.env.local` with API keys
  ```bash
  OPENAI_API_KEY=<your-key>
  ELEVENLABS_API_KEY=<your-key>
  ```
- [ ] Set up basic folder structure:
  ```
  app/
    ├── api/
    │   ├── transcribe/
    │   ├── generate-question/
    │   ├── synthesize-voice/
    │   └── analyze-emotion/        # NEW: Emotion analysis endpoint
    ├── interview/
  components/
    ├── VoiceRecorder.tsx
    ├── TranscriptDisplay.tsx
    ├── AIInterviewer.tsx
    ├── EmotionVisualizer.tsx       # NEW: Real-time emotion dashboard
    └── InsightsSummary.tsx         # NEW: Multi-modal insights display
  hooks/
    ├── useRecorder.ts
    └── useEmotionDetection.ts      # NEW: Real-time emotion tracking
  lib/
    ├── emotionAnalysis.ts          # NEW: Voice pattern analysis
    └── authenticityDetection.ts    # NEW: Detect stock phrases
  ```
- [ ] Create `.env.example` template

#### Project Coordination (You)
- [ ] Initialize GitHub repository: `clerk-hackathon-extensions`
- [ ] Create branches: `main`, `clerk-auth`, `voice-ai`
- [ ] Create `API_CONTRACT.md` with endpoint specifications
- [ ] Set up `.gitignore` to exclude `.env.local` files
- [ ] Create shared documentation structure:
  ```
  docs/
    ├── integration-guide.md
    └── demo-script.md
  ```

### Phase 1 Validation ✅
**Must Pass Before Phase 2:**
- [ ] Both Next.js apps run successfully: `npm run dev`
- [ ] Environment variables load correctly (test with `console.log`)
- [ ] No TypeScript errors: `npm run build`
- [ ] Git repository initialized with all branches
- [ ] `.env.example` files committed (NOT `.env.local`)

**Validation Commands:**
```bash
# In each project directory
npm run dev          # Should start on localhost:3000 (clerk) / 3001 (voice)
npm run build        # Should complete without errors
git status           # Should NOT show .env.local files
```

---

## Phase 2: Core Authentication Implementation
**Duration**: 10:00 AM-12:00 PM (2 hours)
**Goal**: Working authentication flow with sign-up, sign-in, and protected routes

### Tasks

#### Clerk Authentication Extension (Dev 1)
- [ ] Wrap app with `<ClerkProvider>` in `app/layout.tsx`
- [ ] Create sign-in page: `app/sign-in/[[...sign-in]]/page.tsx`
- [ ] Create sign-up page: `app/sign-up/[[...sign-up]]/page.tsx`
- [ ] Implement middleware for protected routes:
  ```typescript
  // middleware.ts
  import { authMiddleware } from "@clerk/nextjs";

  export default authMiddleware({
    publicRoutes: ["/", "/sign-in", "/sign-up"],
  });
  ```
- [ ] Create protected dashboard page showing user info
- [ ] Add user metadata for roles (interviewer/respondent)
- [ ] Create `<UserButton />` component in header

#### Voice AI Interviewer Extension (Dev 2)
- [ ] Create `useRecorder` hook with MediaRecorder API
- [ ] Build `VoiceRecorder` component with start/stop controls
- [ ] Implement `useEmotionDetection` hook to track:
  - Voice volume/amplitude changes
  - Speech rate (words per minute)
  - Pause duration tracking
  - Response latency timing
- [ ] Create interview session context/state management with emotion state
- [ ] Set up interview page: `app/interview/page.tsx` with split view:
  - Left: Conversation interface
  - Right: Real-time emotion dashboard
- [ ] Build `EmotionVisualizer` component showing:
  - Current emotional state (enthusiasm/uncertainty/frustration/neutral)
  - Engagement level meter
  - Response timing graph
- [ ] Add visual feedback for recording state (red dot, waveform, emotion indicators)

### Phase 2 Validation ✅
**Must Pass Before Phase 3:**

#### Clerk Auth Tests:
- [ ] User can sign up with email/password
- [ ] User can sign in with existing credentials
- [ ] Protected routes redirect to sign-in when unauthenticated
- [ ] Dashboard displays user name and email
- [ ] Build succeeds: `npm run build`

#### Voice AI Tests:
- [ ] Browser requests microphone permission correctly
- [ ] Recording starts and stops on button click
- [ ] Audio blob is captured (check with `console.log(audioBlob)`)
- [ ] UI shows clear recording state (button color changes)
- [ ] Emotion detection hook captures basic metrics:
  - Volume levels logged to console
  - Timing data tracked (start/stop timestamps)
- [ ] EmotionVisualizer component renders with placeholder data
- [ ] Split view layout displays correctly (conversation + emotion dashboard)
- [ ] Build succeeds: `npm run build`

**Validation Commands:**
```bash
# Manual testing checklist
✓ Sign up new user → Should see dashboard
✓ Sign out → Should redirect to home
✓ Access /dashboard without auth → Should redirect to /sign-in
✓ Click record → Should see red recording indicator
✓ Stop recording → Should log audio blob to console
```

---

## Phase 3: Emotion-Adaptive AI & Multi-Modal Analysis
**Duration**: 12:30-2:30 PM (2 hours)
**Goal**: Complete emotion-adaptive interview flow with real-time emotional context detection

### Tasks

#### Clerk Authentication Extension (Dev 1)
- [ ] Create API route: `app/api/auth/verify/route.ts` for token validation
- [ ] Implement session token generation for cross-service auth
- [ ] Add passwordless authentication (Magic Links via Clerk)
- [ ] Build user dashboard with:
  - Profile information
  - Role badge (interviewer/respondent)
  - Mock "scheduled interviews" list
- [ ] Style all auth pages with Tailwind (clean, professional design)
- [ ] Create JWT utility functions in `lib/auth.ts`
- [ ] Document API endpoints in `API_CONTRACT.md`

#### Voice AI Interviewer Extension (Dev 2)

**Core API Endpoints:**
- [ ] Create emotion analysis endpoint: `app/api/analyze-emotion/route.ts`
  ```typescript
  // Analyze voice patterns for emotional context
  // Returns: { emotion, confidence, engagement, authenticity }
  ```
- [ ] Implement transcription endpoint: `app/api/transcribe/route.ts` (OpenAI Whisper)
- [ ] Add ElevenLabs voice synthesis: `app/api/synthesize-voice/route.ts`
- [ ] Create adaptive question generation: `app/api/generate-question/route.ts`
  ```typescript
  // Generate questions based on BOTH conversation history AND emotional state
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      ...conversationHistory,
      {
        role: "system",
        content: `Emotional context: ${emotionData.emotion}.
                  Engagement: ${emotionData.engagement}.
                  Adapt questioning accordingly.`
      }
    ],
  });
  ```

**Emotion-Adaptive Questioning Logic:**
- [ ] Implement `lib/emotionAnalysis.ts`:
  - Analyze audio amplitude for volume changes
  - Calculate speech rate (words per minute)
  - Detect pauses and hesitations
  - Measure response latency
  - Classify emotion: enthusiasm/uncertainty/frustration/neutral
- [ ] Build `lib/authenticityDetection.ts`:
  - Detect stock phrases ("I guess", "probably", "maybe")
  - Flag rehearsed vs genuine responses
  - Measure conviction strength
- [ ] Create adaptive question selection:
  - **High Enthusiasm** → Accelerate questioning, ask deeper questions
  - **Uncertainty Detected** → Slow down, simplify questions, provide examples
  - **Frustration Rising** → Pivot topic, offer break, adjust approach
  - **Low Engagement** → Ask more engaging/personal questions

**Multi-Modal Insight Synthesis:**
- [ ] Build conversation flow with emotion tracking:
  1. AI asks question (text-to-speech)
  2. User responds (voice recording + emotion analysis)
  3. Transcribe response (Whisper API)
  4. Analyze emotional context (voice patterns, timing, text sentiment)
  5. Generate adaptive follow-up based on content + emotion
  6. Update real-time dashboard
  7. Repeat
- [ ] Create `InsightsSummary` component showing:
  - Text sentiment analysis
  - Voice pattern insights
  - Response timing graph
  - Authenticity indicators
  - Key themes extraction
  - Emotional arc over interview
- [ ] Implement real-time `EmotionVisualizer` updates:
  - Emotion state indicator (color-coded badges)
  - Engagement level meter (0-100%)
  - Response timing chart
  - Conviction strength gauge
- [ ] Add export functionality with multi-modal data:
  - Full transcript with timestamps
  - Emotional context for each response
  - Voice metrics (volume, pace, pauses)
  - Authenticity flags
  - Export formats: JSON, CSV, PDF report
- [ ] Create interview templates:
  - Product feedback (focus on usability emotions)
  - Brand perception (detect authenticity gaps)
  - UX research (track frustration indicators)

#### Integration Mock (You)
- [ ] Create mock integration showing auth → interview flow
- [ ] Build simple landing page linking both extensions
- [ ] Document integration architecture in `docs/integration-guide.md`
- [ ] Prepare localhost demo instructions

### Phase 3 Validation ✅
**Must Pass Before Phase 4:**

#### Clerk Auth Tests:
- [ ] `/api/auth/verify` returns 200 with valid token
- [ ] `/api/auth/verify` returns 401 with invalid token
- [ ] Magic link authentication works (email sent and login succeeds)
- [ ] Dashboard displays all user information correctly
- [ ] No console errors in browser
- [ ] Build succeeds: `npm run build`

#### Voice AI Tests:
- [ ] Complete emotion-adaptive interview flow works end-to-end:
  1. AI speaks opening question (audio plays)
  2. User records response
  3. Transcript appears in conversation
  4. **Emotion analysis runs** (check console for emotion data)
  5. **Real-time dashboard updates** with emotional context
  6. AI generates adaptive follow-up based on detected emotion
  7. Process repeats for 3-5 exchanges
- [ ] Emotion detection accuracy test:
  - Speak enthusiastically → Dashboard shows "enthusiasm"
  - Speak with hesitation → Dashboard shows "uncertainty"
  - Long pauses → Detected and logged
- [ ] Adaptive questioning test:
  - High engagement → AI asks deeper questions
  - Low engagement → AI simplifies or pivots
- [ ] Export button downloads multi-modal data (JSON with emotion metadata)
- [ ] Interview templates load with different emotional focus
- [ ] `InsightsSummary` displays:
  - Emotional arc chart
  - Text sentiment vs voice pattern comparison
  - Authenticity indicators
- [ ] No API errors in Network tab
- [ ] Build succeeds: `npm run build`

**Validation Commands:**
```bash
# API endpoint tests
curl http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <test-token>"

# Should return JSON with authentication status

# Build validation
cd clerk-auth-extension && npm run build
cd ../voice-interviewer-extension && npm run build

# Both should complete without errors or warnings
```

---

## Phase 4: Demo Preparation & Deployment
**Duration**: 2:00-4:00 PM (2 hours)
**Goal**: Polished demo ready for judges with backup plans

### Tasks

#### Deployment (All)
- [ ] Deploy Clerk Auth to Vercel:
  ```bash
  cd clerk-auth-extension
  vercel --prod
  ```
- [ ] Deploy Voice AI to Vercel:
  ```bash
  cd voice-interviewer-extension
  vercel --prod
  ```
- [ ] Add environment variables to Vercel dashboard
- [ ] Test deployed versions on multiple browsers (Chrome, Safari)
- [ ] Verify HTTPS and CORS configurations

#### Demo Preparation (You)
- [ ] Create presentation deck (Google Slides/Keynote):
  - **Problem statement** (30 sec): The $76B market research authenticity gap
  - **Solution overview** (30 sec): Emotion-adaptive AI that reads between the lines
  - **Live demo** (3 min): Focus on the "wow moment" - real-time emotional dashboard
  - **Business value** (30 sec): How this prevents product failures like Google Glass
  - **Tech implementation** (30 sec): Architecture + Clerk integration
- [ ] Record backup demo video emphasizing:
  - Split-screen view (conversation + emotional dashboard)
  - Real-time emotion detection changing as user speaks
  - AI adapting questions based on detected emotion
  - Final insights showing multi-modal analysis
- [ ] Prepare 2-3 demo scenarios showing different emotions:
  - **Scenario 1**: Enthusiastic response → AI accelerates questioning
  - **Scenario 2**: Hesitant response → AI slows down, simplifies
  - **Scenario 3**: Frustrated response → AI pivots topic
- [ ] Create one-page handout for judges with:
  - QR codes to deployed apps
  - **Key differentiator**: "First AI interviewer that adapts to emotional context"
  - Case study: How this could have prevented major failures
  - Team contact information
- [ ] Practice 5-minute pitch emphasizing:
  - **The "wow moment"**: Live emotional dashboard updates
  - **The insight gap**: What people say vs. how they say it
  - **Business impact**: Reducing 87% product failure rate

#### Polish & Bug Fixes (All)
- [ ] Fix any TypeScript warnings
- [ ] Add loading states to all async operations
- [ ] Implement error boundaries for graceful failures
- [ ] Add proper error messages (not just console logs)
- [ ] Test accessibility (keyboard navigation, ARIA labels)
- [ ] Optimize Lighthouse scores (aim for 90+ performance)

### Phase 4 Validation ✅
**Must Pass Before Demo:**

#### Deployment Tests:
- [ ] Both Vercel URLs load without errors
- [ ] Authentication works on production deployment
- [ ] Voice recording works in production (microphone permissions)
- [ ] All API endpoints return expected responses
- [ ] No CORS errors in browser console
- [ ] Mobile responsiveness (test on phone)

#### Demo Rehearsal:
- [ ] Complete user journey takes < 3 minutes to demonstrate
- [ ] **Emotional dashboard is visible and updates in real-time**
- [ ] All team members know their speaking parts
- [ ] Demo scenarios trigger different adaptive responses:
  - Enthusiasm → Deeper questions
  - Hesitation → Simpler questions
  - Frustration → Topic pivot
- [ ] Backup video plays correctly with clear emotional visualization
- [ ] Test accounts work reliably
- [ ] Presentation flows smoothly, emphasizing the "authenticity gap" problem
- [ ] **"Wow moment" timing**: Emotional dashboard update happens within 15-20 seconds of demo start

**Final Validation Checklist:**
```bash
# Production smoke tests
✓ Open https://clerk-auth-*.vercel.app → Sign up → See dashboard
✓ Open https://voice-ai-*.vercel.app → Start interview → Record response
✓ **Verify emotional dashboard updates in real-time**
✓ **Speak enthusiastically → Dashboard shows "enthusiasm"**
✓ **Speak with hesitation → Dashboard shows "uncertainty"**
✓ **AI adapts follow-up question based on detected emotion**
✓ End interview → See multi-modal insights summary
✓ Check Network tab → No failed requests
✓ Check Console → No errors
✓ Test on mobile → Everything functional (especially emotion visualization)
✓ Refresh page mid-interview → State persists
```

---

## Success Criteria (Judging Rubric)

### ✅ End-to-End Functionality (40%)
- User can complete full journey: sign up → authenticate → conduct **emotion-adaptive** voice interview → see **multi-modal insights**
- **Real-time emotional dashboard** updates during interview
- No critical bugs or crashes during demo
- All core features work as described: transcription, emotion detection, adaptive questioning

### ✅ Ease of Use (30%)
- Intuitive UI requiring no explanation
- **Split-screen visualization** makes emotional insights immediately visible
- Clear visual feedback for all actions (emotion badges, engagement meter)
- Minimal steps to complete tasks
- Graceful error handling with helpful messages

### ✅ Technical Innovation (20%)
- **Real-time emotion detection** from voice patterns (amplitude, pace, pauses)
- **Adaptive questioning** that responds to detected emotional state
- **Multi-modal analysis** combining text sentiment + voice patterns + timing
- **Authenticity detection** identifying stock phrases and conviction gaps
- Secure authentication with role-based access (Clerk)
- Clean integration architecture for future scalability

### ✅ Business Value (10%)
- Clear problem statement: **The $76B authenticity gap** in market research
- Quantifiable impact:
  - Address 87% product failure rate by detecting emotional disconnects
  - 10x more respondent availability (asynchronous interviews)
  - ~$0.15 per 10-minute interview vs. $50-100 for human interviewer
- **Case studies**: Could have prevented Google Glass, New Coke failures
- Realistic go-to-market: B2B sales to research firms, enterprise teams, marketing agencies

---

## Risk Mitigation & Contingency Plans

### High-Risk Items

| Risk | Probability | Mitigation Strategy |
|------|-------------|---------------------|
| ElevenLabs API latency | High | Use browser `SpeechSynthesis` as fallback |
| OpenAI rate limits | Medium | Use GPT-3.5-turbo (cheaper), implement exponential backoff |
| Microphone permissions denied | Medium | Clear UI instructions, test on multiple browsers |
| Network issues during demo | Low | Pre-record backup video, use localhost as fallback |
| Vercel deployment fails | Low | Keep localhost demo ready, use ngrok for public URL |

### Time Buffers

**Core Features** (Must Have):
1. Emotion detection (even if basic)
2. Real-time dashboard visualization
3. Adaptive questioning based on emotion

If running behind schedule:
- **By 12:00 PM**: Cut passwordless auth, focus on basic email/password
- **By 2:00 PM**: Simplify emotion detection to 2-3 states (enthusiasm/uncertainty/neutral) instead of full spectrum
- **By 2:30 PM**: Use mock data for emotion visualization if real-time detection isn't working
- **By 3:00 PM**: Skip ElevenLabs, use browser SpeechSynthesis
- **By 3:30 PM**: Skip Vercel deployment, demo on localhost with ngrok

**Never Cut** (These are the UVP):
- ❌ Emotion detection completely
- ❌ Adaptive questioning
- ❌ Real-time emotional dashboard

---

## Post-Hackathon Integration Roadmap

### Week 1: Core Integration
- [ ] Implement Clerk authentication in main market research app
- [ ] Migrate existing users to Clerk (if applicable)
- [ ] Connect voice interviewer to main app database

### Week 2: Data Synchronization
- [ ] Sync interview transcripts with synthetic respondent data
- [ ] Build unified analytics dashboard
- [ ] Implement interview scheduling system

### Week 3: Testing & Refinement
- [ ] End-to-end integration testing
- [ ] User acceptance testing with real market researchers
- [ ] Performance optimization and bug fixes

### Week 4: Production Deployment
- [ ] Deploy to production environment
- [ ] Set up monitoring and error tracking (Sentry)
- [ ] Create user documentation and onboarding flow

---

## Quick Reference Commands

### Development
```bash
# Start both projects simultaneously
cd clerk-auth-extension && npm run dev &
cd voice-interviewer-extension && npm run dev -- -p 3001 &

# Build both projects
npm run build --workspaces

# Type check
npm run type-check --workspaces
```

### Git Workflow
```bash
# Commit on feature branch
git checkout clerk-auth
git add .
git commit -m "feat: implement protected routes with Clerk middleware"

# Create PR
gh pr create --title "Clerk Authentication Extension" --body "See PLAN.md Phase 2"
```

### Deployment
```bash
# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs <deployment-url>
```

---

**Last Updated**: Phase 0 (Planning)
**Next Phase**: Phase 1 - Project Scaffolding
**Status**: 🟡 Ready to begin
