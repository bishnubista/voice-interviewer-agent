'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import EmotionVisualizer from '@/components/EmotionVisualizer';
import AIInterviewer from '@/components/AIInterviewer';
import { useInterview } from '@/hooks/useInterview';
import type { VoiceMetrics } from '@/lib/emotionAnalysis';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

interface DiscussionGuide {
  title: string;
  sections: Array<{
    title: string;
    questions: string[];
  }>;
}

export default function InterviewPage() {
  const [transcript, setTranscript] = useState<string>('');
  const [template] = useState<string>('product_feedback');
  const [brief, setBrief] = useState<string>('');
  const [discussionGuide, setDiscussionGuide] = useState<DiscussionGuide | null>(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState<boolean>(false);

  const {
    conversation,
    currentQuestion,
    isProcessing,
    error,
    startInterview,
    submitResponse,
    resetInterview,
  } = useInterview(template, discussionGuide);

  const generateDiscussionGuide = async () => {
    if (!brief.trim()) return;
    
    setIsGeneratingGuide(true);
    try {
      const response = await fetch('/api/generate-discussion-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate discussion guide');
      }

      setDiscussionGuide(data.guide);
    } catch (error) {
      console.error('Error generating discussion guide:', error);
      // The API will return a fallback guide even on error
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, voiceMetrics: VoiceMetrics) => {
    console.log('Recording complete:', { audioBlob, voiceMetrics });

    // Submit response with transcription and emotion analysis
    await submitResponse(audioBlob, voiceMetrics, transcript);

    // Clear transcript input for next response
    setTranscript('');
  };

  // Get latest emotion from last user message (not AI message)
  const currentEmotion = conversation
    .filter(msg => msg.role === 'user')
    .reverse()[0]?.emotion || null;

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

        {/* Brief Input Section */}
        {conversation.length === 0 && (
          <div className="mb-6 p-6 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Research Brief</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your market research brief below. This will be used to generate a discussion guide for the interview.
            </p>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={6}
              placeholder="Example: We're launching a new mobile app for fitness tracking. We want to understand how users currently track their workouts, what features they find most valuable, and what pain points they experience with existing solutions. Target audience: fitness enthusiasts aged 25-45 who use mobile apps regularly."
              disabled={isProcessing}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {brief.length} characters
              </div>
              <button
                onClick={generateDiscussionGuide}
                disabled={!brief.trim() || isGeneratingGuide}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingGuide ? 'Generating...' : 'Generate Discussion Guide'}
              </button>
            </div>
          </div>
        )}

        {/* Discussion Guide Display */}
        {discussionGuide && conversation.length === 0 && (
          <div className="mb-6 p-6 border-2 border-green-200 rounded-lg bg-green-50">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              📋 Generated Discussion Guide: {discussionGuide.title}
            </h3>
            <div className="space-y-4">
              {discussionGuide.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">{section.title}</h4>
                  <ul className="space-y-1">
                    {section.questions.map((question, questionIndex) => (
                      <li key={questionIndex} className="text-sm text-green-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-xs text-green-700">
                This guide will be used by the AI interviewer to ask relevant questions based on your brief.
              </p>
            </div>
          </div>
        )}

        {/* Start Interview Button */}
        {conversation.length === 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={startInterview}
              disabled={isProcessing || !brief.trim() || !discussionGuide}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {isProcessing ? 'Starting...' : 'Start Interview'}
            </button>
            {!brief.trim() && (
              <p className="mt-2 text-sm text-gray-500">
                Please enter a market research brief to start the interview
              </p>
            )}
            {brief.trim() && !discussionGuide && (
              <p className="mt-2 text-sm text-gray-500">
                Please generate a discussion guide to start the interview
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Conversation Interface */}
          <div className="space-y-6">
            <AIInterviewer
              conversation={conversation}
              currentQuestion={currentQuestion}
              isProcessing={isProcessing}
              discussionGuide={discussionGuide}
            />
            {conversation.length > 0 && (
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
            )}

            {/* Transcript Input */}
            {conversation.length > 0 && (
              <div className="p-6 border-2 rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Text</h3>
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
                  <span>Enter your market research brief above</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Click &ldquo;Start Interview&rdquo; to begin</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>AI asks questions based on your brief and emotional state</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Record your voice response (watch volume meter)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">5.</span>
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
