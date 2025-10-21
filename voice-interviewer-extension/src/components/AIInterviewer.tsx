'use client';

import { MessageCircle, Sparkles } from 'lucide-react';
import type { ConversationMessage } from '@/hooks/useInterview';

interface AIInterviewerProps {
  conversation: ConversationMessage[];
  currentQuestion: string;
  isProcessing: boolean;
}

export default function AIInterviewer({ conversation, currentQuestion, isProcessing }: AIInterviewerProps) {
  return (
    <div className="p-6 border-2 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Conversation</h3>
        {isProcessing && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-medium text-indigo-700">AI is listening...</span>
          </div>
        )}
      </div>

      {/* Conversation History */}
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {conversation.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Your AI Interview!</h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                I&apos;m your emotion-adaptive AI interviewer. I&apos;ll ask you questions and adapt based on how you&apos;re feeling.
                Ready to begin?
              </p>
            </div>
            <p className="text-xs text-gray-500">Click &ldquo;Start Interview&rdquo; above to get started</p>
          </div>
        ) : (
          conversation.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'ai'
                    ? 'bg-indigo-50 text-indigo-900'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'ai' && (
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    {message.emotion && (
                      <div className="mt-2 pt-2 border-t border-blue-400/30">
                        <div className="flex gap-2 text-xs flex-wrap">
                          <span className="px-2 py-0.5 bg-blue-600/20 rounded">
                            {message.emotion.emotion}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-600/20 rounded">
                            {message.emotion.engagement}% engagement
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Current Question Highlight */}
      {currentQuestion && (
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-indigo-600 mb-1">Current Question:</p>
              <p className="text-sm text-indigo-900 font-medium">{currentQuestion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
