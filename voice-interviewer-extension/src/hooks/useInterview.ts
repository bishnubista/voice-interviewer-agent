'use client';

import { useState, useCallback } from 'react';
import type { EmotionResult, VoiceMetrics } from '@/lib/emotionAnalysis';

export interface ConversationMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
  emotion?: EmotionResult;
  voiceMetrics?: VoiceMetrics;
}

export interface UseInterviewReturn {
  conversation: ConversationMessage[];
  currentQuestion: string;
  isProcessing: boolean;
  error: string | null;
  startInterview: () => Promise<void>;
  submitResponse: (audioBlob: Blob, voiceMetrics: VoiceMetrics, transcript?: string) => Promise<void>;
  resetInterview: () => void;
}

export function useInterview(template: string = 'product_feedback'): UseInterviewReturn {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterview = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Generate initial question
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: [],
          currentEmotion: null,
          interviewTemplate: template,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate initial question');
      }

      const questionMsg: ConversationMessage = {
        id: Date.now().toString(),
        role: 'ai',
        content: data.question,
        timestamp: new Date().toISOString(),
      };

      setConversation([questionMsg]);
      setCurrentQuestion(data.question);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
      console.error('Start interview error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [template]);

  const submitResponse = useCallback(async (
    audioBlob: Blob,
    voiceMetrics: VoiceMetrics,
    manualTranscript?: string
  ) => {
    console.log('🎙️ submitResponse called with:', {
      audioBlobSize: audioBlob?.size,
      voiceMetrics,
      manualTranscript
    });

    setIsProcessing(true);
    setError(null);

    try {
      let transcript = manualTranscript || '';

      // Step 1: Transcribe if no manual transcript and OpenAI is available
      if (!manualTranscript) {
        console.log('📝 Attempting transcription...');
        const formData = new FormData();
        formData.append('audio', audioBlob);

        const transcribeResponse = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const transcribeData = await transcribeResponse.json();
        console.log('📝 Transcription response:', transcribeData);

        if (transcribeResponse.ok && transcribeData.transcript) {
          transcript = transcribeData.transcript;
        } else {
          // Fall back to manual entry message
          transcript = manualTranscript || '[Transcription unavailable - please enter text manually]';
        }
      }

      console.log('💬 Using transcript:', transcript);

      // Step 2: Upload audio to get public URL (for Hume AI)
      let audioUrl: string | undefined;
      try {
        console.log('📤 Uploading audio to Vercel Blob...');
        const uploadFormData = new FormData();
        uploadFormData.append('audio', audioBlob);

        const uploadResponse = await fetch('/api/upload-audio', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          audioUrl = uploadData.url;
          console.log('✅ Audio uploaded successfully:', audioUrl);
        } else {
          console.warn('⚠️  Audio upload failed, will use heuristic analysis');
        }
      } catch (uploadError) {
        console.warn('⚠️  Audio upload error, will use heuristic analysis:', uploadError);
      }

      // Step 3: Analyze emotion (with audioUrl if available)
      console.log('😊 Analyzing emotion with metrics:', voiceMetrics);
      const emotionResponse = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioMetrics: voiceMetrics,
          transcript,
          audioUrl, // Pass URL for Hume AI analysis
        }),
      });

      if (!emotionResponse.ok) {
        const errorData = await emotionResponse.json();
        console.error('❌ Emotion analysis failed:', errorData);
        throw new Error(errorData.error || 'Emotion analysis failed');
      }

      const emotionData: EmotionResult = await emotionResponse.json();
      console.log('😊 Emotion analysis result:', emotionData);

      // Step 4: Add user response to conversation
      const userMsg: ConversationMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: transcript,
        timestamp: new Date().toISOString(),
        emotion: emotionData,
        voiceMetrics,
      };

      setConversation(prev => [...prev, userMsg]);

      // Step 5: Generate next question based on emotion
      console.log('🤖 Generating next question based on emotion:', emotionData.emotion);
      const nextQuestionResponse = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: [
            ...conversation,
            { role: userMsg.role, content: userMsg.content, emotion: emotionData.emotion }
          ],
          currentEmotion: emotionData,
          interviewTemplate: template,
        }),
      });

      const nextQuestionData = await nextQuestionResponse.json();
      console.log('🤖 Next question generated:', nextQuestionData);

      const aiMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: nextQuestionData.question,
        timestamp: new Date().toISOString(),
      };

      setConversation(prev => [...prev, aiMsg]);
      setCurrentQuestion(nextQuestionData.question);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process response');
      console.error('Submit response error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [conversation, template]);

  const resetInterview = useCallback(() => {
    setConversation([]);
    setCurrentQuestion('');
    setError(null);
  }, []);

  return {
    conversation,
    currentQuestion,
    isProcessing,
    error,
    startInterview,
    submitResponse,
    resetInterview,
  };
}
