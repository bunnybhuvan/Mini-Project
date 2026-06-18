import React from 'react';
import Button from './common/Button';
import SparklesIcon from './icons/SparklesIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import ScrollReveal from './common/ScrollReveal';

interface HeroSectionProps {
    onGetStarted: () => void;
    onBuildResume: () => void;
    onJobTracker: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onBuildResume, onJobTracker }) => {
    return (
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-visible flex items-center justify-center min-h-[85vh]">
            
            {/* Soft Radial Gradient Spotlight behind card - Adds depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] md:w-[800px] md:h-[800px] bg-indigo-500/10 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {/* Glass Card Container */}
                <div className="max-w-5xl mx-auto bg-white/60 dark:bg-navy-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-2xl dark:shadow-black/40 p-8 md:p-14 lg:p-20 text-center relative overflow-hidden group transition-all duration-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20">
                    
                    {/* Inner highlight for extra glass feel */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <ScrollReveal delay={100} direction="up">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-8 drop-shadow-sm">
                                Transform Your Resume.
                                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                    Land Your Dream Job.
                                </span>
                            </h1>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={300} direction="up">
                            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-12">
                                Get instant, AI-powered feedback, build a resume from scratch with AI assistance, or track all your job applications in one place.
                            </p>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={500} direction="up" className="w-full">
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full">
                                <Button 
                                    onClick={onJobTracker} 
                                    size="lg" 
                                    className="w-full sm:w-auto !bg-white/50 dark:!bg-white/5 !border-gray-200 dark:!border-white/10 !text-gray-700 dark:!text-gray-200 hover:!bg-white/80 dark:hover:!bg-white/10 hover:!border-blue-300 dark:hover:!border-blue-500/50 backdrop-blur-md shadow-sm !px-8 !py-4 !rounded-xl"
                                >
                                    <BriefcaseIcon className="w-5 h-5 mr-2 opacity-70" />
                                    Track Applications
                                </Button>

                                <Button 
                                    onClick={onBuildResume} 
                                    size="lg" 
                                    className="w-full sm:w-auto !bg-white/50 dark:!bg-white/5 !border-gray-200 dark:!border-white/10 !text-gray-700 dark:!text-gray-200 hover:!bg-white/80 dark:hover:!bg-white/10 hover:!border-blue-300 dark:hover:!border-blue-500/50 backdrop-blur-md shadow-sm !px-8 !py-4 !rounded-xl"
                                >
                                    <DocumentTextIcon className="w-5 h-5 mr-2 opacity-70" />
                                    Build My Resume
                                </Button>

                                <Button 
                                    onClick={onGetStarted} 
                                    size="lg" 
                                    className="w-full sm:w-auto !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:!from-blue-700 hover:!to-indigo-700 !text-white !border-none !shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:!shadow-[0_0_35px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 !px-8 !py-4 !font-bold !rounded-xl"
                                >
                                    Analyze My Resume Now
                                    <SparklesIcon className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;