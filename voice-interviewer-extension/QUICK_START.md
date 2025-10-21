# Quick Start - Hume AI Integration

## ✅ What's Already Done

- ✅ Hume AI SDK installed (`hume` package)
- ✅ Vercel Blob configured for audio storage
- ✅ API endpoints ready (`/api/analyze-emotion`, `/api/upload-audio`)
- ✅ Fallback system in place (heuristic if Hume unavailable)

## 🔑 What You Need to Add

### Your Hume AI Keys

After signing up at https://platform.hume.ai/, add these to `.env.local`:

```bash
HUME_API_KEY=your-actual-api-key-here
HUME_SECRET_KEY=your-actual-secret-key-here
```

**Replace the entire line** - remove the `<placeholder-text>` completely.

## 🧪 Quick Test Commands

### 1. Test Your Keys Format
```bash
node test-hume.js
```

Should show:
```
✅ HUME_API_KEY found!
✅ HUME_SECRET_KEY found!
🎉 Hume AI credentials configured!
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test in Browser
1. Go to: http://localhost:3001/interview
2. Click "Start Recording"
3. Speak for a few seconds
4. Click "Stop Recording"
5. Check browser console for:
   ```
   🎭 Using Hume AI for emotion analysis
   📤 Uploading audio...
   ✅ Audio uploaded successfully
   🎤 Submitting to Hume AI...
   ✅ Hume AI analysis complete!
   ```

## 🎯 What to Expect

### With Hume AI Enabled (Keys Configured)
- Real-time audio upload to Vercel Blob
- Professional prosody analysis (48 emotions)
- High confidence scores (85-95%)
- Response: `{ emotion: "enthusiasm", confidence: 0.87, source: "hume-ai" }`

### Without Hume AI (Fallback Mode)
- Heuristic analysis based on volume/pace
- Lower confidence scores (60-70%)
- Response: `{ emotion: "neutral", confidence: 0.65, source: "heuristic" }`

## 🔧 Troubleshooting

### "Hume AI credentials not configured"
**Solution**: Make sure both `HUME_API_KEY` and `HUME_SECRET_KEY` are in `.env.local` with real values (no placeholder text)

### "Audio upload not configured"
**Solution**: Already fixed! Your `BLOB_READ_WRITE_TOKEN` is configured ✅

### "Hume AI analysis timeout"
**Possible causes:**
- Large audio file (>2MB)
- Network issues
- Hume API temporarily down

**Solution**: Check file size, internet connection, or wait and retry

### Emotion Always Returns "neutral"
**Check:**
1. Console shows `source: "hume-ai"` not `source: "heuristic"`
2. No error messages in server logs
3. Audio quality is good (not silent or too noisy)

## 📊 Understanding Results

The emotion dashboard will show:
- **Emotion**: enthusiasm/uncertainty/frustration/neutral
- **Confidence**: How sure the AI is (0-100%)
- **Engagement**: Overall engagement level (0-100)
- **Source**: Which system was used (hume-ai vs heuristic)

Higher confidence = more accurate detection!

## 🚀 Production Deployment (Later)

When deploying to Vercel:
1. Add all environment variables in Vercel dashboard
2. Link your Blob store to the project
3. Deploy!

---

**Current Status**: ✅ Ready for Hume AI keys! Add them and run `node test-hume.js`
