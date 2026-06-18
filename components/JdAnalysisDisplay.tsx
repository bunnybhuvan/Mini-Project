
import React from 'react';
import type { JdAnalysisResult } from '../types';
import Card from './common/Card';
import BriefcaseIcon from './icons/BriefcaseIcon';
import GlobeIcon from './icons/GlobeIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface JdAnalysisDisplayProps {
    result: JdAnalysisResult;
}

const TagGroup: React.FC<{ title: string; tags: string[]; color: string }> = ({ title, tags, color }) => {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                    <span 
                        key={idx} 
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${color} bg-opacity-10 backdrop-blur-sm`}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

const JdAnalysisDisplay: React.FC<JdAnalysisDisplayProps> = ({ result }) => {
    return (
        <Card className="animate-fade-in border-blue-200 dark:border-blue-900 shadow-blue-500/10">
            <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100 flex items-center gap-2">
                         <BriefcaseIcon className="w-6 h-6 text-blue-500" />
                         {result.job_title || "Job Analysis"}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {result.role_type && (
                            <span className="flex items-center gap-1">
                                <UserCircleIcon className="w-4 h-4" /> {result.role_type}
                            </span>
                        )}
                        {result.location_type && (
                            <span className="flex items-center gap-1">
                                <GlobeIcon className="w-4 h-4" /> {result.location_type}
                            </span>
                        )}
                        {result.seniority && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium border border-gray-200 dark:border-gray-600">
                                {result.seniority}
                            </span>
                        )}
                    </div>
                </div>
                <div className="hidden sm:block">
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        JD Processed
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <TagGroup 
                    title="Must Have Skills" 
                    tags={result.must_have_keywords} 
                    color="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50" 
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                    <TagGroup 
                        title="Technical Skills" 
                        tags={result.hard_skills} 
                        color="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50" 
                    />
                    <TagGroup 
                        title="Tools & Tech" 
                        tags={result.tools_technologies} 
                        color="bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-900/50" 
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <TagGroup 
                        title="Soft Skills" 
                        tags={result.soft_skills} 
                        color="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50" 
                    />
                     <TagGroup 
                        title="Nice to Have" 
                        tags={result.nice_to_have_keywords} 
                        color="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900/50" 
                    />
                </div>
            </div>
        </Card>
    );
};

export default JdAnalysisDisplay;
