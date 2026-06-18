import { useRef, useCallback } from 'react';

export const useBeep = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback((duration: number, frequency = 440, volume = 0.5) => {
    if (!audioContextRef.current) {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }

    const context = audioContextRef.current;
    if (!context) {
        console.warn("Web Audio API is not supported in this browser.");
        return;
    }
    
    if (context.state === 'suspended') {
        context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(volume, context.currentTime);
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = 'sine';

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);

  }, []);

  return { playBeep };
};
