'use client';

import { useState, useRef, useCallback } from 'react';
import { calculateRMSVolume, type VoiceMetrics } from '@/lib/emotionAnalysis';

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  audioURL: string | null;
  audioBlob: Blob | null;
  error: string | null;
  duration: number; // in seconds
  voiceMetrics: VoiceMetrics | null;
}

export interface UseRecorderReturn extends RecorderState {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
  currentVolume: number; // Real-time volume 0-100
}

export function useRecorder(): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Metrics tracking
  const volumeSamplesRef = useRef<number[]>([]);
  const pauseTimesRef = useRef<number[]>([]);
  const lastSoundTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Set up Web Audio API for real-time analysis
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];
      volumeSamplesRef.current = [];
      pauseTimesRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(audioURL);

        // Calculate final metrics
        const metrics = calculateFinalMetrics();
        setVoiceMetrics(metrics);

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms

      startTimeRef.current = Date.now();
      setIsRecording(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setDuration(elapsed);
      }, 100);

      // Start volume monitoring
      volumeIntervalRef.current = setInterval(() => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteTimeDomainData(dataArray);

          const volume = calculateRMSVolume(dataArray);
          setCurrentVolume(volume);
          volumeSamplesRef.current.push(volume);

          // Track pauses (silence > 300ms)
          const now = Date.now();
          if (volume < 10) { // Silence threshold
            if (lastSoundTimeRef.current > 0) {
              const pauseDuration = now - lastSoundTimeRef.current;
              if (pauseDuration > 300) {
                pauseTimesRef.current.push(pauseDuration);
              }
            }
          } else {
            lastSoundTimeRef.current = now;
          }
        }
      }, 50);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, [isRecording, isPaused]);

  const resetRecording = useCallback(() => {
    setAudioURL(null);
    setAudioBlob(null);
    setDuration(0);
    setCurrentVolume(0);
    setVoiceMetrics(null);
    setError(null);
    audioChunksRef.current = [];
    volumeSamplesRef.current = [];
    pauseTimesRef.current = [];
  }, []);

  const calculateFinalMetrics = useCallback((): VoiceMetrics => {
    const volumes = volumeSamplesRef.current;
    const pauses = pauseTimesRef.current;

    const avgVolume = volumes.length > 0
      ? volumes.reduce((a, b) => a + b, 0) / volumes.length
      : 0;

    const peakVolume = volumes.length > 0 ? Math.max(...volumes) : 0;

    // Calculate variance
    const variance = volumes.length > 0
      ? volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumes.length
      : 0;
    const volumeVariance = Math.sqrt(variance) / 100; // Normalize to 0-1

    const avgPause = pauses.length > 0
      ? pauses.reduce((a, b) => a + b, 0) / pauses.length
      : 0;

    // Estimate speech rate (rough approximation based on pauses and duration)
    // More pauses = slower speech
    const pauseRatio = pauses.length / (duration / 60); // Pauses per minute
    const speechRate = Math.max(80, 160 - pauseRatio * 10); // Rough estimate

    const responseLatency = 0; // Would need to track from question end time

    return {
      avgVolume: Math.round(avgVolume),
      volumeVariance: Math.round(volumeVariance * 100) / 100,
      speechRate: Math.round(speechRate),
      avgPause: Math.round(avgPause),
      responseLatency,
      peakVolume: Math.round(peakVolume)
    };
  }, [duration]);

  return {
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
  };
}
