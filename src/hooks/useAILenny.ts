import { useRef, useState, useCallback, useEffect, RefObject } from 'react';
import type { ConversationEntry } from '../types';

const SILENCE_THRESHOLD = 12;
const SILENCE_DURATION = 1800;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export type WaveformState = 'idle' | 'speaking' | 'playing';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export function useAILenny(canvasRef: RefObject<HTMLCanvasElement>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isRunningRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const waveformStateRef = useRef<WaveformState>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const conversationHistoryRef = useRef<ChatMessage[]>([]);
  const transcriptBufferRef = useRef<string>('');
  const isProcessingRef = useRef(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [conversationLog, setConversationLog] = useState<ConversationEntry[]>([]);
  const [statusText, setStatusText] = useState('Click "Start Conversation" to begin');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const getTimestamp = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const addLog = useCallback((speaker: 'scammer' | 'lenny', text: string): void => {
    setConversationLog(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, timestamp: getTimestamp(), speaker, text },
    ]);
  }, []);

  const drawWaveform = useCallback((state: WaveformState, dataArray?: Uint8Array): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    const colorMap: Record<WaveformState, string> = {
      idle: '#22c55e',
      speaking: '#3b82f6',
      playing: '#f97316',
    };
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorMap[state];
    ctx.beginPath();
    if (dataArray && dataArray.length > 0) {
      const sliceWidth = width / dataArray.length;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
    } else {
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
    }
    ctx.stroke();
  }, [canvasRef]);

  const playAIResponse = useCallback(async (transcript: string): Promise<void> => {
    if (isProcessingRef.current || !isRunningRef.current) return;
    isProcessingRef.current = true;
    isPlayingRef.current = true;
    waveformStateRef.current = 'playing';
    setIsPlaying(true);
    setStatusText('Lenny is thinking...');

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/lenny-ai`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          transcript,
          conversationHistory: conversationHistoryRef.current,
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const { text, audio } = data as { text: string; audio: string };
      if (!audio) throw new Error('No audio data returned from API');
      conversationHistoryRef.current = [
        ...conversationHistoryRef.current,
        { role: 'user', content: transcript },
        { role: 'assistant', content: text },
      ];

      addLog('lenny', text);
      setResponseCount(prev => prev + 1);
      setStatusText(`Lenny: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`);

      const byteChars = atob(audio);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
      const byteArray = new Uint8Array(byteNums);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      const audioEl = new Audio(url);
      audioEl.setAttribute('playsinline', '');
      audioEl.setAttribute('webkit-playsinline', '');
      currentAudioRef.current = audioEl;

      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        await playPromise;
        await new Promise<void>(resolve => {
          audioEl.onended = () => resolve();
          audioEl.onerror = () => resolve();
        });
      }
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('AI Lenny error:', err);
      setErrorMessage(`AI response failed: ${String(err)}`);
    } finally {
      isPlayingRef.current = false;
      isProcessingRef.current = false;
      waveformStateRef.current = 'idle';
      currentAudioRef.current = null;
      setIsPlaying(false);
      if (isRunningRef.current) setStatusText('Listening for scammer...');
    }
  }, [addLog]);

  const handleSilenceEnd = useCallback((): void => {
    const transcript = transcriptBufferRef.current.trim();
    transcriptBufferRef.current = '';
    isSpeakingRef.current = false;
    waveformStateRef.current = 'idle';
    setIsSpeaking(false);

    if (transcript && isRunningRef.current && !isProcessingRef.current) {
      addLog('scammer', transcript);
      playAIResponse(transcript);
    } else if (isRunningRef.current && !isProcessingRef.current) {
      playAIResponse('...');
    }
  }, [addLog, playAIResponse]);

  const vadLoop = useCallback((): void => {
    if (!isRunningRef.current) return;
    const analyser = analyserRef.current;
    if (!analyser) return;

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqData);
    const avg = freqData.reduce((sum, val) => sum + val, 0) / freqData.length;
    const volumePct = Math.min(100, (avg / 255) * 100 * 3.5);
    setVolumeLevel(volumePct);

    const timeData = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeData);
    drawWaveform(waveformStateRef.current, timeData);

    if (!isPlayingRef.current && !isProcessingRef.current) {
      if (volumePct > SILENCE_THRESHOLD) {
        if (!isSpeakingRef.current) {
          isSpeakingRef.current = true;
          waveformStateRef.current = 'speaking';
          setIsSpeaking(true);
          setStatusText('Scammer is speaking...');
          setTurnCount(prev => prev + 1);
        }
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (isSpeakingRef.current) {
        waveformStateRef.current = 'idle';
        if (!silenceTimerRef.current) {
          setStatusText('Silence detected — Lenny is responding...');
          silenceTimerRef.current = setTimeout(() => {
            silenceTimerRef.current = null;
            if (isRunningRef.current && !isPlayingRef.current) {
              handleSilenceEnd();
            }
          }, SILENCE_DURATION);
        }
      } else {
        waveformStateRef.current = 'idle';
        if (isRunningRef.current) setStatusText('Listening for scammer...');
      }
    }

    animFrameRef.current = requestAnimationFrame(vadLoop);
  }, [drawWaveform, handleSilenceEnd]);

  const startSpeechRecognition = useCallback((): void => {
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcriptBufferRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim || transcriptBufferRef.current) {
        setStatusText(`Scammer: "${(transcriptBufferRef.current + interim).slice(0, 60)}..."`);
      }
    };

    recognition.onerror = () => {};
    recognition.onend = () => {
      if (isRunningRef.current) {
        try { recognition.start(); } catch {}
      }
    };

    try { recognition.start(); } catch {}
  }, []);

  const start = useCallback(async (): Promise<void> => {
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      isRunningRef.current = true;
      startTimeRef.current = Date.now();
      setIsRunning(true);
      setStatusText('Listening for scammer...');

      elapsedTimerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);

      startSpeechRecognition();
      animFrameRef.current = requestAnimationFrame(vadLoop);
    } catch (err: unknown) {
      const error = err as DOMException;
      let msg: string;
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        let isInIframe = false;
        try { isInIframe = window.self !== window.top; } catch { isInIframe = true; }
        msg = isInIframe
          ? 'Microphone blocked by iframe permissions. The page embedding this app must add allow="microphone" to its <iframe> tag.'
          : 'Microphone access denied. Please allow microphone access in your browser and try again.';
      } else {
        msg = `Could not access microphone: ${error.message}`;
      }
      setStatusText(msg);
      setErrorMessage(msg);
    }
  }, [vadLoop, startSpeechRecognition]);

  const stop = useCallback((): void => {
    isRunningRef.current = false;
    isPlayingRef.current = false;
    isSpeakingRef.current = false;
    isProcessingRef.current = false;
    waveformStateRef.current = 'idle';

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    transcriptBufferRef.current = '';

    setIsRunning(false);
    setIsPlaying(false);
    setIsSpeaking(false);
    setVolumeLevel(0);
    setStatusText('Stopped. Click "Start Conversation" to begin again.');
    drawWaveform('idle');
  }, [drawWaveform]);

  const reset = useCallback((): void => {
    stop();
    startTimeRef.current = null;
    conversationHistoryRef.current = [];
    setResponseCount(0);
    setTurnCount(0);
    setElapsedSeconds(0);
    setConversationLog([]);
    setStatusText('Click "Start Conversation" to begin');
    setErrorMessage('');
    drawWaveform('idle');
  }, [stop, drawWaveform]);

  useEffect(() => {
    drawWaveform('idle');
  }, [drawWaveform]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    isRunning,
    isPlaying,
    isSpeaking,
    responseCount,
    turnCount,
    elapsedTime: formatTime(elapsedSeconds),
    conversationLog,
    statusText,
    volumeLevel,
    errorMessage,
    start,
    stop,
    reset,
  };
}
