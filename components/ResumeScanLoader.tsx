
import React from 'react';

const ResumeScanLoader: React.FC = () => {
    return (
        <div className="relative flex justify-center items-center py-6">
            <div className="relative w-32 h-44 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col p-4 space-y-3">
                {/* Header Skeleton */}
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                </div>

                {/* Body Lines Skeleton */}
                <div className="space-y-2 flex-1">
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded w-full animate-pulse delay-75"></div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded w-full animate-pulse delay-100"></div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded w-5/6 animate-pulse delay-150"></div>
                     <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded w-full animate-pulse delay-200"></div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded w-4/5 animate-pulse delay-300"></div>
                </div>

                {/* Scan Line Overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75 shadow-[0_0_15px_2px_rgba(59,130,246,0.6)] animate-scan-resume"></div>
                
                 {/* Hired Stamp */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-green-500 text-green-500 font-black text-2xl px-2 py-1 rounded opacity-0 animate-stamp rotate-[-15deg] whitespace-nowrap z-10">
                    HIRED
                </div>
            </div>
            
            {/* Pulse Background */}
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10 animate-pulse-slow"></div>

            <style>{`
                @keyframes scan-resume {
                    0% { top: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
                @keyframes stamp {
                    0%, 40% { opacity: 0; transform: translate(-50%, -50%) scale(2) rotate(-15deg); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(-15deg); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(-15deg); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5) rotate(-15deg); }
                }
                .animate-scan-resume {
                    animation: scan-resume 3s ease-in-out infinite;
                }
                .animate-stamp {
                    animation: stamp 3s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default ResumeScanLoader;
