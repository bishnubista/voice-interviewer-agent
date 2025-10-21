'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import EmotionVisualizer from '@/components/EmotionVisualizer';
import AIInterviewer from '@/components/AIInterviewer';
import { classifyEmotion, type EmotionResult, type VoiceMetrics } from '@/lib/emotionAnalysis';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InterviewPage() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  const handleRecordingComplete = (audioBlob: Blob, voiceMetrics: VoiceMetrics) => {
    console.log('Recording complete:', { audioBlob, voiceMetrics });

    // For MVP, analyze emotion from voice metrics
    // In Phase 3, we'll send audioBlob to transcription API
    const emotionResult = classifyEmotion(voiceMetrics, transcript);
    setCurrentEmotion(emotionResult);

    console.log('Emotion analysis:', emotionResult);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="http://localhost:3000/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Voice Interview</h1>
            </div>
            <div className="text-sm text-gray-500">
              Emotion-Adaptive AI Interviewer
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Conversation Interface */}
          <div className="space-y-6">
            <AIInterviewer />
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />

            {/* Transcript Input (MVP - manual entry until Phase 3) */}
            <div className="p-6 border-2 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Response Text (Optional)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enter your response text to enhance emotion analysis with sentiment detection.
              </p>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Type your response here (optional)..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 In Phase 3, this will be automatically transcribed using OpenAI Whisper
              </p>
            </div>
          </div>

          {/* Right Column: Emotion Dashboard */}
          <div className="space-y-6">
            <EmotionVisualizer emotion={currentEmotion} isLive={false} />

            {/* Instructions */}
            <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Click &ldquo;Start Recording&rdquo; and speak your response</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Watch real-time volume meters as you speak</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Click &ldquo;Stop&rdquo; when finished</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>See emotion analysis appear in the dashboard →</span>
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>MVP Mode:</strong> Currently using browser-based voice pattern analysis.
                  Phase 3 will add AI transcription and adaptive question generation.
                </p>
              </div>
            </div>

            {/* Debug Info */}
            {currentEmotion && (
              <div className="p-4 border rounded-lg bg-gray-100 text-xs font-mono">
                <div className="font-bold mb-2 text-gray-700">Debug Info:</div>
                <pre className="whitespace-pre-wrap text-gray-600">
                  {JSON.stringify(currentEmotion, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
