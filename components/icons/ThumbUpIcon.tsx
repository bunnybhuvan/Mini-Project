
import React from 'react';

const ThumbUpIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.993 0-1.91-.406-2.583-1.116l-3.5-4.5A2 2 0 014.5 13V5a2 2 0 012-2h2.5" />
    </svg>
);

export default ThumbUpIcon;
