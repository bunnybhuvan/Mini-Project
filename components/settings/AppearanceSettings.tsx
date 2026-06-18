import React, { useEffect } from 'react';
import type { AppSettings, ColorTheme, FontTheme } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import SettingsCard from './SettingsCard';
import Select from '../common/Select';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

interface AppearanceSettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: 'appearance') => void;
}

const colorOptions: { name: ColorTheme, bgClass: string }[] = [
    { name: 'blue', bgClass: 'bg-blue-500' },
    { name: 'purple', bgClass: 'bg-violet-500' },
    { name: 'green', bgClass: 'bg-green-500' },
];

const fontOptions = [
    { value: 'inter', label: 'Inter (Default)' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'montserrat', label: 'Montserrat' },
];

const AnimatedThemeToggle: React.FC<{ isDark: boolean, onToggle: () => void }> = ({ isDark, onToggle }) => {
    return (
        <label htmlFor="theme-toggle" className="relative w-20 h-10 cursor-pointer">
            <input id="theme-toggle" type="checkbox" className="sr-only peer" checked={isDark} onChange={onToggle} />
            <div className="w-full h-full bg-blue-300 peer-checked:bg-gray-800 rounded-full transition-colors"></div>
            <div className="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full shadow-lg peer-checked:translate-x-10 peer-checked:bg-gray-200 transition-transform duration-500"
                 style={{ perspective: '300px' }}>
                <div className={`w-full h-full transition-transform duration-500 ${isDark ? 'rotateY-180' : 'rotateY-0'}`} style={{ transformStyle: 'preserve-3d' }}>
                    <div className="absolute w-full h-full flex items-center justify-center backface-hidden" style={{ backfaceVisibility: 'hidden'}}>
                        <SunIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute w-full h-full flex items-center justify-center rotateY-180 backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <MoonIcon className="w-5 h-5 text-blue-900" />
                    </div>
                </div>
            </div>
            <style>{`
                .rotateY-180 { transform: rotateY(180deg); }
                .rotateY-0 { transform: rotateY(0deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </label>
    );
};


const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ settings, onChange, onResetSection }) => {
  const { theme, toggleTheme } = useTheme();

  // useEffect to apply live previews for theme and font changes.
  // This ensures that any change to the appearance settings is reflected
  // instantly in the UI, without waiting for a save action.
  useEffect(() => {
    const root = document.documentElement;

    // Apply color theme for live preview
    const colorTheme = settings.appearance.colorTheme;
    ['theme-blue', 'theme-purple', 'theme-green'].forEach(c => root.classList.remove(c));
    root.classList.add(`theme-${colorTheme}`);
    
    // Apply font theme for live preview
    const fontTheme = settings.appearance.fontTheme;
    ['font-inter', 'font-poppins', 'font-roboto', 'font-montserrat'].forEach(f => root.classList.remove(f));
    root.classList.add(`font-${fontTheme}`);

  }, [settings.appearance.colorTheme, settings.appearance.fontTheme]);

  const handleColorChange = (color: ColorTheme) => {
    onChange({ appearance: { ...settings.appearance, colorTheme: color } });
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value as FontTheme;
    onChange({ appearance: { ...settings.appearance, fontTheme: font } });
  };


  return (
    <div className="space-y-6">
      <SettingsCard title="Dark/Light Mode" description="Switch between dark and light themes.">
        <div className="flex items-center gap-4">
            <AnimatedThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />
            <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{theme} Mode</span>
        </div>
      </SettingsCard>

      <SettingsCard title="Theme Colors" description="Personalize the primary color scheme of the application." onReset={() => onResetSection('appearance')}>
        <div className="flex gap-4">
            {colorOptions.map(color => (
                <button
                    key={color.name}
                    onClick={() => handleColorChange(color.name)}
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${color.bgClass} ${settings.appearance.colorTheme === color.name ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-500 scale-110' : 'hover:scale-105'}`}
                    aria-label={`Select ${color.name} theme`}
                />
            ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Font Styles" description="Choose the typography for the entire application." onReset={() => onResetSection('appearance')}>
        <Select
            value={settings.appearance.fontTheme}
            onChange={handleFontChange}
            options={fontOptions}
            containerClassName="max-w-xs"
        />
      </SettingsCard>
    </div>
  );
};

export default AppearanceSettings;