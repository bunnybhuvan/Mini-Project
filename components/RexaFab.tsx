import React from 'react';
import BotIcon from './icons/BotIcon';

interface RexaFabProps {
  onClick: () => void;
}

const RexaFab: React.FC<RexaFabProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-110"
      aria-label="Open AI Assistant"
    >
      <div className="flex flex-col items-center">
        <BotIcon className="w-8 h-8" />
        <span className="text-xs font-bold tracking-wider">REXA</span>
      </div>
    </button>
  );
};

export default RexaFab;