import { useState, useEffect, useRef, useCallback } from 'react';
import { useBeep } from './useBeep';

interface UseTimerProps {
  onEnd?: () => void;
}

export const useTimer = ({ onEnd }: UseTimerProps = {}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const initialDurationRef = useRef(0);
  const { playBeep } = useBeep();

  const start = useCallback((duration: number) => {
    if (duration <= 0) return;
    initialDurationRef.current = duration;
    setTime(duration);
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const reset = useCallback((newDuration?: number) => {
    const duration = newDuration || initialDurationRef.current;
    if (duration > 0) {
      setTime(duration);
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playBeep(3000); // Play beep for 3 seconds on timer end
            onEnd?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onEnd, playBeep]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
  };
};