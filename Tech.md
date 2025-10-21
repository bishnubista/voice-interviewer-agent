# Technical Architecture: Emotion-Adaptive Voice AI

## Technology Stack

### Frontend
- **Next.js 14** (App Router) - Aligning with existing market research app
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive UI
- **Recharts** - Real-time emotional data visualization
- **Lucide React** - Icons for emotion indicators

### Backend APIs
- **Next.js API Routes** - Rapid prototyping for hackathon
- **Fast API (Python)** - Future integration with existing backend
- **REST APIs** - Standard HTTP endpoints for cross-service communication

### AI & Voice Services
- **OpenAI GPT-3.5/4** - Emotion-aware question generation
- **OpenAI Whisper** - Speech-to-text transcription
- **ElevenLabs** - Natural voice synthesis
- **Custom Emotion Analysis** - Voice pattern detection (Web Audio API)

### Authentication
- **Clerk** - Enterprise-grade auth with role-based access
- **JWT Tokens** - Cross-service authentication

### Deployment
- **Vercel** - Edge-optimized hosting for both extensions
- **Environment Variables** - Secure API key management

---

## Core Technical Components

### 1. Emotion Detection Engine

**`lib/emotionAnalysis.ts`**

```typescript
interface VoiceMetrics {
  volume: number[];        // Amplitude levels over time
  speechRate: number;      // Words per minute
  pauseDuration: number[]; // Length of pauses in ms
  responseLatency: number; // Time to start speaking
}

interface EmotionData {
  emotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
  confidence: number;      // 0-1 confidence score
  engagement: number;      // 0-100 engagement level
  authenticity: number;    // 0-100 authenticity score
}

function analyzeEmotion(voiceMetrics: VoiceMetrics, textContent: string): EmotionData {
  // 1. Analyze volume changes (enthusiasm = high volume variance)
  const volumeVariance = calculateVariance(voiceMetrics.volume);

  // 2. Analyze speech rate (uncertainty = slow + many pauses)
  const avgPause = average(voiceMetrics.pauseDuration);

  // 3. Detect stock phrases (low authenticity)
  const stockPhrases = detectStockPhrases(textContent);

  // 4. Calculate combined emotion score
  return classifyEmotion({
    volumeVariance,
    speechRate: voiceMetrics.speechRate,
    avgPause,
    stockPhraseCount: stockPhrases.length,
    responseLatency: voiceMetrics.responseLatency
  });
}
```

**Voice Pattern Detection**:
- **Web Audio API** for real-time amplitude analysis
- **AudioContext** for frequency domain analysis
- **MediaRecorder** for audio capture
- **Custom algorithms** for pause detection and speech rate

### 2. Adaptive Questioning System

**`lib/adaptiveQuestioning.ts`**

```typescript
interface AdaptiveContext {
  conversationHistory: Message[];
  currentEmotion: EmotionData;
  template: 'product_feedback' | 'ux_research' | 'brand_perception';
}

async function generateAdaptiveQuestion(context: AdaptiveContext): Promise<string> {
  const systemPrompt = buildEmotionAwarePrompt(context.currentEmotion);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemPrompt // Includes emotional context
      },
      ...context.conversationHistory
    ],
    temperature: adaptTemperature(context.currentEmotion) // Lower temp for uncertainty
  });

  return completion.choices[0].message.content;
}

function buildEmotionAwarePrompt(emotion: EmotionData): string {
  switch (emotion.emotion) {
    case 'enthusiasm':
      return `User is enthusiastic (${emotion.confidence * 100}% confidence).
              Ask deeper, more specific questions to capture this momentum.
              Probe for details and examples.`;

    case 'uncertainty':
      return `User shows uncertainty (${emotion.confidence * 100}% confidence).
              Slow down. Ask simpler questions. Provide examples or context.
              Avoid compound questions.`;

    case 'frustration':
      return `User may be frustrated (${emotion.confidence * 100}% confidence).
              Pivot topic or approach. Acknowledge their perspective.
              Consider offering a break.`;

    case 'neutral':
      return `User is neutral. Proceed with standard questioning flow.`;
  }
}
```

