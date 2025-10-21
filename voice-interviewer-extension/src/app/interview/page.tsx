'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import EmotionVisualizer from '@/components/EmotionVisualizer';
import AIInterviewer from '@/components/AIInterviewer';
import { useInterview } from '@/hooks/useInterview';
import type { VoiceMetrics } from '@/lib/emotionAnalysis';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export default function InterviewPage() {
  const [transcript, setTranscript] = useState<string>('');
  const [template] = useState<string>('product_feedback');

  const {
    conversation,
    currentQuestion,
    isProcessing,
    error,
    startInterview,
    submitResponse,
    resetInterview,
  } = useInterview(template);

  const handleRecordingComplete = async (audioBlob: Blob, voiceMetrics: VoiceMetrics) => {
    console.log('Recording complete:', { audioBlob, voiceMetrics });

    // Submit response with transcription and emotion analysis
    await submitResponse(audioBlob, voiceMetrics, transcript);

    // Clear transcript input for next response
    setTranscript('');
  };

  // Get latest emotion from conversation
  const currentEmotion = conversation.length > 0
    ? conversation[conversation.length - 1].emotion || null
    : null;

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
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Start Interview Button */}
        {conversation.length === 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={startInterview}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {isProcessing ? 'Starting...' : 'Start Interview'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Conversation Interface */}
          <div className="space-y-6">
            <AIInterviewer
              conversation={conversation}
              currentQuestion={currentQuestion}
              isProcessing={isProcessing}
            />
            {conversation.length > 0 && (
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
            )}

            {/* Transcript Input */}
            {conversation.length > 0 && (
              <div className="p-6 border-2 rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Response Text</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {process.env.NEXT_PUBLIC_OPENAI_ENABLED === 'true'
                    ? 'Text will be auto-transcribed. You can also type here to override.'
                    : 'Enter your response text (auto-transcription requires OpenAI API key).'}
                </p>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Type your response here or let AI transcribe your voice..."
                  disabled={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Right Column: Emotion Dashboard */}
          <div className="space-y-6">
            <EmotionVisualizer emotion={currentEmotion} isLive={isProcessing} />

            {/* Instructions */}
            <div className="p-6 border-2 border-indigo-200 rounded-lg bg-indigo-50">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                🎯 Emotion-Adaptive Interview
              </h3>
              <ol className="space-y-2 text-sm text-indigo-800">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Click &ldquo;Start Interview&rdquo; to begin</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>AI asks a question based on your emotional state</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Record your voice response (watch volume meter)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>See emotion analysis + AI adapts next question</span>
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <p className="text-xs text-indigo-700">
                  <strong>✨ Phase 3:</strong> Real-time emotion detection + adaptive AI questioning.
                  {!process.env.NEXT_PUBLIC_OPENAI_ENABLED && (
                    <span className="block mt-1">
                      Add OPENAI_API_KEY for auto-transcription & smarter questions!
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Reset Interview */}
            {conversation.length > 0 && (
              <button
                onClick={resetInterview}
                className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reset Interview
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
