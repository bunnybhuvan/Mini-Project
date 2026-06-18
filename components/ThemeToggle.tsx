import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div
                className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center"
                style={{ transform: theme === 'light' ? 'translateX(0rem)' : 'translateX(2rem)' }}
            >
                {theme === 'light' ? (
                    <SunIcon className="w-4 h-4 text-yellow-500" />
                ) : (
                    <MoonIcon className="w-4 h-4 text-blue-400" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
