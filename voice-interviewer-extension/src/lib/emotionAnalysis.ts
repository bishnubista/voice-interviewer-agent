// MVP Emotion Detection - Heuristic-based analysis
// Works without external APIs using voice pattern analysis

export interface VoiceMetrics {
  avgVolume: number; // 0-100 (RMS amplitude)
  volumeVariance: number; // 0-1 (standard deviation)
  speechRate: number; // words per minute (estimated)
  avgPause: number; // average pause duration in ms
  responseLatency: number; // time from question end to answer start (ms)
  peakVolume: number; // Maximum volume detected
}

export interface EmotionResult {
  emotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
  confidence: number; // 0-1
  engagement: number; // 0-100
  authenticity: {
    score: number; // 0-1
    flags: string[];
  };
  metrics: {
    volume: number;
    pace: number;
    conviction: number;
  };
}

/**
 * Classify emotion based on voice metrics using heuristic rules
 * This is the MVP approach that works without external APIs
 */
export function classifyEmotion(metrics: VoiceMetrics, transcript?: string): EmotionResult {
  const { avgVolume, volumeVariance, speechRate, avgPause, peakVolume } = metrics;

  // Debug logging to see actual metrics
  console.log('🔍 Emotion Analysis Metrics:', {
    avgVolume,
    volumeVariance,
    speechRate,
    avgPause,
    peakVolume,
    transcript: transcript?.substring(0, 50)
  });

  // Calculate engagement based on volume and speech rate
  const volumeEngagement = Math.min(avgVolume / 70 * 50, 50); // Max 50 points
  const paceEngagement = speechRate > 100 ? Math.min((speechRate - 100) / 80 * 50, 50) : 0; // Max 50 points
  const engagement = Math.round(volumeEngagement + paceEngagement);

  // Analyze text for authenticity (if transcript provided)
  const authenticityAnalysis = transcript ? analyzeAuthenticity(transcript) : {
    score: 0.7,
    flags: []
  };

  // Conviction score based on volume consistency and pace
  const conviction = Math.min(
    (avgVolume / 100) * 0.4 +
    (1 - volumeVariance) * 0.3 +
    (speechRate / 200) * 0.3,
    1
  );

  // Weighted scoring system for emotion classification
  // Calculate scores for each emotion (0-100)

  const enthusiasmScore =
    (avgVolume > 45 ? (avgVolume - 45) * 2 : 0) + // High volume
    (speechRate > 130 ? (speechRate - 130) * 0.5 : 0) + // Fast speech
    (avgPause < 500 ? (500 - avgPause) * 0.05 : 0) + // Short pauses
    (conviction > 0.5 ? (conviction - 0.5) * 50 : 0); // Strong conviction

  const frustrationScore =
    (volumeVariance > 0.15 ? (volumeVariance - 0.15) * 100 : 0) + // High variance
    (speechRate > 140 ? (speechRate - 140) * 0.4 : 0) + // Fast speech
    (peakVolume > 60 ? (peakVolume - 60) * 0.8 : 0) + // Volume spikes
    (avgPause < 400 ? (400 - avgPause) * 0.04 : 0); // Short, choppy pauses

  const uncertaintyScore =
    (avgVolume < 50 ? (50 - avgVolume) * 1.5 : 0) + // Low volume
    (speechRate < 120 ? (120 - speechRate) * 0.6 : 0) + // Slow speech
    (avgPause > 400 ? (avgPause - 400) * 0.06 : 0) + // Long pauses
    (conviction < 0.5 ? (0.5 - conviction) * 40 : 0); // Lack of conviction

  console.log('📊 Emotion Scores:', {
    enthusiasm: enthusiasmScore.toFixed(2),
    frustration: frustrationScore.toFixed(2),
    uncertainty: uncertaintyScore.toFixed(2)
  });

  // Determine dominant emotion (threshold: 15 points)
  const minScore = 15;
  const maxScore = Math.max(enthusiasmScore, frustrationScore, uncertaintyScore);

  if (maxScore < minScore) {
    // No strong emotion detected
    return {
      emotion: 'neutral',
      confidence: 0.70,
      engagement,
      authenticity: authenticityAnalysis,
      metrics: {
        volume: avgVolume,
        pace: speechRate,
        conviction
      }
    };
  }

  // Return dominant emotion
  if (enthusiasmScore === maxScore && enthusiasmScore >= minScore) {
    return {
      emotion: 'enthusiasm',
      confidence: Math.min(0.65 + enthusiasmScore / 100, 0.95),
      engagement,
      authenticity: authenticityAnalysis,
      metrics: {
        volume: avgVolume,
        pace: speechRate,
        conviction
      }
    };
  }

  if (frustrationScore === maxScore && frustrationScore >= minScore) {
    return {
      emotion: 'frustration',
      confidence: Math.min(0.65 + frustrationScore / 100, 0.92),
      engagement,
      authenticity: authenticityAnalysis,
      metrics: {
        volume: avgVolume,
        pace: speechRate,
        conviction
      }
    };
  }

  if (uncertaintyScore === maxScore && uncertaintyScore >= minScore) {
    return {
      emotion: 'uncertainty',
      confidence: Math.min(0.60 + uncertaintyScore / 100, 0.88),
      engagement: Math.max(engagement - 10, 0),
      authenticity: authenticityAnalysis,
      metrics: {
        volume: avgVolume,
        pace: speechRate,
        conviction
      }
    };
  }

  // Fallback to neutral
  return {
    emotion: 'neutral',
    confidence: 0.65,
    engagement,
    authenticity: authenticityAnalysis,
    metrics: {
      volume: avgVolume,
      pace: speechRate,
      conviction
    }
  };
}

