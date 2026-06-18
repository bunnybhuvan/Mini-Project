import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import XIcon from './icons/XIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogOutIcon from './icons/LogOutIcon';
import type { Module } from './Dashboard';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: Module) => void;
  onLogout: () => void;
  activeModule: Module;
}

const navItems: { id: Module; label: string; icon: React.ReactNode }[] = [
  { id: 'analyzer', label: 'Resume Analyzer', icon: <SparklesIcon className="w-6 h-6" /> },
  { id: 'builder', label: 'Resume Builder', icon: <DocumentTextIcon className="w-6 h-6" /> },
  { id: 'tracker', label: 'Job Tracker', icon: <BriefcaseIcon className="w-6 h-6" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
];

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose, onNavigate, onLogout, activeModule }) => {

  const handleNavigate = (module: Module) => {
    onNavigate(module);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      {/* Menu Panel */}
      <div
        className={`relative bg-white dark:bg-gray-800 w-80 h-full shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-2">
               <SparklesIcon className="w-7 h-7 text-blue-600 dark:text-blue-500" />
               <h1 className="text-xl font-display font-bold text-gray-800 dark:text-gray-200">Resumetrix</h1>
            </div>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <XIcon className="w-6 h-6"/>
            </button>
        </div>

        <nav className="p-4 flex flex-col justify-between" style={{ height: 'calc(100% - 65px)' }}>
            <ul className="space-y-2">
                {navItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => handleNavigate(item.id)}
                            className={`w-full text-left flex items-center gap-4 p-4 rounded-lg text-lg font-semibold transition-colors ${
                                activeModule === item.id
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-4 p-4 rounded-lg text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <LogOutIcon className="w-6 h-6" />
                <span>Logout</span>
            </button>
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenu;