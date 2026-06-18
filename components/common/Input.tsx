import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ icon, containerClassName = '', ...props }) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          {icon}
        </span>
      )}
      <input
        className={`w-full py-3 pr-4 
        bg-white/70 dark:bg-white/5 
        backdrop-blur-md 
        border border-gray-300/50 dark:border-white/10 
        hover:border-blue-400 dark:hover:border-electric-500/50 
        rounded-xl 
        text-gray-900 dark:text-gray-100 
        placeholder-gray-500 dark:placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-electric-500 
        transition-all duration-300 
        shadow-sm dark:shadow-inner
        ${icon ? 'pl-10' : 'pl-4'}`}
        {...props}
      />
    </div>
  );
};

export default Input;