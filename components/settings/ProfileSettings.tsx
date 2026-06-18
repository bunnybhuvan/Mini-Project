import React, { useMemo } from 'react';
import type { AppSettings } from '../../types';
import SettingsCard from './SettingsCard';
import Input from '../common/Input';
import Switch from '../common/Switch';
import Button from '../common/Button';
import LogOutIcon from '../icons/LogOutIcon';
import UploadCloudIcon from '../icons/UploadCloudIcon';

interface ProfileSettingsProps {
  settings: AppSettings;
  onChange: (newSettings: Partial<AppSettings>) => void;
  onResetSection: (section: keyof AppSettings) => void;
}

const ProfileCompletion: React.FC<{ profile: AppSettings['profile'] }> = ({ profile }) => {
    const completion = useMemo(() => {
        const fields = ['name', 'email', 'role', 'bio', 'avatarUrl'];
        const filledCount = fields.filter(field => !!profile[field as keyof typeof profile]).length;
        return Math.round((filledCount / fields.length) * 100);
    }, [profile]);

    const progressColor = completion < 50 ? 'bg-red-500' : completion < 100 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Strength</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{completion}%</p>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${completion}%` }}></div>
            </div>
        </div>
    );
};

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ settings, onChange, onResetSection }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ profile: { ...settings.profile, [name]: value } });
  };
  
  const handleSecurityChange = (checked: boolean) => {
    onChange({ security: { ...settings.security, twoFactorEnabled: checked } });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            onChange({ profile: { ...settings.profile, avatarUrl: event.target?.result as string }});
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div className="space-y-6">
        <SettingsCard title="Edit Profile" description="Keep your personal details up to date." onReset={() => onResetSection('profile')}>
            <div className="space-y-4">
                <ProfileCompletion profile={settings.profile} />
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                        {settings.profile.avatarUrl && <img src={settings.profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />}
                    </div>
                    <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        <UploadCloudIcon className="w-5 h-5 mr-2 inline" />
                        Upload Profile Picture
                    </label>
                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <Input name="name" value={settings.profile.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <Input name="email" type="email" value={settings.profile.email} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Role</label>
                    <Input name="role" value={settings.profile.role} onChange={handleChange} placeholder="e.g. Senior Software Engineer" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                    <textarea name="bio" value={settings.profile.bio} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500" placeholder="A short bio about yourself..."></textarea>
                </div>
            </div>
        </SettingsCard>
        
        <SettingsCard title="Resume Versions" description="Manage different versions of your resume for specific job applications.">
            {/* This is a placeholder UI for a more complex feature */}
            <div className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Default Resume</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: 2 days ago</span>
            </div>
        </SettingsCard>
        
        <SettingsCard title="Security" description="Manage your password and session history." onReset={() => onResetSection('security')}>
            <div className="space-y-4">
                <Button variant="secondary">Change Password</Button>
                <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Enable Two-Factor Authentication</p>
                    <Switch checked={settings.security.twoFactorEnabled} onChange={handleSecurityChange} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Active Sessions</h4>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center text-sm">
                            <p>Chrome on macOS - <span className="text-green-600 dark:text-green-400">Current Session</span></p>
                            <Button size="sm" variant="secondary">Log Out</Button>
                        </li>
                         <li className="flex justify-between items-center text-sm">
                            <p className="text-gray-600 dark:text-gray-400">Safari on iPhone - 3 hours ago</p>
                            <Button size="sm" variant="secondary" className="text-red-500"><LogOutIcon className="w-4 h-4" /></Button>
                        </li>
                    </ul>
                </div>
            </div>
        </SettingsCard>
    </div>
  );
};

export default ProfileSettings;