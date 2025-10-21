import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 25MB for Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Audio file too large (max 25MB)' },
        { status: 400 }
      );
    }

    // If OpenAI key not configured, return helpful error
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          transcript: '[Manual transcription required - add OPENAI_API_KEY to enable]',
          confidence: 0,
          duration: 0
        },
        { status: 200 } // Return 200 so UI doesn't break
      );
    }

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language,
      response_format: 'verbose_json',
    });

    return NextResponse.json({
      transcript: transcription.text,
      confidence: 1.0, // Whisper doesn't provide confidence, assume high
      duration: transcription.duration || 0,
      language: transcription.language,
    });

  } catch (error) {
    console.error('Transcription error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Transcription failed',
        transcript: '[Transcription unavailable]',
        confidence: 0,
        duration: 0
      },
      { status: 500 }
    );
  }
}
