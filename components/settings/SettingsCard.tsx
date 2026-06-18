import React from 'react';
// FIX: Import the Card component to resolve the "Cannot find name 'Card'" error.
import Card from '../common/Card';
import Button from '../common/Button';
import RefreshIcon from '../icons/RefreshIcon';
import ExclamationCircleIcon from '../icons/ExclamationCircleIcon';

interface SettingsCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onReset?: () => void;
  children: React.ReactNode;
  isDangerZone?: boolean;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, onReset, children, isDangerZone = false }) => {
  const borderClass = isDangerZone ? 'border-red-500 dark:border-red-700' : 'dark:border-gray-700';
  const titleClass = isDangerZone ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-gray-100';

  return (
    <Card className={`!p-0 border ${borderClass}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                {isDangerZone && <ExclamationCircleIcon className={`w-6 h-6 ${titleClass}`} />}
                {icon}
                <div>
                    <h3 className={`text-xl font-bold font-display ${titleClass}`}>{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                </div>
            </div>
          {onReset && (
            <Button onClick={onReset} variant="secondary" size="sm">
              <RefreshIcon className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          )}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-t dark:border-gray-700 rounded-b-xl">
        {children}
      </div>
    </Card>
  );
};

export default SettingsCard;