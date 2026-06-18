import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        relative overflow-hidden group
        bg-white/60 dark:bg-[rgba(255,255,255,0.12)]
        backdrop-blur-xl 
        border border-white/50 dark:border-[rgba(255,255,255,0.25)]
        rounded-2xl 
        shadow-lg shadow-gray-200/50 dark:shadow-none 
        
        /* Blue Light Hover Animation */
        hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] 
        dark:hover:shadow-[0_0_40px_rgba(52,120,255,0.5)]
        hover:border-blue-400/50 dark:hover:border-blue-300/50
        
        transition-all duration-500 ease-out
        ${className}
      `}
    >
      {/* Inner white border glow effect on hover */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/0 group-hover:border-blue-400/20 dark:group-hover:border-blue-300/30 transition-colors duration-500"></div>
      
      {/* Subtle shine gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-blue-100/20 dark:via-blue-500/10 to-transparent"></div>

      <div className="p-6 md:p-8 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;