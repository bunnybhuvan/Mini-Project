import React from 'react';
import type { AppSettings } from '../../types';
import SettingsCard from './SettingsCard';
import Select from '../common/Select';
import Switch from '../common/Switch';
import GlobeIcon from '../icons/GlobeIcon';
import CopyIcon from '../icons/CopyIcon';
import Button from '../common/Button';

interface AdvancedSettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: 'advanced') => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ settings, onChange, onResetSection }) => {
  const handleSwitchChange = (field: keyof AppSettings['advanced']) => (checked: boolean) => {
    onChange({ advanced: { ...settings.advanced, [field]: checked } });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ advanced: { ...settings.advanced, language: e.target.value } });
  };

  const languageOptions = [
      { value: 'en-US', label: 'English (United States)' },
      { value: 'en-GB', label: 'English (United Kingdom)' },
      { value: 'es-ES', label: 'Español (España)' },
      { value: 'fr-FR', label: 'Français (France)' },
      { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Language & Region" icon={<GlobeIcon />} description="Choose your preferred language for the application." onReset={() => onResetSection('advanced')}>
        <Select
          value={settings.advanced.language}
          onChange={handleSelectChange}
          options={languageOptions}
        />
      </SettingsCard>

      <SettingsCard title="Beta Features" description="Try out new features before they're released to everyone." onReset={() => onResetSection('advanced')}>
        <Switch
          checked={settings.advanced.enableBetaFeatures}
          onChange={handleSwitchChange('enableBetaFeatures')}
          label="Enable experimental AI tools"
        />
      </SettingsCard>
      
      <SettingsCard title="A/B Testing" description="Help us improve Resumetrix by participating in A/B tests." onReset={() => onResetSection('advanced')}>
        <Switch
          checked={settings.advanced.participateABTesting}
          onChange={handleSwitchChange('participateABTesting')}
          label="Allow participation in product experiments"
        />
      </SettingsCard>
      
      <SettingsCard title="Developer API Keys" description="For Pro users to integrate Resumetrix with other tools.">
        <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">prod_sk_••••••••••••••••••••1234</span>
            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText('prod_sk_xxxxxxxxxxxxxx')}>
                <CopyIcon className="w-4 h-4 mr-2" /> Copy
            </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Never share your API key publicly.</p>
      </SettingsCard>
    </div>
  );
};

export default AdvancedSettings;