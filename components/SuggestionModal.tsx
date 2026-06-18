import React from 'react';
import Button from './common/Button';
import Spinner from './common/Spinner';
import XIcon from './icons/XIcon';
import LightBulbIcon from './icons/LightBulbIcon';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  onSelect: (suggestion: string) => void;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose,
  suggestions,
  isLoading,
  error,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">AI Suggestions</h2>
        
        {isLoading && (
          <div className="text-center py-12">
            <Spinner />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Generating ideas...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/40 p-3 rounded-md">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
                <div className="text-right mt-2">
                  <Button onClick={() => onSelect(suggestion)} size="sm" variant="secondary">
                    Use this suggestion
                  </Button>
                </div>
              </div>
            ))}
             {suggestions.length === 0 && (
                <p className="text-center py-12 text-gray-500 dark:text-gray-400">No suggestions were generated. Try providing more context in the field.</p>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionModal;