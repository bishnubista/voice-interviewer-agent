# Hackathon Project Plan: Market Research App Extensions

**Project**: Clerk Authentication + Voice AI Interviewer Extensions
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
    │   └── synthesize-voice/
    ├── interview/
  components/
    ├── VoiceRecorder.tsx
    ├── TranscriptDisplay.tsx
    └── AIInterviewer.tsx
  hooks/
    └── useRecorder.ts
  lib/
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
- [ ] Implement basic conversation UI with message bubbles
- [ ] Create interview session context/state management
- [ ] Set up interview page: `app/interview/page.tsx`
- [ ] Add visual feedback for recording state (red dot, waveform)

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

## Phase 3: AI Integration & Advanced Features
**Duration**: 12:30-2:30 PM (2 hours)
**Goal**: Complete AI-powered interview flow with authentication integration

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
- [ ] Create OpenAI integration: `app/api/generate-question/route.ts`
  ```typescript
  // Generate follow-up questions based on conversation history
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: conversationHistory,
  });
  ```
- [ ] Implement transcription endpoint: `app/api/transcribe/route.ts`
- [ ] Add ElevenLabs voice synthesis: `app/api/synthesize-voice/route.ts`
- [ ] Build conversation flow:
  1. AI asks question (text-to-speech)
  2. User responds (voice recording)
  3. Transcribe response (Whisper API)
  4. Generate follow-up (GPT-3.5)
  5. Repeat
- [ ] Create `TranscriptDisplay` component showing conversation history
- [ ] Add basic sentiment indicators (positive/neutral/negative)
- [ ] Implement export functionality (download transcript as JSON/TXT)
- [ ] Add interview templates (product feedback, UX research, brand perception)

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
- [ ] Complete interview flow works end-to-end:
  1. AI speaks opening question (audio plays)
  2. User records response
  3. Transcript appears in conversation
  4. AI generates relevant follow-up question
  5. Process repeats for 3-5 exchanges
- [ ] Export button downloads valid JSON file
- [ ] Interview templates load different starting questions
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
  - Problem statement (1 slide)
  - Solution overview (1 slide)
  - Architecture diagram (1 slide)
  - Live demo script (1 slide)
  - Business value & next steps (1 slide)
- [ ] Record backup demo video (in case of network issues)
- [ ] Prepare test accounts for live demo
- [ ] Create one-page handout for judges with:
  - QR codes to deployed apps
  - Key technical innovations
  - Team contact information
- [ ] Practice 5-minute pitch with team (2 min auth demo, 2 min voice demo, 1 min vision)

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
- [ ] All team members know their speaking parts
- [ ] Backup video plays correctly
- [ ] Test accounts work reliably
- [ ] Presentation flows smoothly without technical jargon

**Final Validation Checklist:**
```bash
# Production smoke tests
✓ Open https://clerk-auth-*.vercel.app → Sign up → See dashboard
✓ Open https://voice-ai-*.vercel.app → Start interview → Record response → See transcript
✓ Check Network tab → No failed requests
✓ Check Console → No errors
✓ Test on mobile → Everything functional
✓ Refresh page mid-interview → State persists
```

---

## Success Criteria (Judging Rubric)

### ✅ End-to-End Functionality (40%)
- User can complete full journey: sign up → authenticate → conduct voice interview → see results
- No critical bugs or crashes during demo
- All core features work as described

### ✅ Ease of Use (30%)
- Intuitive UI requiring no explanation
- Clear visual feedback for all actions
- Minimal steps to complete tasks
- Graceful error handling with helpful messages

### ✅ Technical Innovation (20%)
- Real-time voice processing with AI-generated follow-ups
- Secure authentication with role-based access
- Clean integration architecture for future scalability

### ✅ Business Value (10%)
- Clear problem statement (scheduling mismatch in market research)
- Quantifiable impact (e.g., "10x more respondent availability")
- Realistic go-to-market strategy

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

If running behind schedule:
- **By 12:00 PM**: Cut passwordless auth, focus on basic email/password
- **By 2:00 PM**: Simplify insights panel to just transcript display (no sentiment)
- **By 3:00 PM**: Skip Vercel deployment, demo on localhost with ngrok

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
