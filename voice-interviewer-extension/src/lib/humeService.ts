// Hume AI Service - Professional emotion detection using Speech Prosody model
import { HumeClient } from "hume";
import type { EmotionResult } from './emotionAnalysis';

// Initialize Hume client with API credentials
function getHumeClient() {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Hume AI credentials not configured. Please add HUME_API_KEY and HUME_SECRET_KEY to your .env file.');
  }

  return new HumeClient({
    apiKey,
    secretKey,
  });
}

// Hume's 48 prosody emotions mapped to our simplified categories
// Based on emotional valence and arousal dimensions
const EMOTION_MAPPING = {
  // High energy, positive valence → enthusiasm
  enthusiasm: ['excitement', 'joy', 'amusement', 'pride', 'triumph', 'surprise (positive)', 'interest'],

  // Low energy, negative valence → uncertainty
  uncertainty: ['confusion', 'contemplation', 'doubt', 'concentration', 'realization', 'tiredness', 'awkwardness'],

  // High energy, negative valence → frustration
  frustration: ['anger', 'annoyance', 'distress', 'pain', 'disgust', 'contempt', 'boredom'],

  // All others → neutral
  neutral: ['calmness', 'contentment', 'relief', 'satisfaction', 'nostalgia', 'sympathy', 'admiration']
};

/**
 * Maps Hume's 48 prosody emotions to our simplified 4-category system
 * Returns the dominant emotion based on highest average score
 */
function mapHumeEmotions(prosodyPredictions: Array<{ emotions: Array<{ name: string; score: number }> }>): EmotionResult {
  if (!prosodyPredictions || prosodyPredictions.length === 0) {
    return {
      emotion: 'neutral',
      confidence: 0.5,
      engagement: 50,
      authenticity: { score: 0.7, flags: [] },
      metrics: { volume: 0, pace: 0, conviction: 0 }
    };
  }

  // Get the first prediction (could average across all if multiple)
  const firstPrediction = prosodyPredictions[0];
  const emotions = firstPrediction.emotions;

  // Calculate average scores for each of our categories
  const categoryScores = {
    enthusiasm: 0,
    uncertainty: 0,
    frustration: 0,
    neutral: 0
  };

  const categoryCounts = {
    enthusiasm: 0,
    uncertainty: 0,
    frustration: 0,
    neutral: 0
  };

  // Sum up scores for emotions in each category
  for (const emotionData of emotions) {
    const emotionName = emotionData.name.toLowerCase();
    const score = emotionData.score;

    // Find which category this emotion belongs to
    for (const [category, emotionList] of Object.entries(EMOTION_MAPPING)) {
      if (emotionList.some(e => emotionName.includes(e) || e.includes(emotionName))) {
        categoryScores[category as keyof typeof categoryScores] += score;
        categoryCounts[category as keyof typeof categoryCounts] += 1;
        break;
      }
    }
  }

  // Calculate averages
  const categoryAverages = {
    enthusiasm: categoryCounts.enthusiasm > 0 ? categoryScores.enthusiasm / categoryCounts.enthusiasm : 0,
    uncertainty: categoryCounts.uncertainty > 0 ? categoryScores.uncertainty / categoryCounts.uncertainty : 0,
    frustration: categoryCounts.frustration > 0 ? categoryScores.frustration / categoryCounts.frustration : 0,
    neutral: categoryCounts.neutral > 0 ? categoryScores.neutral / categoryCounts.neutral : 0
  };

  console.log('🎭 Hume Emotion Category Scores:', categoryAverages);

  // Find dominant emotion
  let dominantEmotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral' = 'neutral';
  let maxScore = categoryAverages.neutral;

  for (const [emotion, score] of Object.entries(categoryAverages)) {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion as 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
    }
  }

  // Calculate engagement (0-100) based on emotional intensity
  const totalIntensity = Object.values(categoryAverages).reduce((sum, score) => sum + score, 0);
  const engagement = Math.min(Math.round(totalIntensity * 100), 100);

  // Confidence is the normalized score of the dominant emotion
  const confidence = Math.min(maxScore + 0.3, 0.95); // Boost confidence, cap at 95%

  return {
    emotion: dominantEmotion,
    confidence,
    engagement,
    authenticity: {
      score: 0.85, // Hume AI provides high-quality analysis
      flags: []
    },
    metrics: {
      volume: 0, // Could extract from Hume's intensity metrics
      pace: 0,
      conviction: confidence
    }
  };
}

/**
 * Analyze audio using Hume AI's Speech Prosody model
 *
 * @param audioUrl - Public URL to audio file (must be accessible by Hume)
 * @returns EmotionResult with detected emotion
 */
export async function analyzeAudioWithHume(
  audioUrl: string
): Promise<EmotionResult> {
  try {
    const hume = getHumeClient();

    console.log('🎤 Submitting audio to Hume AI for prosody analysis...');

    // Submit batch job with prosody model
    const job = await hume.expressionMeasurement.batch.startInferenceJob({
      models: {
        prosody: {
          granularity: 'utterance', // Analyze by utterance (natural speech segments)
        },
      },
      urls: [audioUrl],
    });

    console.log(`✅ Hume job started: ${job.jobId}`);
    console.log('⏳ Waiting for analysis to complete...');

    // Poll for job completion (with timeout)
    const maxWaitTime = 60000; // 60 seconds
    const pollInterval = 2000; // 2 seconds
    let elapsed = 0;
    let jobStatus = await hume.expressionMeasurement.batch.getJobDetails(job.jobId);

    while (jobStatus.state.status === 'IN_PROGRESS' || jobStatus.state.status === 'QUEUED') {
      if (elapsed >= maxWaitTime) {
        throw new Error('Hume AI analysis timeout - job took too long');
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
      elapsed += pollInterval;
      jobStatus = await hume.expressionMeasurement.batch.getJobDetails(job.jobId);
      console.log(`⏱️  Job status: ${jobStatus.state.status} (${elapsed}ms elapsed)`);
    }

    if (jobStatus.state.status === 'FAILED') {
      throw new Error('Hume AI analysis failed');
    }

    // Get predictions
    const predictions = await hume.expressionMeasurement.batch.getJobPredictions(job.jobId);

    console.log('✅ Hume AI analysis complete!');

    // Extract prosody predictions
    const prosodyPredictions = predictions[0]?.results?.predictions?.[0]?.models?.prosody?.groupedPredictions?.[0]?.predictions;

    if (!prosodyPredictions) {
      console.warn('⚠️  No prosody predictions found, falling back to neutral');
      return {
        emotion: 'neutral',
        confidence: 0.5,
        engagement: 50,
        authenticity: { score: 0.7, flags: [] },
        metrics: { volume: 0, pace: 0, conviction: 0.5 }
      };
    }

    // Map Hume's detailed emotions to our simplified system
    return mapHumeEmotions(prosodyPredictions);

  } catch (error) {
    console.error('❌ Hume AI analysis error:', error);
    throw error;
  }
}

/**
 * Analyze audio from a buffer/blob (for local files)
 * Note: This requires uploading the file to a temporary URL first
 * For MVP, we'll use URL-based analysis
 */
export async function analyzeAudioBuffer(
  _audioBuffer: Buffer,
  _mimeType: string = 'audio/webm'
): Promise<EmotionResult> {
  // TODO: Implement file upload to temporary storage (S3, Cloudinary, etc.)
  // For now, this is a placeholder
  throw new Error('Buffer analysis not yet implemented. Please use URL-based analysis.');
}
