import { NextResponse } from 'next/server';

// Placeholder: Transcription API endpoint
// Phase 3: Will use OpenAI Whisper API
export async function POST(_request: Request) {
  return NextResponse.json({
    message: 'Transcription endpoint - Phase 3 implementation',
    transcript: 'Sample transcript text'
  });
}
