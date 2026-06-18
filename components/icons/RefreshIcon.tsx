import React from 'react';

const RefreshIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4a14.22 14.22 0 0115.13 11.26M20 20a14.23 14.23 0 01-15.13-11.26" />
    </svg>
);

export default RefreshIcon;