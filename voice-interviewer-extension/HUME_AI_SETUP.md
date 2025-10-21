# Hume AI Emotion Detection Setup Guide

This guide explains how to set up professional emotion detection using Hume AI's Speech Prosody model.

## Why Hume AI?

**Before (Heuristic Analysis):**
- ❌ Simple volume + pace calculations
- ❌ Frequently returns "neutral" for real emotions
- ❌ Can't detect subtle emotional cues
- ❌ Limited to 4 basic emotions

**After (Hume AI Prosody Model):**
- ✅ Analyzes 48 distinct emotional dimensions
- ✅ Trained on millions of real voice samples
- ✅ Detects prosody, tone, rhythm, and timbre
- ✅ Research-backed emotional AI (published in Nature)
- ✅ 85-95% confidence scores

## Setup Steps

### 1. Get Hume AI API Keys

1. Go to [Hume AI Portal](https://platform.hume.ai/)
2. Sign up for a free account
3. Navigate to **API Keys** in your dashboard
4. Copy your **API Key** and **Secret Key**

### 2. Get Vercel Blob Storage Token (Required)

Hume AI's batch API requires publicly accessible audio URLs. We use Vercel Blob for temporary storage.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database** → **Blob**
3. Create a new Blob store (or use existing)
4. Go to the Blob store settings
5. Copy the **BLOB_READ_WRITE_TOKEN**

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Hume AI - Emotion Detection API
HUME_API_KEY=your-hume-api-key-here
HUME_SECRET_KEY=your-hume-secret-key-here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
```

### 4. Test the Integration

Start your development server:

```bash
npm run dev
```

Navigate to the interview page and record a test response. Check the console for:

```
🎭 Using Hume AI for emotion analysis
📤 Uploading audio: interview-audio/1234567890-abc123.webm
✅ Audio uploaded successfully
🎤 Submitting audio to Hume AI for prosody analysis...
✅ Hume job started: job_abc123
⏳ Waiting for analysis to complete...
✅ Hume AI analysis complete!
🎭 Hume Emotion Category Scores: { enthusiasm: 0.65, uncertainty: 0.23, ... }
```

## How It Works

### Architecture Flow

```
1. User records audio → Browser captures audio blob
2. Upload to Vercel Blob → Get public URL
3. Send URL to Hume AI → Batch prosody analysis
4. Poll for completion → ~2-5 seconds
5. Get 48 emotion scores → Map to UI categories
6. Display results → Update emotion dashboard
```

### Emotion Mapping

Hume returns 48 prosody emotions. We map them to our 4 UI categories:

| UI Emotion | Hume Emotions (subset) |
|------------|------------------------|
| **Enthusiasm** | excitement, joy, amusement, pride, triumph, interest |
| **Uncertainty** | confusion, contemplation, doubt, concentration, awkwardness |
| **Frustration** | anger, annoyance, distress, disgust, boredom |
| **Neutral** | calmness, contentment, relief, satisfaction |

### Fallback Behavior

The system gracefully falls back to heuristic analysis if:

- ❌ Hume AI credentials not configured
- ❌ Vercel Blob token missing
- ❌ Hume API returns error
- ❌ Network issues

You'll see in the console:
```
⚠️  Hume AI analysis failed, falling back to heuristic
📊 Using heuristic analysis for emotion detection
```

## API Response Format

The `/api/analyze-emotion` endpoint now returns:

```json
{
  "emotion": "enthusiasm",
  "confidence": 0.87,
  "engagement": 78,
  "authenticity": {
    "score": 0.85,
    "flags": []
  },
  "metrics": {
    "volume": 0,
    "pace": 0,
    "conviction": 0.87
  },
  "source": "hume-ai"  // or "heuristic" or "error-fallback"
}
```

The `source` field tells you which analysis method was used.

## Cost Considerations

### Hume AI Pricing (as of 2025)

- **Free Tier**: 1,000 API calls/month
- **Pay-as-you-go**: ~$0.001-0.005 per audio file
- **Processing time**: 2-5 seconds per file

### Vercel Blob Pricing

- **Free Tier**: 500 GB-hours/month
- **File expiration**: Configure auto-deletion after analysis
- **Cost**: Minimal for temporary interview audio

### Recommendations

- ✅ **Development**: Use free tiers, perfect for testing
- ✅ **Production**: Batch process, cache results
- ✅ **Optimization**: Delete uploaded audio after Hume analysis completes

## Troubleshooting

### "Hume AI credentials not configured"

**Solution**: Add `HUME_API_KEY` and `HUME_SECRET_KEY` to `.env.local`

### "Audio upload not configured"

**Solution**: Add `BLOB_READ_WRITE_TOKEN` to `.env.local`

### "Hume AI analysis timeout"

**Cause**: Large audio files (>5MB) or network issues
**Solution**:
- Check audio file size (should be <2MB for interviews)
- Verify internet connection
- Check Hume AI status: https://status.hume.ai

### Analysis always returns "neutral"

**Possible causes:**
- Using heuristic fallback (check `source` field)
- Audio quality too low
- Background noise interference

**Solutions:**
- Verify Hume AI credentials are configured
- Check browser console for error messages
- Test with clear audio in quiet environment

## Testing Checklist

- [ ] Environment variables configured
- [ ] Development server running
- [ ] Can record audio in browser
- [ ] Console shows "Using Hume AI"
- [ ] Audio uploads successfully
- [ ] Hume job completes without errors
- [ ] Emotion results look accurate
- [ ] `source: "hume-ai"` in response

## Next Steps

Once Hume AI is working:

1. **Monitor usage** - Check your Hume AI dashboard for API calls
2. **Optimize costs** - Implement audio cleanup after analysis
3. **Fine-tune mapping** - Adjust emotion category mappings if needed
4. **Add analytics** - Track which emotions appear most in interviews

## Resources

- [Hume AI Documentation](https://dev.hume.ai/)
- [Speech Prosody Model](https://www.hume.ai/products/speech-prosody-model)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Research Paper](https://www.hume.ai/research) - Nature journal publication

---

**Questions?** Check the troubleshooting section or open an issue on GitHub.
