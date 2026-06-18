import React, { useState } from 'react';
import type { InterviewPrepResult } from '../types';
import Card from './common/Card';
import ChevronDownIcon from './icons/ChevronDownIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import Button from './common/Button';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface InterviewPrepDisplayProps {
  result: InterviewPrepResult;
  onStartLiveInterview: () => void;
}

const InterviewPrepDisplay: React.FC<InterviewPrepDisplayProps> = ({ result, onStartLiveInterview }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            <Card className="!p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 text-center mb-6 animate-fade-in">
                <h3 className="text-2xl font-bold font-display text-blue-900 dark:text-blue-200">Ready to Practice?</h3>
                <p className="text-blue-700 dark:text-blue-300 mt-2 mb-6 max-w-2xl mx-auto">Start a live mock interview session. The AI will ask you these questions, and you can practice your answers out loud using your microphone.</p>
                <Button onClick={onStartLiveInterview} size="lg">
                    <div className="flex items-center space-x-3">
                        <MicrophoneIcon className="w-6 h-6" />
                        <span className="text-lg">Start Mock Interview</span>
                    </div>
                </Button>
            </Card>

            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Review the potential interview questions and our tailored answer suggestions below.</p>
            {result.map((item, index) => (
                <Card key={index} className="overflow-hidden !p-0">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        aria-expanded={activeIndex === index}
                    >
                        <div className="flex items-start space-x-4">
                            <QuestionMarkCircleIcon className="w-7 h-7 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.question}</span>
                        </div>
                        <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-[1000px]' : 'max-h-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-6">
                           <div>
                                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Suggested Short Answer</h4>
                                <p className="text-gray-600 dark:text-gray-400 prose dark:prose-invert">{item.shortAnswer}</p>
                           </div>
                           <div>
                                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Suggested Detailed Answer</h4>
                                <p className="text-gray-600 dark:text-gray-400 prose dark:prose-invert">{item.detailedAnswer}</p>
                           </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default InterviewPrepDisplay;