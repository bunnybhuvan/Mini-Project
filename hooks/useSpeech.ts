import { useState, useEffect, useCallback, useRef } from 'react';

// FIX: Cast window to `any` to access non-standard `SpeechRecognition` and `webkitSpeechRecognition` APIs.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const useSpeech = () => {
    // --- Speech Synthesis (Text-to-Speech) ---
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef(window.speechSynthesis);

    const speak = useCallback((text: string, onEnd?: () => void) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd?.();
        };
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
        };
        synthRef.current.speak(utterance);
    }, []);

    const cancelSpeaking = useCallback(() => {
        synthRef.current.cancel();
        setIsSpeaking(false);
    }, []);

    // --- Speech Recognition (Speech-to-Text) ---
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!isSpeechRecognitionSupported) {
            console.warn('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let fullTranscript = '';
            for (const result of event.results) {
                fullTranscript += result[0].transcript;
            }
            setTranscript(fullTranscript);
        };
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognitionRef.current = recognition;

        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (isListening || !recognitionRef.current) return;
        setTranscript('');
        recognitionRef.current.start();
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (!isListening || !recognitionRef.current) return;
        recognitionRef.current.stop();
    }, [isListening]);

    return {
        isSpeechRecognitionSupported,
        isListening,
        transcript,
        setTranscript,
        startListening,
        stopListening,
        isSpeaking,
        speak,
        cancelSpeaking,
    };
};