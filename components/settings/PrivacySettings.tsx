import React from 'react';
import type { AppSettings } from '../../types';
import SettingsCard from './SettingsCard';
import Switch from '../common/Switch';
import Button from '../common/Button';
import DownloadIcon from '../icons/DownloadIcon';
import TrashIcon from '../icons/TrashIcon';

interface PrivacySettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: 'privacy') => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ settings, onChange, onResetSection }) => {
  const handleToggle = (field: keyof AppSettings['privacy']) => (checked: boolean) => {
    onChange({ privacy: { ...settings.privacy, [field]: checked } });
  };
  
  const handleDeleteAccount = () => {
      if (window.confirm('Are you absolutely sure? This action cannot be undone and will permanently delete all your data.')) {
          alert('Account deletion initiated. (This is a demo)');
      }
  }

  return (
    <div className="space-y-6">
      <SettingsCard title="Data Permissions" description="Control how we use your data to improve our services." onReset={() => onResetSection('privacy')}>
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Allow AI to store resumes for model training</p>
                <Switch checked={settings.privacy.allowResumeStorage} onChange={handleToggle('allowResumeStorage')} />
            </div>
            <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Allow AI to store query logs for analysis</p>
                <Switch checked={settings.privacy.allowLogStorage} onChange={handleToggle('allowLogStorage')} />
            </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Export Data" description="Download a copy of your data in a machine-readable format.">
         <Button variant="secondary">
            <DownloadIcon className="w-5 h-5 mr-2" />
            Export Resumes, Job Logs, and Interview History
         </Button>
      </SettingsCard>
      
      <SettingsCard title="Delete Account" description="Permanently delete your account and all associated data." isDangerZone>
         <p className="text-sm text-red-600 dark:text-red-400 mb-4">This action is irreversible. All your resumes, job applications, and settings will be permanently erased.</p>
         <Button className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500" onClick={handleDeleteAccount}>
            <TrashIcon className="w-5 h-5 mr-2" />
            Delete My Account
         </Button>
      </SettingsCard>
    </div>
  );
};

export default PrivacySettings;