import React from 'react';
import type { AppSettings, RexaPersonality, RexaKnowledgeSource } from '../../types';
import SettingsCard from './SettingsCard';
import Select from '../common/Select';
import Button from '../common/Button';
import TrashIcon from '../icons/TrashIcon';
import DownloadIcon from '../icons/DownloadIcon';

interface AssistantSettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: 'rexa') => void;
}

const personalityOptions: { value: RexaPersonality, label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly & Encouraging' },
    { value: 'faang-interviewer', label: 'FAANG Interviewer (Direct & Technical)' },
];

const knowledgeOptions: { value: RexaKnowledgeSource, label: string }[] = [
    { value: 'resume-only', label: 'Use my current resume draft only' },
    { value: 'resume-jobs', label: 'Use my resume and tracked job applications' },
    { value: 'web-search', label: 'Use my data and perform web searches (Most powerful)' },
];


const AssistantSettings: React.FC<AssistantSettingsProps> = ({ settings, onChange, onResetSection }) => {
  const handleSelectChange = (field: 'personality' | 'knowledgeSource') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ rexa: { ...settings.rexa, [field]: e.target.value } });
  };
  
  return (
    <div className="space-y-6">
      <SettingsCard title="Personality Modes" description="Set the tone for how Rexa interacts with you." onReset={() => onResetSection('rexa')}>
        <Select
            value={settings.rexa.personality}
            onChange={handleSelectChange('personality')}
            options={personalityOptions}
            containerClassName="max-w-sm"
        />
      </SettingsCard>

      <SettingsCard title="Knowledge Sources" description="Control what information Rexa can access to give you better answers." onReset={() => onResetSection('rexa')}>
        <Select
            value={settings.rexa.knowledgeSource}
            onChange={handleSelectChange('knowledgeSource')}
            options={knowledgeOptions}
        />
      </SettingsCard>
      
      <SettingsCard title="Query History" description="Manage your conversation history with the AI assistant.">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">
                <TrashIcon className="w-5 h-5 mr-2" />
                Clear Conversation History
            </Button>
            <Button variant="secondary">
                <DownloadIcon className="w-5 h-5 mr-2" />
                Export Conversation Logs
            </Button>
          </div>
      </SettingsCard>
    </div>
  );
};

export default AssistantSettings;