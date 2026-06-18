import React from 'react';
import type { AppSettings } from '../../types';
import SettingsCard from './SettingsCard';
import Switch from '../common/Switch';
import LinkedInIcon from '../icons/LinkedInIcon';
import GitHubIcon from '../icons/GitHubIcon';
import GoogleIcon from '../icons/GoogleIcon';
import Button from '../common/Button';

interface IntegrationsSettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: 'integrations') => void;
}

interface IntegrationRowProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  isConnected: boolean;
  onToggle: (connected: boolean) => void;
}

const IntegrationRow: React.FC<IntegrationRowProps> = ({
  icon,
  name,
  description,
  isConnected,
  onToggle,
}) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <h4 className="font-bold text-gray-800 dark:text-gray-200">
          {name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>

    <Switch checked={isConnected} onChange={onToggle} />
  </div>
);

const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({
  settings,
  onChange,
  onResetSection,
}) => {
  const handleToggle =
    (field: keyof AppSettings['integrations']) =>
    (checked: boolean) => {
      onChange({
        integrations: {
          ...settings.integrations,
          [field]: checked,
        },
      });
    };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Connect Your Accounts"
        description="Sync your data from other platforms to enhance your experience."
        onReset={() => onResetSection('integrations')}
      >
        <div className="space-y-4">
          <IntegrationRow
            icon={<LinkedInIcon className="w-8 h-8" />}
            name="LinkedIn"
            description="Sync your profile to easily import your resume."
            isConnected={settings.integrations.linkedIn}
            onToggle={handleToggle('linkedIn')}
          />

          <IntegrationRow
            icon={
              <GitHubIcon className="w-8 h-8 text-black dark:text-white" />
            }
            name="GitHub"
            description="Automatically pull your repositories for your projects section."
            isConnected={settings.integrations.github}
            onToggle={handleToggle('github')}
          />

          <IntegrationRow
            icon={<GoogleIcon className="w-8 h-8" />}
            name="Google Drive"
            description="Import and back up your resumes seamlessly."
            isConnected={settings.integrations.googleDrive}
            onToggle={handleToggle('googleDrive')}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Resume Data"
        description="Manage resume data across platforms."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            Import from LinkedIn
          </Button>

          <Button variant="secondary">
            Export to LinkedIn
          </Button>

          <Button variant="secondary">
            Export for Job Boards
          </Button>
        </div>
      </SettingsCard>
    </div>
  );
};

export default IntegrationsSettings;