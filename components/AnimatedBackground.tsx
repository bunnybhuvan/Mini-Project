
import React, { useMemo } from 'react';

/**
 * DynamicBackground Component
 * 
 * A premium, production-ready background component designed for Tech/AI SaaS applications.
 * Includes subtle, high-performance CSS snow effect.
 */
const DynamicBackground: React.FC = () => {
    // Memoize snow particles to prevent re-renders of randomized values
    const snowParticles = useMemo(() => 
        Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 3 + 1}px`,
            duration: `${Math.random() * 12 + 10}s`,
            delay: `${Math.random() * -20}s`, // Negative delay starts them mid-animation
            opacity: Math.random() * 0.5 + 0.1,
            blur: `${Math.random() * 1.5}px`,
            sway: `${(Math.random() - 0.5) * 40}px`
        })), []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50 dark:bg-navy-950 transition-colors duration-700 ease-in-out">
            
            {/* --- Dark Mode Layers --- */}
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700 ease-in-out">
                 {/* Top Left - Electric Blue */}
                <div 
                    className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] animate-blob-spin"
                    style={{
                        background: 'radial-gradient(circle, rgba(52,120,255,0.4) 0%, rgba(5,11,21,0) 70%)',
                    }}
                />
                
                {/* Bottom Right - Accent Blue/Cyan */}
                <div 
                    className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] animate-blob-spin"
                    style={{
                        background: 'radial-gradient(circle, rgba(79,157,255,0.3) 0%, rgba(5,11,21,0) 70%)',
                        animationDelay: '-20s',
                        animationDirection: 'reverse'
                    }}
                />
                
                {/* Center - Deep Pulse */}
                <div 
                    className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[120px] animate-pulse-glow"
                    style={{
                        background: 'radial-gradient(circle, rgba(52,120,255,0.15) 0%, rgba(5,11,21,0) 70%)',
                    }}
                />
                
                 {/* Dark Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#050B15_100%)] opacity-80 pointer-events-none" />
            </div>


            {/* --- Light Mode Layers --- */}
            <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-700 ease-in-out">
                 {/* Top Left - Soft Blue */}
                <div 
                    className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[80px] animate-blob-spin"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(249, 250, 251, 0) 70%)',
                    }}
                />
                
                {/* Bottom Right - Soft Purple */}
                <div 
                    className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[80px] animate-blob-spin"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(249, 250, 251, 0) 70%)',
                        animationDelay: '-15s',
                        animationDirection: 'reverse'
                    }}
                />

                {/* Center - Gentle Cyan Pulse */}
                <div 
                    className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-glow"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(249, 250, 251, 0) 70%)',
                    }}
                />

                 {/* Light Vignette - Subtle darkening at edges */}
                <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,rgba(0,0,0,0.03)_100%)] opacity-100 pointer-events-none" />
            </div>

            {/* --- Snow Particles Effect --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {snowParticles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute bg-white dark:bg-blue-100 rounded-full animate-snow"
                        style={{
                            left: particle.left,
                            width: particle.size,
                            height: particle.size,
                            opacity: particle.opacity,
                            filter: `blur(${particle.blur})`,
                            animationDuration: particle.duration,
                            animationDelay: particle.delay,
                            top: '-10px',
                            '--sway-dist': particle.sway
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <style>{`
                @keyframes snow {
                    0% {
                        transform: translateY(-10px) translateX(0);
                    }
                    25% {
                        transform: translateY(25vh) translateX(var(--sway-dist));
                    }
                    50% {
                        transform: translateY(50vh) translateX(0);
                    }
                    75% {
                        transform: translateY(75vh) translateX(calc(var(--sway-dist) * -1));
                    }
                    100% {
                        transform: translateY(105vh) translateX(0);
                    }
                }
                .animate-snow {
                    animation: snow linear infinite;
                    will-change: transform;
                }
            `}</style>

            {/* 
               Shared Noise Texture 
               Crucial for glassmorphism. Adds grit to help glass cards "pop".
            */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none" />
            
        </div>
    );
};

export default DynamicBackground;
