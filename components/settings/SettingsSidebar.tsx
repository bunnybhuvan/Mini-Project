import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import UserCircleIcon from '../icons/UserCircleIcon';
import PaletteIcon from '../icons/PaletteIcon';
import BellIcon from '../icons/BellIcon';
import BotIcon from '../icons/BotIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LinkIcon from '../icons/LinkIcon';
import HelpCircleIcon from '../icons/HelpCircleIcon';
import SlidersIcon from '../icons/SlidersIcon';
import SearchIcon from '../icons/SearchIcon';
import Input from '../common/Input';

interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'profile', label: 'Account & Profile', icon: <UserCircleIcon className="w-5 h-5" /> },
  { id: 'appearance', label: 'Appearance & Themes', icon: <PaletteIcon className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications & Alerts', icon: <BellIcon className="w-5 h-5" /> },
  { id: 'rexa', label: 'AI Assistant (Rexa)', icon: <BotIcon className="w-5 h-5" /> },
  { id: 'privacy', label: 'Privacy & Data', icon: <ShieldCheckIcon className="w-5 h-5" /> },
  { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-5 h-5" /> },
  { id: 'support', label: 'Support & Feedback', icon: <HelpCircleIcon className="w-5 h-5" /> },
  { id: 'advanced', label: 'Advanced', icon: <SlidersIcon className="w-5 h-5" /> },
];

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, setActiveSection }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm) return navItems;
        return navItems.filter(item =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <Card className="sticky top-24">
            <div className="mb-4">
                <Input 
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<SearchIcon className="w-5 h-5 text-gray-400"/>}
                />
            </div>
            <nav>
                <ul>
                    {filteredItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left flex items-center gap-3 p-3 rounded-md transition-colors text-sm font-medium ${
                                    activeSection === item.id
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                    {filteredItems.length === 0 && (
                        <p className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">No settings found.</p>
                    )}
                </ul>
            </nav>
        </Card>
    );
};

export default SettingsSidebar;