'use client';

import { getEmotionColor, getEmotionDescription, type EmotionResult } from '@/lib/emotionAnalysis';
import { Activity, TrendingUp, Shield, Volume2 } from 'lucide-react';

interface EmotionVisualizerProps {
  emotion: EmotionResult | null;
  isLive?: boolean;
}

export default function EmotionVisualizer({ emotion, isLive = false }: EmotionVisualizerProps) {
  if (!emotion) {
    return (
      <div className="p-6 border-2 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Emotion Dashboard
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">
          {isLive ? '🎤 Analyzing emotion... (2-5 seconds)' : 'No emotion data yet. Record your response to see AI emotion analysis.'}
        </p>
      </div>
    );
  }

  const emotionColor = getEmotionColor(emotion.emotion);
  const description = getEmotionDescription(emotion.emotion);

  return (
    <div className="p-6 border-2 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Emotion Dashboard
        </h3>
        {isLive && (
          <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
            <span className="animate-pulse w-2 h-2 rounded-full bg-blue-600" />
            Analyzing...
          </span>
        )}
      </div>

      {/* Current Emotion */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Current Emotion:</span>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold capitalize"
            style={{
              backgroundColor: `${emotionColor}20`,
              color: emotionColor,
            }}
          >
            {emotion.emotion}
          </span>
        </div>
        <p className="text-xs text-gray-600 italic">{description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-600">Confidence:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${emotion.confidence * 100}%`,
                backgroundColor: emotionColor,
              }}
            />
          </div>
          <span className="text-xs font-mono text-gray-700">
            {Math.round(emotion.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Engagement Level */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Engagement Level:</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${emotion.engagement}%` }}
            >
              {emotion.engagement > 15 && (
                <span className="text-[10px] font-bold text-white">
                  {emotion.engagement}%
                </span>
              )}
            </div>
          </div>
          {emotion.engagement <= 15 && (
            <span className="absolute right-0 top-0 text-xs font-medium text-gray-700">
              {emotion.engagement}%
            </span>
          )}
        </div>
      </div>

      {/* Voice Metrics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Voice Metrics:</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Volume</div>
            <div className="text-lg font-bold text-purple-700">
              {Math.round(emotion.metrics.volume)}
            </div>
            <div className="text-[10px] text-gray-500">0-100</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Pace</div>
            <div className="text-lg font-bold text-green-700">
              {Math.round(emotion.metrics.pace)}
            </div>
            <div className="text-[10px] text-gray-500">wpm</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Conviction</div>
            <div className="text-lg font-bold text-orange-700">
              {Math.round(emotion.metrics.conviction * 100)}%
            </div>
            <div className="text-[10px] text-gray-500">0-100%</div>
          </div>
        </div>
      </div>

      {/* Authenticity Score */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">Authenticity:</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                emotion.authenticity.score > 0.7
                  ? 'bg-green-500'
                  : emotion.authenticity.score > 0.4
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${emotion.authenticity.score * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-gray-700">
            {Math.round(emotion.authenticity.score * 100)}%
          </span>
        </div>
        {emotion.authenticity.flags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {emotion.authenticity.flags.map((flag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded"
              >
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
