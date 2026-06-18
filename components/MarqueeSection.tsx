import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import ScrollReveal from './common/ScrollReveal';

const features = [
  'AI Resume Analysis',
  'ATS Optimization',
  'Job Readiness Score',
  'Actionable Suggestions',
  'Keyword Recommendations',
  'AI Resume Builder',
  'Live Resume Preview',
  'Multiple Templates',
  'Job Application Tracker',
  'Interview Question Generator',
  'Live Mock Interview',
  'Rexa AI Assistant',
  'PDF Export',
  'Dark/Light Mode',
];

const MarqueeSection: React.FC = () => {
    return (
        <section className="py-20 border-t border-gray-100 dark:border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-6 text-center mb-12">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100">
                        An All-in-One Career Toolkit
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Everything you need to get hired, powered by AI.
                    </p>
                </ScrollReveal>
            </div>
            
            <ScrollReveal delay={200} direction="none" duration={1000}>
                <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <div className="flex animate-marquee-scroll py-4">
                        {[...features, ...features].map((feature, index) => (
                            <div key={index} className="flex-shrink-0 flex items-center justify-center mx-4 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                                <SparklesIcon className="w-4 h-4 mr-2 text-blue-500" />
                                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
};

export default MarqueeSection;