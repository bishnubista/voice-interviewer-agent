import { NextResponse } from 'next/server';
import { classifyEmotion, type VoiceMetrics } from '@/lib/emotionAnalysis';
import { analyzeAudioWithHume } from '@/lib/humeService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { audioMetrics, transcript, audioUrl } = body;

    // Check if we should use Hume AI (requires API keys and audio URL)
    const useHumeAI = process.env.HUME_API_KEY &&
                      process.env.HUME_SECRET_KEY &&
                      audioUrl;

    if (useHumeAI) {
      console.log('🎭 Using Hume AI for emotion analysis');

      try {
        const humeResult = await analyzeAudioWithHume(audioUrl);
        return NextResponse.json({
          ...humeResult,
          source: 'hume-ai' // Indicate which analysis method was used
        });
      } catch (humeError) {
        console.warn('⚠️  Hume AI analysis failed, falling back to heuristic:', humeError);
        // Fall through to heuristic analysis
      }
    }

    // Fallback to heuristic analysis
    console.log('📊 Using heuristic analysis for emotion detection');

    if (!audioMetrics) {
      return NextResponse.json(
        { error: 'audioMetrics or audioUrl are required' },
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

    return NextResponse.json({
      ...emotionResult,
      source: 'heuristic' // Indicate which analysis method was used
    });

  } catch (error) {
    console.error('❌ Emotion analysis error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Emotion analysis failed',
        emotion: 'neutral',
        confidence: 0.5,
        engagement: 50,
        authenticity: { score: 0.7, flags: [] },
        metrics: { volume: 0, pace: 0, conviction: 0 },
        source: 'error-fallback'
      },
      { status: 500 }
    );
  }
}
