import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './common/Button';
import SparklesIcon from './icons/SparklesIcon';
import ThemeToggle from './ThemeToggle';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';
import LandingNavigationMenu from './LandingNavigationMenu';

interface NavbarProps {
    onGetStarted: () => void;
    onBuildResume: () => void;
    onJobTracker: () => void;
    activeRoute?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onGetStarted, onBuildResume, onJobTracker, activeRoute = '' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToResources = () => {
        const element = document.getElementById('features');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Job Tracker', id: 'tracker', action: onJobTracker },
        { name: 'Resume Builder', id: 'builder', action: onBuildResume },
        { name: 'Resources', id: 'resources', action: handleScrollToResources },
    ];

    return (
        <>
            <nav
                className={`
                    fixed top-4 left-0 right-0 mx-auto max-w-6xl z-50 px-4 transition-all duration-300
                    ${isMenuOpen ? 'z-50' : 'z-50'}
                `}
            >
                <div 
                    className={`
                        relative flex items-center justify-between px-4 py-3 md:px-6 md:py-3 rounded-full border transition-all duration-300
                        ${scrolled 
                            ? 'bg-white/80 dark:bg-navy-950/80 shadow-lg border-white/20 dark:border-white/10 backdrop-blur-xl' 
                            : 'bg-white/60 dark:bg-navy-950/60 shadow-sm border-white/40 dark:border-white/5 backdrop-blur-lg'
                        }
                    `}
                >
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center space-x-2 group shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors">
                            <SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            Resumetrix
                        </span>
                    </Link>

                    {/* Center: Desktop Nav Links */}
                    <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center p-1 space-x-1 rounded-full bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 backdrop-blur-sm">
                            {navLinks.map((link) => {
                                const isActive = activeRoute === link.id;
                                return (
                                    <button
                                        key={link.name}
                                        onClick={link.action}
                                        className={`
                                            px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                                            }
                                        `}
                                    >
                                        {link.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
                        
                        <Button 
                            onClick={onGetStarted} 
                            size="sm" 
                            className="hidden md:flex shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all !rounded-full px-6"
                        >
                            Get Started
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <div className="flex md:hidden items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown Panel */}
                <LandingNavigationMenu 
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onAnalyze={onGetStarted}
                    onBuild={onBuildResume}
                    onTrack={onJobTracker}
                    onResources={handleScrollToResources}
                />
            </nav>
        </>
    );
};

export default Navbar;