import React from 'react';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({ options, containerClassName = '', ...props }) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <select
        className="w-full appearance-none py-3 pl-4 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-blue-400 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <ChevronDownIcon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default Select;