**Adaptation Rules**:
| Detected Emotion | AI Response Strategy |
|------------------|---------------------|
| **Enthusiasm** | Accelerate questioning, ask for specifics, probe deeper |
| **Uncertainty** | Simplify questions, provide examples, slow pace |
| **Frustration** | Pivot topic, acknowledge feelings, offer break |
| **Low Engagement** | Ask more engaging/personal questions, change format |

### 3. Multi-Modal Analysis

**`lib/multiModalAnalysis.ts`**

```typescript
interface MultiModalInsights {
  textSentiment: {
    score: number;        // -1 (negative) to +1 (positive)
    keywords: string[];
  };
  voicePatterns: {
    emotionTimeline: EmotionData[];
    engagementCurve: number[];
  };
  timingAnalysis: {
    responseLatencies: number[];
    pausePatterns: number[][];
    totalDuration: number;
  };
  authenticityScore: number;
  keyThemes: string[];
  actionableInsights: string[];
}

async function synthesizeInsights(
  transcript: string,
  voiceMetrics: VoiceMetrics[],
  emotionHistory: EmotionData[]
): Promise<MultiModalInsights> {
  // 1. Text sentiment from OpenAI
  const textSentiment = await analyzeTextSentiment(transcript);

  // 2. Voice pattern analysis
  const voicePatterns = analyzeVoiceTimeline(voiceMetrics, emotionHistory);

  // 3. Timing analysis
  const timingAnalysis = analyzeTimingPatterns(voiceMetrics);

  // 4. Authenticity scoring
  const authenticityScore = calculateAuthenticity(
    textSentiment,
    voicePatterns,
    timingAnalysis
  );

  // 5. Extract key themes
  const keyThemes = await extractThemes(transcript, emotionHistory);

  // 6. Generate actionable insights
  const actionableInsights = await generateActionableInsights({
    textSentiment,
    voicePatterns,
    authenticityScore,
    keyThemes
  });

  return {
    textSentiment,
    voicePatterns,
    timingAnalysis,
    authenticityScore,
    keyThemes,
    actionableInsights
  };
}
```

### 4. Real-Time Dashboard Architecture

**Components**:
1. **`EmotionVisualizer.tsx`** - Real-time emotion indicator
   - Color-coded emotion badges
   - Engagement level meter (0-100%)
   - Response timing chart
   - Conviction strength gauge

2. **`InsightsSummary.tsx`** - Post-interview analysis
   - Emotional arc chart (line graph over time)
   - Text sentiment vs. voice pattern comparison
   - Authenticity indicators
   - Key themes word cloud
   - Actionable insights list

**Data Flow**:
```
User speaks
  ↓
MediaRecorder captures audio
  ↓
Web Audio API analyzes amplitude/frequency
  ↓
Calculate voice metrics (volume, rate, pauses)
  ↓
Send to /api/analyze-emotion
  ↓
Classify emotion + calculate engagement
  ↓
Update React state
  ↓
EmotionVisualizer re-renders (< 100ms latency)
  ↓
Emotion data sent to /api/generate-question
  ↓
GPT generates adaptive follow-up
  ↓
Cycle repeats
```

---

## API Endpoints

### Core Emotion-Adaptive APIs

#### 1. Analyze Emotion
```typescript
POST /api/analyze-emotion

Request:
{
  audioBlob: File,              // Audio recording
  transcript: string,           // Text from Whisper
  previousEmotions: EmotionData[] // History for trend analysis
}

Response:
{
  emotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral',
  confidence: 0.87,
  engagement: 75,
  authenticity: 82,
  voiceMetrics: {
    volume: [0.5, 0.6, 0.7],
    speechRate: 145,  // WPM
    pauseDuration: [200, 350, 180],
    responseLatency: 450 // ms
  }
}
```

