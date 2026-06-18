import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import Button from './common/Button';

interface LandingNavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: () => void;
  onBuild: () => void;
  onTrack: () => void;
  onResources: () => void;
}

const LandingNavigationMenu: React.FC<LandingNavigationMenuProps> = ({ isOpen, onClose, onAnalyze, onBuild, onTrack, onResources }) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      className={`
        absolute top-full left-0 right-0 mt-3 p-4
        bg-white/90 dark:bg-navy-950/90 backdrop-blur-2xl
        border border-white/20 dark:border-white/10
        rounded-3xl shadow-2xl
        origin-top transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
      `}
    >
      <nav className="flex flex-col space-y-2">
        <button
          onClick={() => handleAction(onTrack)}
          className="flex items-center space-x-3 w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-navy-900 shadow-sm group-hover:scale-110 transition-transform">
             <BriefcaseIcon className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-semibold">Job Tracker</span>
        </button>

        <button
          onClick={() => handleAction(onBuild)}
          className="flex items-center space-x-3 w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-navy-900 shadow-sm group-hover:scale-110 transition-transform">
             <DocumentTextIcon className="w-5 h-5 text-purple-500" />
          </div>
          <span className="font-semibold">Resume Builder</span>
        </button>

        <button
          onClick={() => handleAction(onResources)}
          className="flex items-center space-x-3 w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-navy-900 shadow-sm group-hover:scale-110 transition-transform">
             <LightBulbIcon className="w-5 h-5 text-yellow-500" />
          </div>
          <span className="font-semibold">Resources</span>
        </button>

        <div className="h-px bg-gray-200 dark:bg-white/10 my-2" />

        <Button 
            onClick={() => handleAction(onAnalyze)} 
            className="w-full justify-center !rounded-xl !py-4 shadow-lg shadow-blue-500/25"
        >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Analyze My Resume
        </Button>
      </nav>
    </div>
  );
};

export default LandingNavigationMenu;