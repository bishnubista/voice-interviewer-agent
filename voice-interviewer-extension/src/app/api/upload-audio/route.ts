import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

/**
 * Upload audio file to temporary storage and return public URL
 * This URL can be used with Hume AI's batch API
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    if (!validTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: `Invalid audio type: ${audioFile.type}. Supported: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('⚠️  BLOB_READ_WRITE_TOKEN not configured, audio upload disabled');
      return NextResponse.json(
        {
          error: 'Audio upload not configured. Add BLOB_READ_WRITE_TOKEN to enable Hume AI analysis.',
          fallbackToHeuristic: true
        },
        { status: 503 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const extension = audioFile.name.split('.').pop() || 'webm';
    const filename = `interview-audio/${timestamp}-${randomId}.${extension}`;

    console.log(`📤 Uploading audio: ${filename} (${audioFile.size} bytes)`);

    // Upload to Vercel Blob with 1 hour expiration (temporary storage)
    const blob = await put(filename, audioFile, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log(`✅ Audio uploaded successfully: ${blob.url}`);

    return NextResponse.json({
      url: blob.url,
      size: audioFile.size,
      type: audioFile.type,
      filename: filename,
    });

  } catch (error) {
    console.error('❌ Audio upload error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Audio upload failed',
        fallbackToHeuristic: true
      },
      { status: 500 }
    );
  }
}