#### 2. Generate Adaptive Question
```typescript
POST /api/generate-question

Request:
{
  conversationHistory: Message[],
  currentEmotion: EmotionData,
  template: 'product_feedback'
}

Response:
{
  question: "Can you tell me more about which specific features excite you?",
  reasoning: "Following up on detected enthusiasm to capture specific details",
  adaptationApplied: "Accelerated questioning due to high engagement"
}
```

#### 3. Synthesize Multi-Modal Insights
```typescript
POST /api/synthesize-insights

Request:
{
  sessionId: string,
  transcript: string,
  voiceMetrics: VoiceMetrics[],
  emotionHistory: EmotionData[]
}

Response:
{
  textSentiment: { score: 0.6, keywords: ['intuitive', 'slow', 'design'] },
  voicePatterns: {
    emotionTimeline: [...],
    engagementCurve: [60, 75, 70, 80, 85]
  },
  authenticityScore: 78,
  keyThemes: ['design praise', 'performance concerns', 'usability'],
  actionableInsights: [
    'User genuinely loves design (high authenticity + enthusiasm)',
    'Performance concerns are a blocker (frustration detected)',
    'Consider optimization of loading times'
  ]
}
```

---

## Implementation Priorities for Hackathon

### Must-Have (Core UVP)
1. ✅ **Real-time emotion detection** (even if basic 3-state)
2. ✅ **Adaptive questioning** based on emotion
3. ✅ **Visual dashboard** showing emotion updates
4. ✅ **Multi-modal insights** summary at end

### Nice-to-Have (Polish)
1. ElevenLabs voice (can fallback to browser SpeechSynthesis)
2. Advanced emotion states (5+ emotions)
3. PDF export with charts
4. Interview templates (can use single default)

### Can Skip (Post-Hackathon)
1. Interview scheduling
2. Mobile app
3. Real-time collaboration
4. Enterprise SSO

---

## Performance Considerations

### Latency Targets
- **Emotion detection**: < 500ms after recording stops
- **Dashboard update**: < 100ms after emotion detected
- **Question generation**: < 2 seconds
- **Voice synthesis**: < 3 seconds (or skip for speed)

### Optimization Strategies
1. **Parallel processing**: Analyze emotion while transcribing
2. **Client-side metrics**: Calculate volume/timing in browser
3. **Streaming responses**: Use OpenAI streaming for faster perceived performance
4. **Caching**: Cache common question templates
5. **Mock data fallback**: If real-time fails, use pre-computed demo data

---

## Integration with Existing Systems

### Fast API Backend (Post-Hackathon)
```python
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()

class EmotionData(BaseModel):
    emotion: str
    confidence: float
    engagement: int
    authenticity: int

@app.post("/api/interviews/{interview_id}/emotions")
async def store_emotion_data(
    interview_id: str,
    emotion_data: EmotionData,
    user: dict = Depends(verify_clerk_token)
):
    # Store in database
    db.interviews.update_one(
        {"_id": interview_id},
        {"$push": {"emotions": emotion_data.dict()}}
    )
    return {"success": True}
```

### Webhook Integration
```typescript
// Notify main app when interview completes
POST /webhook/interview-complete
{
  sessionId: string,
  userId: string,
  insights: MultiModalInsights,
  timestamp: Date
}
```

---

## Security Considerations

1. **Audio Data**: Encrypted in transit (HTTPS), not stored permanently
2. **API Keys**: Environment variables, never in client code
3. **Session Tokens**: JWT with short expiration (1 hour)
4. **CORS**: Restricted to known origins
5. **Rate Limiting**: 20 requests/minute per user for emotion API

---

**For complete API specifications, see [API_CONTRACT.md](./docs/API_CONTRACT.md)**
