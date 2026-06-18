import React, { useState, useEffect } from 'react';
import type { InterviewPrepResult, InterviewQuestion } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useTimer } from '../hooks/useTimer';
import Card from './common/Card';
import Button from './common/Button';
import MicrophoneIcon from './icons/MicrophoneIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import StopCircleIcon from './icons/StopCircleIcon';
import ExclamationCircleIcon from './icons/ExclamationCircleIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import RefreshIcon from './icons/RefreshIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface LiveInterviewProps {
  questions: InterviewPrepResult;
  onFinish: () => void;
}

const QUESTION_TIME_LIMITS: Record<InterviewQuestion['type'], number> = {
    'technical': 30, // 30 seconds
    'project-based': 30, // 30 seconds
    'hr': 30, // 30 seconds
};

const LiveInterview: React.FC<LiveInterviewProps> = ({ questions, onFinish }) => {
    const [phase, setPhase] = useState<'intro' | 'interview' | 'summary'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(questions.length).fill(''));
    
    const { 
        isSpeechRecognitionSupported,
        isListening, 
        transcript, 
        setTranscript,
        startListening, 
        stopListening, 
        isSpeaking, 
        speak 
    } = useSpeech();

    const {
        formattedTime,
        isRunning,
        isPaused,
        start: startTimer,
        pause: pauseTimer,
        resume: resumeTimer,
        reset: resetTimer,
    } = useTimer({ onEnd: () => {
        if(isListening) stopListening();
    }});

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (!isListening && transcript) {
            setUserAnswers(prev => {
                const newAnswers = [...prev];
                newAnswers[currentQuestionIndex] = transcript;
                return newAnswers;
            });
        }
    }, [isListening, transcript, currentQuestionIndex]);

    useEffect(() => {
        if (phase === 'interview') {
            const duration = QUESTION_TIME_LIMITS[currentQuestion.type] ?? 30;
            startTimer(duration);
        }
    }, [currentQuestionIndex, phase, currentQuestion.type, startTimer]);


    const handleNext = () => {
        if (isListening) stopListening();
        if (isSpeaking) speak(''); // cancel speaking
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTranscript(userAnswers[currentQuestionIndex + 1] || '');
        } else {
            setPhase('summary');
        }
    };

    const handlePrev = () => {
        if (isListening) stopListening();
        if (isSpeaking) speak(''); // cancel speaking
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setTranscript(userAnswers[currentQuestionIndex - 1] || '');
        }
    };

    const handleRecordToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            if (isPaused) resumeTimer();
            startListening();
        }
    };

    if (!isSpeechRecognitionSupported) {
        return (
            <Card className="text-center max-w-2xl mx-auto">
                <ExclamationCircleIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold font-display dark:text-gray-200">Browser Not Supported</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    The live interview feature requires the Web Speech API, which is not supported by your current browser. Please try again with Google Chrome.
                </p>
                <Button onClick={onFinish} className="mt-6">Back to Question List</Button>
            </Card>
        );
    }

    if (phase === 'intro') {
        return (
            <Card className="text-center max-w-2xl mx-auto animate-fade-in">
                <MicrophoneIcon className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <h2 className="text-3xl font-bold font-display dark:text-gray-200">Mock Interview</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                    You're about to start a practice interview with {questions.length} questions.
                    Each question will have a timer. The app will ask each question, and you can record your answer using your microphone. Your browser will ask for microphone permission.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button onClick={() => setPhase('interview')} size="lg">Begin Interview</Button>
                    <Button onClick={onFinish} variant="secondary" size="lg">Cancel</Button>
                </div>
            </Card>
        );
    }

    if (phase === 'summary') {
        return (
            <Card className="max-w-4xl mx-auto animate-fade-in">
                <h2 className="text-3xl font-bold font-display text-center mb-6 dark:text-gray-200">Interview Complete!</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Review your transcribed answers below. Practice makes perfect!</p>
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{index + 1}. {q.question}</p>
                            <p className="mt-2 pl-4 border-l-4 border-blue-200 dark:border-blue-700 text-gray-700 dark:text-gray-300 italic">
                                {userAnswers[index] || "No answer recorded."}
                            </p>
                        </div>
                    ))}
                </div>
                 <div className="mt-8 flex justify-center">
                    <Button onClick={onFinish} size="lg">Finish Review</Button>
                </div>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-200">Mock Interview</h2>
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">{currentQuestion.type}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg my-6 min-h-[120px] flex items-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{currentQuestion.question}</p>
                </div>
                
                <div className="flex flex-col items-center justify-center gap-6 my-8">
                    {/* Timer UI */}
                    <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className={`text-3xl font-mono font-bold ${!isRunning ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>{formattedTime}</span>
                        <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-3">
                             <button onClick={isPaused ? resumeTimer : pauseTimer} disabled={!isRunning} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors" title={isPaused ? 'Resume' : 'Pause'}>
                                {isPaused ? <PlayIcon /> : <PauseIcon />}
                            </button>
                             <button onClick={() => resetTimer()} disabled={!isRunning} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors" title="Reset Timer">
                                <RefreshIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <Button onClick={() => speak(currentQuestion.question)} disabled={isSpeaking} variant="secondary" title="Read question aloud">
                            <SpeakerIcon className="w-6 h-6" />
                        </Button>
                        <Button onClick={handleRecordToggle} size="lg" className={`!px-6 !py-4 transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {isListening ? (
                                <div className="flex items-center gap-2">
                                    <StopCircleIcon className="w-7 h-7" /> <span className="text-lg">Stop Recording</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <MicrophoneIcon className="w-7 h-7" /> <span className="text-lg">Record Answer</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Your transcribed answer:</label>
                    <textarea 
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="w-full mt-2 p-4 h-48 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={isListening ? "Listening..." : "Your answer will appear here. You can also type."}
                    />
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="secondary">
                        <div className="flex items-center gap-2">
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Previous</span>
                        </div>
                    </Button>
                    <Button onClick={handleNext}>
                         <div className="flex items-center gap-2">
                            <span>{currentQuestionIndex === questions.length - 1 ? 'Finish & Review' : 'Next Question'}</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </div>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LiveInterview;