/**
 * Analyze transcript for authenticity markers
 */
function analyzeAuthenticity(transcript: string): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 1.0;

  const lowerText = transcript.toLowerCase();

  // Check for hesitation markers
  const hesitationMarkers = ['um', 'uh', 'like', 'you know', 'i mean', 'sort of', 'kind of'];
  const hesitationCount = hesitationMarkers.reduce((count, marker) => {
    const regex = new RegExp(`\\b${marker}\\b`, 'gi');
    return count + (lowerText.match(regex) || []).length;
  }, 0);

  if (hesitationCount > 3) {
    flags.push('high_hesitation');
    score -= 0.15;
  }

  // Check for stock phrases indicating low engagement
  const stockPhrases = ['i guess', 'probably', 'maybe', "i don't know", 'whatever'];
  const stockPhraseMatches = stockPhrases.filter(phrase => lowerText.includes(phrase));

  if (stockPhraseMatches.length > 1) {
    flags.push('stock_phrases');
    score -= 0.20;
  }

  // Check for extreme language (could indicate rehearsed responses)
  const extremeWords = ['amazing', 'incredible', 'terrible', 'horrible', 'perfect', 'awful'];
  const extremeCount = extremeWords.reduce((count, word) => {
    return count + (lowerText.includes(word) ? 1 : 0);
  }, 0);

  if (extremeCount > 2) {
    flags.push('extreme_language');
    score -= 0.10;
  }

  // Check for very short responses (low engagement)
  const wordCount = transcript.split(/\s+/).length;
  if (wordCount < 10) {
    flags.push('brief_response');
    score -= 0.15;
  }

  return {
    score: Math.max(score, 0.1),
    flags
  };
}

/**
 * Calculate RMS (Root Mean Square) volume from audio data
 * Returns value between 0-100
 */
export function calculateRMSVolume(dataArray: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = (dataArray[i] - 128) / 128; // Convert to -1 to 1 range
    sum += normalized * normalized;
  }
  const rms = Math.sqrt(sum / dataArray.length);
  return Math.min(rms * 100, 100); // Scale to 0-100
}

/**
 * Estimate speech rate from audio duration and transcript
 */
export function estimateSpeechRate(transcript: string, durationMs: number): number {
  const words = transcript.split(/\s+/).filter(w => w.length > 0).length;
  const durationMinutes = durationMs / 60000;
  return Math.round(words / durationMinutes);
}

/**
 * Get color for emotion (for UI visualization)
 */
export function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    enthusiasm: '#10b981', // Green
    uncertainty: '#f59e0b', // Amber
    frustration: '#ef4444', // Red
    neutral: '#6b7280', // Gray
  };
  return colors[emotion] || colors.neutral;
}

/**
 * Get descriptive text for emotion
 */
export function getEmotionDescription(emotion: string): string {
  const descriptions: Record<string, string> = {
    enthusiasm: 'High energy and positive engagement',
    uncertainty: 'Hesitant or unsure responses',
    frustration: 'Irritation or impatience detected',
    neutral: 'Balanced emotional state',
  };
  return descriptions[emotion] || descriptions.neutral;
}
