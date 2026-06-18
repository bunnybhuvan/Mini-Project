
import React from 'react';
import type { AnalysisResult } from '../types';
import Card from './common/Card';
import CheckCircleIcon from './icons/CheckCircleIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  onAddKeyword?: (keyword: string) => void;
}

const ScoreCircle: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className={color}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-display font-bold text-gray-800 dark:text-gray-200">{score}</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</p>
        </div>
    );
};

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, onAddKeyword }) => {
  return (
    <div className="space-y-8 mt-8">
      <Card>
        <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">Overall Summary</h2>
        <p className="text-gray-600 dark:text-gray-400">{result.summary}</p>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex justify-center">
          <ScoreCircle score={result.jobReadinessScore} label="Job Readiness" />
        </Card>
        <Card className="flex justify-center">
          <ScoreCircle score={result.atsScore} label="ATS Score" />
        </Card>
      </div>

      {onAddKeyword && result.missingKeywords && result.missingKeywords.length > 0 && (
        <Card>
            <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">Suggested Keywords</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Click a keyword to add it to your resume's skills section.</p>
            <div className="flex flex-wrap gap-3">
                {result.missingKeywords.map((keyword, index) => (
                    <button 
                        key={index} 
                        onClick={() => onAddKeyword(keyword)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                        aria-label={`Add keyword: ${keyword}`}
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform duration-200 group-hover:rotate-90" />
                        {keyword}
                    </button>
                ))}
            </div>
        </Card>
      )}
      
      <Card>
          <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">Actionable Suggestions</h2>
          <ul className="space-y-4">
              {result.suggestions.map((item, index) => (
                  <li key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <LightBulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.area}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{item.suggestion}</p>
                      </div>
                  </li>
              ))}
          </ul>
      </Card>

      <Card>
          <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">Recommended Job Roles</h2>
           <div className="flex flex-wrap gap-3">
              {result.jobRoles.map((role, index) => (
                  <span key={index} className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium rounded-full">
                      <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      {role}
                  </span>
              ))}
          </div>
      </Card>

      {result.suggestedTemplates && result.suggestedTemplates.length > 0 && (
        <Card>
            <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">Recommended Resume Templates</h2>
            <ul className="space-y-4">
                {result.suggestedTemplates.map((template, index) => (
                    <li key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <DocumentTextIcon className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{template.templateName}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{template.reasoning}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResultDisplay;