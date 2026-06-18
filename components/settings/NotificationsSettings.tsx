import React from 'react';
import type { AppSettings } from '../../types';
import SettingsCard from './SettingsCard';
import Select from '../common/Select';
import Switch from '../common/Switch';

interface NotificationsSettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: 'notifications') => void;
}

const jobAlertOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'off', label: 'Off' },
];

const NotificationRow: React.FC<{
    title: string;
    description: string;
    checked: boolean;
    onToggle: (checked: boolean) => void;
}> = ({ title, description, checked, onToggle }) => (
     <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
        <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <Switch checked={checked} onChange={onToggle} />
    </div>
);


const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({ settings, onChange, onResetSection }) => {
  const handleSwitchChange = (field: keyof AppSettings['notifications']) => (checked: boolean) => {
    onChange({ notifications: { ...settings.notifications, [field]: checked } });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ notifications: { ...settings.notifications, jobAlerts: e.target.value as AppSettings['notifications']['jobAlerts'] } });
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Email Notifications" description="Manage the emails you receive from us." onReset={() => onResetSection('notifications')}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Alerts Frequency</label>
        <Select
          value={settings.notifications.jobAlerts}
          onChange={handleSelectChange}
          options={jobAlertOptions}
          containerClassName="max-w-xs"
        />
      </SettingsCard>

      <SettingsCard title="App Alerts" description="Enable or disable alerts within the application." onReset={() => onResetSection('notifications')}>
          <div className="space-y-4">
            <NotificationRow
                title="Interview Reminders"
                description="Get a notification for upcoming interviews."
                checked={settings.notifications.interviewReminders}
                onToggle={handleSwitchChange('interviewReminders')}
            />
            <NotificationRow
                title="Resume Feedback Alerts"
                description="Notify me when AI analysis is complete."
                checked={settings.notifications.feedbackAlerts}
                onToggle={handleSwitchChange('feedbackAlerts')}
            />
          </div>
      </SettingsCard>
      
      <SettingsCard title="Push Notifications" description="Receive notifications directly on your browser or mobile device." onReset={() => onResetSection('notifications')}>
        <NotificationRow
            title="Enable Push Notifications"
            description="Get real-time updates for important events."
            checked={settings.notifications.pushNotifications}
            onToggle={handleSwitchChange('pushNotifications')}
        />
      </SettingsCard>
    </div>
  );
};

export default NotificationsSettings;