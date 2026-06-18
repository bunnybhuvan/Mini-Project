import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import ScrollReveal from './common/ScrollReveal';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/10 dark:bg-navy-950/30 backdrop-blur-lg border-t border-white/10 relative z-10">
            <div className="container mx-auto px-6 py-12">
                <ScrollReveal direction="up" distance="20px">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center space-x-2 mb-4 p-2 bg-blue-50 dark:bg-white/5 rounded-xl">
                            <SparklesIcon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                            <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-200">Resumetrix</h2>
                        </div>
                        <p className="max-w-md text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Empowering professionals to create standout resumes and land their dream jobs with the power of AI.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a>
                        </div>

                        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-8"></div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-500">&copy; {new Date().getFullYear()} Resumetrix. All rights reserved.</p>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </footer>
    );
};

export default Footer;