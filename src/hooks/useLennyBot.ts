import { useRef, useState, useCallback, useEffect, RefObject } from 'react';
import { LENNY_AUDIOS } from '../data/audioFiles';
import type { ConversationEntry } from '../types';

const SILENCE_THRESHOLD = 12;
const SILENCE_DURATION = 1800;

export type WaveformState = 'idle' | 'speaking' | 'playing';

export function useLennyBot(canvasRef: RefObject<HTMLCanvasElement>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isRunningRef = useRef(false);
  const audioIndexRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const waveformStateRef = useRef<WaveformState>('idle');

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

  const playNextAudio = useCallback((): void => {
    if (isPlayingRef.current) return;

    const audio = LENNY_AUDIOS[audioIndexRef.current];
    const audioEl = new Audio();
    audioEl.setAttribute('playsinline', '');
    audioEl.setAttribute('webkit-playsinline', '');
    audioEl.src = audio.url;

    currentAudioRef.current = audioEl;
    isPlayingRef.current = true;
    isSpeakingRef.current = false;
    waveformStateRef.current = 'playing';

    setIsPlaying(true);
    setIsSpeaking(false);
    setStatusText(`Lenny: "${audio.label}"`);
    addLog('lenny', audio.label);
    setResponseCount(prev => prev + 1);

    audioIndexRef.current = (audioIndexRef.current + 1) % LENNY_AUDIOS.length;

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioEl.onended = () => {
            isPlayingRef.current = false;
            waveformStateRef.current = 'idle';
            currentAudioRef.current = null;
            setIsPlaying(false);
            if (isRunningRef.current) setStatusText('Listening for scammer...');
          };
        })
        .catch((err: Error) => {
          console.error('Audio playback failed:', err);
          isPlayingRef.current = false;
          waveformStateRef.current = 'idle';
          currentAudioRef.current = null;
          setIsPlaying(false);
          setStatusText('Audio blocked — tap Start again to enable audio');
          setErrorMessage('Audio playback was blocked. Tap Start to try again.');
        });
    }
  }, [addLog]);

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

    if (!isPlayingRef.current) {
      if (volumePct > SILENCE_THRESHOLD) {
        if (!isSpeakingRef.current) {
          isSpeakingRef.current = true;
          waveformStateRef.current = 'speaking';
          setIsSpeaking(true);
          setStatusText('Scammer is speaking...');
          addLog('scammer', '🎤 Speaking...');
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
              playNextAudio();
            }
          }, SILENCE_DURATION);
        }
      } else {
        waveformStateRef.current = 'idle';
        if (isRunningRef.current) setStatusText('Listening for scammer...');
      }
    }

    animFrameRef.current = requestAnimationFrame(vadLoop);
  }, [addLog, drawWaveform, playNextAudio]);

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

      animFrameRef.current = requestAnimationFrame(vadLoop);
    } catch (err: unknown) {
      const error = err as DOMException;
      const msg =
        error.name === 'NotAllowedError'
          ? 'Microphone access denied. Please allow microphone access and try again.'
          : `Could not access microphone: ${error.message}`;
      setStatusText(msg);
      setErrorMessage(msg);
    }
  }, [vadLoop]);

  const stop = useCallback((): void => {
    isRunningRef.current = false;
    isPlayingRef.current = false;
    isSpeakingRef.current = false;
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;

    setIsRunning(false);
    setIsPlaying(false);
    setIsSpeaking(false);
    setVolumeLevel(0);
    setStatusText('Stopped. Click "Start Conversation" to begin again.');

    drawWaveform('idle');
  }, [drawWaveform]);

  const reset = useCallback((): void => {
    stop();
    audioIndexRef.current = 0;
    startTimeRef.current = null;
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
