import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </div>
      {label && <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">{label}</span>}
    </label>
  );
};

export default Switch;
