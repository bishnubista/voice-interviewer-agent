import { NextResponse } from 'next/server';
import { classifyEmotion, type VoiceMetrics } from '@/lib/emotionAnalysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { audioMetrics, transcript } = body;

    if (!audioMetrics) {
      return NextResponse.json(
        { error: 'audioMetrics are required' },
        { status: 400 }
      );
    }

    // Validate audioMetrics structure
    const requiredFields = ['avgVolume', 'volumeVariance', 'speechRate', 'avgPause', 'peakVolume'];
    for (const field of requiredFields) {
      if (audioMetrics[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Classify emotion using our heuristic analysis
    const voiceMetrics: VoiceMetrics = {
      avgVolume: audioMetrics.avgVolume,
      volumeVariance: audioMetrics.volumeVariance,
      speechRate: audioMetrics.speechRate,
      avgPause: audioMetrics.avgPause,
      responseLatency: audioMetrics.responseLatency || 0,
      peakVolume: audioMetrics.peakVolume,
    };

    const emotionResult = classifyEmotion(voiceMetrics, transcript);

    return NextResponse.json(emotionResult);

  } catch (error) {
    console.error('Emotion analysis error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Emotion analysis failed',
        emotion: 'neutral',
        confidence: 0.5,
        engagement: 50,
        authenticity: { score: 0.7, flags: [] },
        metrics: { volume: 0, pace: 0, conviction: 0 }
      },
      { status: 500 }
    );
  }
}
