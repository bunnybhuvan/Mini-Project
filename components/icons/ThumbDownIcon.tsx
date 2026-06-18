
import React from 'react';

const ThumbDownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.993 0 1.91.406 2.583 1.116l3.5 4.5A2 2 0 0118.5 11v8a2 2 0 01-2 2h-2.5" />
    </svg>
);

export default ThumbDownIcon;
