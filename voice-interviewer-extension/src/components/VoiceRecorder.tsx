'use client';

import { useEffect, useRef } from 'react';
import { useRecorder } from '@/hooks/useRecorder';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Mic, Square, Pause, Play, RotateCcw, MessageSquare, X } from 'lucide-react';
import type { VoiceMetrics } from '@/lib/emotionAnalysis';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, voiceMetrics: VoiceMetrics, liveTranscript?: string) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const {
    isRecording,
    isPaused,
    audioURL,
    audioBlob,
    error,
    duration,
    voiceMetrics,
    currentVolume,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useRecorder();

  const {
    transcript: liveTranscript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechSupported,
    error: speechError,
  } = useSpeechRecognition();

  const hasNotifiedRef = useRef(false);

  const handleStart = () => {
    startRecording();
    if (isSpeechSupported) {
      startListening();
    }
  };

  const handleStop = () => {
    stopRecording();
    stopListening();
    hasNotifiedRef.current = false;
  };

  const handleReset = () => {
    hasNotifiedRef.current = false;
    resetRecording();
    resetTranscript();
  };

  useEffect(() => {
    if (isRecording) {
      hasNotifiedRef.current = false;
      return;
    }

    if (!hasNotifiedRef.current && audioBlob && voiceMetrics && onRecordingComplete) {
      onRecordingComplete(audioBlob, voiceMetrics, liveTranscript || undefined);
      hasNotifiedRef.current = true;
    }
  }, [audioBlob, voiceMetrics, onRecordingComplete, isRecording, liveTranscript]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 border-2 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Mic className="w-5 h-5" />
        Voice Recorder
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Recording Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`text-sm font-semibold ${
            isRecording
              ? isPaused
                ? 'text-yellow-600'
                : 'text-red-600'
              : 'text-gray-500'
          }`}>
            {isRecording
              ? isPaused
                ? 'Paused'
                : 'Recording...'
              : 'Ready'}
          </span>
        </div>

        {isRecording && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Duration:</span>
              <span className="text-sm font-mono">{formatDuration(duration)}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Volume:</span>
                <span className="text-sm font-mono">{Math.round(currentVolume)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-75"
                  style={{ width: `${currentVolume}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live Transcript - Persists after recording */}
      {isSpeechSupported && liveTranscript && (
        <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200 relative">
          <button
            onClick={resetTranscript}
            className="absolute top-2 right-2 p-1 hover:bg-indigo-200 rounded-full transition-colors"
            title="Clear transcript"
          >
            <X className="w-4 h-4 text-indigo-600" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-900">
              {isListening ? 'Live Transcript' : 'Transcript'}
            </span>
            {isListening && (
              <span className="flex items-center gap-1">
                <span className="animate-pulse w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-red-600 font-medium">Listening</span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-800 min-h-[40px] pr-6">
            {liveTranscript}
          </p>
        </div>
      )}

      {/* Speech Recognition Error */}
      {speechError && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
          {speechError}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        {!isRecording ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>

            {isPaused ? (
              <button
                onClick={resumeRecording}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
          </>
        )}

        {audioURL && !isRecording && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Audio Playback */}
      {audioURL && !isRecording && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Recording Complete:</p>
          <audio src={audioURL} controls className="w-full" />
        </div>
      )}

      {/* Voice Metrics Preview */}
      {voiceMetrics && !isRecording && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-medium text-blue-900 mb-1">Voice Metrics:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-800">
            <div>Avg Volume: {voiceMetrics.avgVolume}%</div>
            <div>Peak: {voiceMetrics.peakVolume}%</div>
            <div>Speech Rate: {voiceMetrics.speechRate} wpm</div>
            <div>Avg Pause: {voiceMetrics.avgPause}ms</div>
          </div>
        </div>
      )}
    </div>
  );
}
