import React from 'react';
import SettingsCard from './SettingsCard';
import Button from '../common/Button';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';

const SupportSettings: React.FC = () => {

    const supportLinks = [
        { name: 'FAQs', href: '#' },
        { name: 'User Guides', href: '#' },
        { name: 'Tutorials', href: '#' },
    ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Help Center" description="Find answers to common questions and learn how to use Resumetrix.">
        <div className="divide-y dark:divide-gray-700">
            {supportLinks.map(link => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{link.name}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </a>
            ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Contact Support" description="Can't find what you're looking for? Reach out to our team.">
         <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Open Chat Support</Button>
            <Button variant="secondary">Submit an Email Ticket</Button>
         </div>
      </SettingsCard>
      
      <SettingsCard title="Give Feedback" description="Help us build a better product for you.">
         <div className="flex flex-wrap gap-3">
            <Button>
                Rate Us
            </Button>
             <Button>
                Suggest a Feature
            </Button>
         </div>
      </SettingsCard>
    </div>
  );
};

export default SupportSettings;
