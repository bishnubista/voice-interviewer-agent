# API Contract - Emotion-Adaptive Voice AI Interviewer

**Version**: 1.0
**Last Updated**: Phase 1
**Purpose**: Define integration points between authentication and voice AI systems

---

## Authentication Endpoints (Clerk Extension)

### POST `/api/auth/verify`
**Purpose**: Verify Clerk session token for cross-service authentication
**Auth Required**: Yes (Clerk session token)

**Request**:
```typescript
{
  token: string; // Clerk session token
}
```

**Response (200)**:
```typescript
{
  valid: boolean;
  userId: string;
  email: string;
  role: 'interviewer' | 'respondent';
}
```

**Response (401)**:
```typescript
{
  error: 'Invalid or expired token';
}
```

---

## Voice AI Endpoints (Voice Interviewer Extension)

### POST `/api/transcribe`
**Purpose**: Transcribe audio to text using OpenAI Whisper
**Auth Required**: Optional (Phase 1), Yes (Phase 3)
**Content-Type**: `multipart/form-data`

**Request**:
```typescript
{
  audio: File; // Audio blob (webm/mp3/wav)
  language?: string; // Default: 'en'
}
```

**Response (200)**:
```typescript
{
  transcript: string;
  confidence: number; // 0-1
  duration: number; // seconds
}
```

**Response (400)**:
```typescript
{
  error: 'Invalid audio format' | 'Audio file too large (max 25MB)';
}
```

**Response (500)**:
```typescript
{
  error: 'Transcription service unavailable';
}
```

---

### POST `/api/analyze-emotion`
**Purpose**: Analyze voice patterns for emotional context
**Auth Required**: Optional (Phase 1), Yes (Phase 3)

**Request**:
```typescript
{
  audioMetrics: {
    avgVolume: number; // 0-100
    volumeVariance: number; // 0-1
    speechRate: number; // words per minute
    avgPause: number; // milliseconds
    responseLatency: number; // milliseconds from question end
  };
  transcript?: string; // Optional text for sentiment analysis
}
```

**Response (200)**:
```typescript
{
  emotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
  confidence: number; // 0-1
  engagement: number; // 0-100
  authenticity: {
    score: number; // 0-1
    flags: string[]; // e.g., ["stock_phrases", "hesitation_markers"]
  };
  metrics: {
    volume: number;
    pace: number;
    conviction: number; // 0-1
  };
}
```

**Response (400)**:
```typescript
{
  error: 'Invalid audio metrics format';
}
```

---

### POST `/api/generate-question`
**Purpose**: Generate adaptive follow-up question based on conversation + emotion
**Auth Required**: Optional (Phase 1), Yes (Phase 3)
**Streaming**: No (returns full response)

**Request**:
```typescript
{
  conversationHistory: Array<{
    role: 'ai' | 'user';
    content: string;
    timestamp: string;
    emotion?: string; // Attached to user responses
  }>;
  currentEmotion: {
    emotion: string;
    engagement: number;
  };
  interviewTemplate?: 'product_feedback' | 'brand_perception' | 'ux_research';
}
```

**Response (200)**:
```typescript
{
  question: string;
  reasoning: string; // Why this question was chosen
  adaptationStrategy: 'accelerate' | 'simplify' | 'pivot' | 'deepen';
}
```

**Response (429)**:
```typescript
{
  error: 'Rate limit exceeded';
  retryAfter: number; // seconds
}
```

**Response (500)**:
```typescript
{
  error: 'Question generation failed';
  fallbackQuestion: string; // Generic question to keep conversation flowing
}
```

---

## Data Formats

### EmotionData Interface
```typescript
interface EmotionData {
  emotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
  confidence: number; // 0-1
  engagement: number; // 0-100
  timestamp: string; // ISO 8601
}
```

### VoiceMetrics Interface
```typescript
interface VoiceMetrics {
  avgVolume: number; // 0-100 (RMS amplitude)
  volumeVariance: number; // 0-1 (standard deviation)
  speechRate: number; // words per minute
  avgPause: number; // average pause duration in ms
  responseLatency: number; // time from question end to answer start (ms)
}
```

### InterviewSession Interface
```typescript
interface InterviewSession {
  id: string;
  userId: string;
  startTime: string; // ISO 8601
  endTime?: string;
  template: 'product_feedback' | 'brand_perception' | 'ux_research';
  exchanges: Array<{
    question: string;
    response: string;
    emotion: EmotionData;
    voiceMetrics: VoiceMetrics;
    timestamp: string;
  }>;
  summary?: {
    emotionalArc: Array<{ time: number; emotion: string }>;
    keyInsights: string[];
    authenticityScore: number;
  };
}
```

---

## Error Handling Strategy

### 4xx Errors (Client-side)
- **400**: Invalid request format - return detailed validation errors
- **401**: Authentication required/failed - redirect to sign-in
- **403**: Insufficient permissions - show upgrade prompt
- **429**: Rate limit exceeded - implement exponential backoff

### 5xx Errors (Server-side)
- **500**: General server error - use fallback mock data
- **503**: Service unavailable - queue request for retry

### Fallback Behavior
- **Emotion detection fails**: Default to "neutral" emotion
- **Transcription fails**: Allow manual text input
- **Question generation fails**: Use pre-configured question templates
- **ElevenLabs timeout**: Fall back to browser `SpeechSynthesis`

---

## Rate Limits (Phase 3+)

| Endpoint | Limit | Window | Burst |
|----------|-------|--------|-------|
| `/api/transcribe` | 10 requests | 1 minute | 3 |
| `/api/analyze-emotion` | 30 requests | 1 minute | 10 |
| `/api/generate-question` | 10 requests | 1 minute | 3 |
| `/api/auth/verify` | 60 requests | 1 minute | 20 |

---

## Mock Data Usage (Phase 1-2)

When API endpoints are not ready, use mock data from `/mocks/`:
- `mockEmotionData.ts`: Pre-computed emotion states
- `mockTranscripts.ts`: Sample interview responses
- `mockPersonas.ts`: Test user scenarios

**Switching between mock and real data**:
```typescript
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
```

---

## Integration Flow

### Complete Interview Flow
1. **User authenticates** → Clerk `/sign-in` → Session token generated
2. **Start interview** → `/api/generate-question` (initial question)
3. **User speaks** → Browser MediaRecorder captures audio
4. **Audio analysis** (parallel):
   - `/api/transcribe` → Get text
   - Calculate `VoiceMetrics` → `/api/analyze-emotion` → Get emotion
5. **Adaptive response** → `/api/generate-question` with conversation + emotion
6. **Repeat** steps 3-5 for 5-10 exchanges
7. **End interview** → Generate summary with emotional arc

---

## Security Notes

- **Never expose** Clerk secret keys or OpenAI API keys in client-side code
- **Validate** all audio file uploads (max size, file type)
- **Sanitize** transcripts before storing (remove PII if configured)
- **Implement** CORS for production deployment
- **Use HTTPS** for all production endpoints

---

**Next Steps (Phase 2)**:
- [ ] Implement actual `/api/analyze-emotion` logic
- [ ] Test with real audio samples
- [ ] Add request validation middleware
