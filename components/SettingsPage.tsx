import React, { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types';
import SettingsSidebar from './settings/SettingsSidebar';
import ProfileSettings from './settings/ProfileSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import NotificationsSettings from './settings/NotificationsSettings';
import AssistantSettings from './settings/AssistantSettings';
import PrivacySettings from './settings/PrivacySettings';
import IntegrationsSettings from './settings/IntegrationsSettings';
import SupportSettings from './settings/SupportSettings';
import AdvancedSettings from './settings/AdvancedSettings';
import Button from './common/Button';
import SettingsIcon from './icons/SettingsIcon';
import Toast from './common/Toast';
import SparklesIcon from './icons/SparklesIcon';
import MenuIcon from './icons/MenuIcon';
import NavigationMenu from './NavigationMenu';
import type { Module } from './Dashboard';
import ThemeToggle from './ThemeToggle';

export const defaultSettings: AppSettings = {
  profile: { name: '', email: '', role: '', bio: '', avatarUrl: '' },
  security: { twoFactorEnabled: false },
  appearance: { colorTheme: 'blue', fontTheme: 'inter' },
  notifications: { jobAlerts: 'daily', interviewReminders: true, feedbackAlerts: true, pushNotifications: false },
  rexa: { personality: 'professional', knowledgeSource: 'resume-jobs' },
  privacy: { allowResumeStorage: true, allowLogStorage: false },
  integrations: { linkedIn: false, github: false, kaggle: false, googleDrive: false },
  advanced: { language: 'en-US', enableBetaFeatures: false, participateABTesting: true },
};

interface SettingsPageProps {
  onBack: () => void;
  onNavigate: (module: Module) => void;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onNavigate, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Deep merge to handle nested objects and ensure all default keys are present
        const mergedSettings = {
            ...defaultSettings,
            ...parsed,
            profile: { ...defaultSettings.profile, ...parsed.profile },
            security: { ...defaultSettings.security, ...parsed.security },
            appearance: { ...defaultSettings.appearance, ...parsed.appearance },
            notifications: { ...defaultSettings.notifications, ...parsed.notifications },
            rexa: { ...defaultSettings.rexa, ...parsed.rexa },
            privacy: { ...defaultSettings.privacy, ...parsed.privacy },
            integrations: { ...defaultSettings.integrations, ...parsed.integrations },
            advanced: { ...defaultSettings.advanced, ...parsed.advanced },
        };
        setSettings(mergedSettings);
        setInitialSettings(mergedSettings);
      } else {
        setInitialSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      setInitialSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(initialSettings));
  }, [settings, initialSettings]);

  const handleSettingsChange = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const handleResetSection = useCallback((section: keyof AppSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: defaultSettings[section],
    }));
  }, []);

  const handleSave = () => {
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setInitialSettings(settings);
        setShowToast(true);
    } catch (error) {
        console.error("Failed to save settings:", error);
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
     // Revert live preview changes for appearance
    const root = document.documentElement;
    ['theme-blue', 'theme-purple', 'theme-green'].forEach(c => root.classList.remove(c));
    root.classList.add(`theme-${initialSettings.appearance.colorTheme}`);

    ['font-inter', 'font-poppins', 'font-roboto', 'font-montserrat'].forEach(f => root.classList.remove(f));
    root.classList.add(`font-${initialSettings.appearance.fontTheme}`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      case 'appearance': return <AppearanceSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      case 'notifications': return <NotificationsSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      case 'rexa': return <AssistantSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      case 'privacy': return <PrivacySettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      case 'integrations': return <IntegrationsSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      case 'support': return <SupportSettings />;
      case 'advanced': return <AdvancedSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
      default: return <ProfileSettings settings={settings} onChange={handleSettingsChange} onResetSection={handleResetSection} />;
    }
  };

  return (
    <div className="min-h-screen">
        <NavigationMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={onNavigate} 
            onLogout={onLogout} 
            activeModule="settings"
        />

         <header className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg shadow-sm border-b border-white/20 dark:border-white/10 sticky top-0 z-20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                   <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-200">Resumetrix</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <Button onClick={onBack} className="!bg-white/30 dark:!bg-white/10 backdrop-blur-md hover:!bg-white/50 dark:hover:!bg-white/20 border-white/20" variant="secondary">Back to Dashboard</Button>
                    </div>
                    <ThemeToggle />
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-gray-700/50" aria-label="Open navigation menu">
                       <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your account, preferences, and AI assistant.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 items-start">
                <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <div className="lg:col-span-3">
                    <div className="animate-settings-fade-in">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </main>
        
        <footer className={`sticky bottom-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl p-4 border-t border-white/20 dark:border-white/10 transition-transform duration-300 ${hasChanges ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="container mx-auto flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">You have unsaved changes.</p>
                <div className="flex gap-3">
                    <Button onClick={handleCancel} variant="secondary" className="!bg-white/50 dark:!bg-white/10">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </footer>

        <Toast message="Settings updated successfully." show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default SettingsPage;