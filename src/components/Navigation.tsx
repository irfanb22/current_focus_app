import React from 'react';
import { Clock, Play, Settings, BarChart3 } from 'lucide-react';
import { TabType } from '../App';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasActiveTimer: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, hasActiveTimer }) => {
  const tabs = [
    {
      id: 'sessions' as TabType,
      label: 'My Sessions',
      icon: BarChart3,
    },
    {
      id: 'start' as TabType,
      label: 'Start',
      icon: Play,
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-background-alt">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isStartTab = tab.id === 'start';
          const showTimerIndicator = isStartTab && hasActiveTimer;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-2 px-4 transition-colors duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-text-primary'
              }`}
            >
              <div className="relative">
                <Icon size={24} className="mb-1" />
                {showTimerIndicator && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;