// Mock Emotion Data for Testing
// Use these pre-computed emotion states when APIs are unavailable

export interface EmotionData {
  emotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
  confidence: number;
  engagement: number;
  timestamp: string;
  voiceMetrics: {
    avgVolume: number;
    speechRate: number;
    conviction: number;
  };
}

export const mockEmotionStates: Record<string, EmotionData> = {
  enthusiastic: {
    emotion: 'enthusiasm',
    confidence: 0.85,
    engagement: 92,
    timestamp: new Date().toISOString(),
    voiceMetrics: {
      avgVolume: 78,
      speechRate: 160,
      conviction: 0.9,
    },
  },

  uncertain: {
    emotion: 'uncertainty',
    confidence: 0.75,
    engagement: 45,
    timestamp: new Date().toISOString(),
    voiceMetrics: {
      avgVolume: 52,
      speechRate: 95,
      conviction: 0.3,
    },
  },

  frustrated: {
    emotion: 'frustration',
    confidence: 0.82,
    engagement: 68,
    timestamp: new Date().toISOString(),
    voiceMetrics: {
      avgVolume: 85,
      speechRate: 175,
      conviction: 0.7,
    },
  },

  neutral: {
    emotion: 'neutral',
    confidence: 0.65,
    engagement: 55,
    timestamp: new Date().toISOString(),
    voiceMetrics: {
      avgVolume: 60,
      speechRate: 120,
      conviction: 0.5,
    },
  },
};

// Simulate emotion progression over an interview
export const mockEmotionTimeline: EmotionData[] = [
  mockEmotionStates.neutral,
  mockEmotionStates.enthusiastic,
  mockEmotionStates.enthusiastic,
  mockEmotionStates.uncertain,
  mockEmotionStates.neutral,
  mockEmotionStates.frustrated,
  mockEmotionStates.uncertain,
  mockEmotionStates.neutral,
];

export function getRandomEmotion(): EmotionData {
  const emotions = Object.values(mockEmotionStates);
  return emotions[Math.floor(Math.random() * emotions.length)];
}
