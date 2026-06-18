
import React, { useRef, useEffect, useState } from 'react';
import type { AnalysisResult } from '../types';
import { useCountUp } from '../hooks/useCountUp';
import Button from './common/Button';
import SparklesIcon from './icons/SparklesIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

interface HireFireDisplayProps {
  result: AnalysisResult;
  onShowDetails: () => void;
  onPrepareInterview: () => void;
  isPreparingInterview: boolean;
  emailSentMessage?: string | null;
}

// Particle animation logic
const useParticleAnimation = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: { x: number, y: number, size: number, speedX: number, speedY: number, color: string }[] = [];
        const setCanvasSize = () => {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
            }
        };

        const initParticles = () => {
            particles = [];
            const numberOfParticles = 30;
            // Colors: Green #4CAF50, Red #F44336, plus White accents
            const colors = ['rgba(76, 175, 80, 0.3)', 'rgba(244, 67, 54, 0.3)', 'rgba(255, 255, 255, 0.15)'];
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() * 0.3) - 0.15,
                    speedY: (Math.random() * 0.3) - 0.15,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
                if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };
        
        setCanvasSize();
        initParticles();
        const animationFrameId = requestAnimationFrame(animate);

        window.addEventListener('resize', setCanvasSize);
        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animationFrameId);
        }
    }, [canvasRef]);
};

const CircularHireFireChart = ({ hirePercent }: { hirePercent: number }) => {
    const firePercent = 100 - hirePercent;
    
    // Animation states
    const [greenFill, setGreenFill] = useState(0);
    const [redFill, setRedFill] = useState(0);
    const [redCountTarget, setRedCountTarget] = useState(0);

    // Sequence the animation: Green first, then Red fills the remaining gap
    useEffect(() => {
        // Reset
        setGreenFill(0);
        setRedFill(0);
        setRedCountTarget(0);

        // 1. Start Green Animation (Duration ~1.2s)
        // Slight delay on mount for better visual entry
        const t1 = setTimeout(() => {
            setGreenFill(hirePercent);
        }, 300);

        // 2. Start Red Animation after Green finishes + delay
        // Green Start: 300ms
        // Green Duration: 1200ms
        // Green End: 1500ms
        // Pause: 400ms
        // Red Start: 1900ms
        const t2 = setTimeout(() => {
            setRedFill(firePercent);
            setRedCountTarget(firePercent);
        }, 1900);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [hirePercent, firePercent]);

    // Counters
    // Green counts up over 1500ms to match the fill + start delay roughly
    const animatedHireText = useCountUp(hirePercent, 1500); 
    // Red counts up over 1200ms when triggered
    const animatedFireText = useCountUp(redCountTarget, 1200);

    // SVG Configuration
    const size = 200; // viewBox size
    const center = size / 2;
    const radius = 85; 
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;

    // Stroke Logic
    const greenOffset = circumference - (greenFill / 100) * circumference;
    const redOffset = circumference - (redFill / 100) * circumference;

    // Red segment starts where Green ends
    // -90deg is 12 o'clock. We rotate clockwise by the green percentage.
    const redRotation = -90 + (hirePercent / 100) * 360;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center my-6 group">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[#9787F3]/10 blur-[60px] rounded-full pointer-events-none animate-pulse-glow"></div>

            {/* SVG Chart */}
            <svg 
                className="w-full h-full overflow-visible relative z-10"
                viewBox={`0 0 ${size} ${size}`}
            >
                <defs>
                    <linearGradient id="hireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4CAF50" />
                        <stop offset="100%" stopColor="#69F0AE" />
                    </linearGradient>
                    <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF5350" />
                        <stop offset="100%" stopColor="#F44336" />
                    </linearGradient>
                    
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Base Track (Faint) */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                />

                {/* Green Segment (Fills First) */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill="none"
                    stroke="url(#hireGradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={greenOffset}
                    strokeLinecap="round"
                    filter="url(#glowEffect)"
                    transform={`rotate(-90 ${center} ${center})`}
                    className="transition-all duration-[1200ms] ease-in-out"
                />

                {/* Red Segment (Fills Second, starting from end of Green) */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill="none"
                    stroke="url(#fireGradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={redOffset}
                    strokeLinecap="round"
                    filter="url(#glowEffect)"
                    transform={`rotate(${redRotation} ${center} ${center})`}
                    className="transition-all duration-[1200ms] ease-in-out"
                />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                 <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-2xl font-bold text-[#4CAF50] drop-shadow-md font-display whitespace-nowrap leading-tight">
                        Hire: {animatedHireText}%
                    </p>
                    <div className="w-16 h-px bg-white/10 my-1"></div>
                    <p className="text-2xl font-bold text-[#F44336] drop-shadow-md font-display whitespace-nowrap leading-tight">
                        Fire: {animatedFireText}%
                    </p>
                 </div>
            </div>
        </div>
    );
};

const HireFireDisplay: React.FC<HireFireDisplayProps> = ({ result, onShowDetails, onPrepareInterview, isPreparingInterview, emailSentMessage }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useParticleAnimation(canvasRef);

    // Use Job Readiness as the source of truth for Hire % to ensure 100% split
    const hirePercent = result.jobReadinessScore;
    
    return (
        <div className="relative bg-[#050B15]/60 backdrop-blur-2xl rounded-[2rem] p-8 w-full max-w-4xl mx-auto my-8 animate-fade-in text-center border border-white/5 shadow-2xl overflow-hidden flex flex-col justify-center min-h-[60vh]">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-30 pointer-events-none"></canvas>
            
            <div className="relative z-10 flex flex-col items-center w-full">
                <div className="mb-4 space-y-2">
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight drop-shadow-sm">Analysis Complete</h2>
                    <p className="text-[#9787F3] text-lg font-medium">Here is your resume performance breakdown</p>
                </div>
                
                <CircularHireFireChart hirePercent={hirePercent} />

                {emailSentMessage && (
                    <div className="mb-6 p-3 px-6 bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-full text-[#4CAF50] animate-fade-in flex items-center justify-center space-x-2 backdrop-blur-md">
                        <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{emailSentMessage}</span>
                    </div>
                )}
                
                 <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                    <Button onClick={onShowDetails} size="lg" className="!px-6 !py-3 !text-base !rounded-full group bg-[#3478ff] hover:bg-[#2c65d6] text-white border-none shadow-[0_0_20px_rgba(52,120,255,0.4)] hover:shadow-[0_0_30px_rgba(52,120,255,0.5)] transition-all">
                        <div className="flex items-center space-x-2">
                            <SparklesIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                            <span className="font-semibold">View Full Report</span>
                        </div>
                    </Button>
                    <Button onClick={onPrepareInterview} size="lg" className="!px-6 !py-3 !text-base !rounded-full group bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all" isLoading={isPreparingInterview}>
                         <div className="flex items-center space-x-2">
                            <QuestionMarkCircleIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-semibold">Prepare Interview</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HireFireDisplay;
