import React, { useState } from 'react';

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [defaultTimer, setDefaultTimer] = useState('25');

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onToggle: () => void;
  }> = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-primary' : 'bg-background-alt'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const timerOptions = [
    { value: '5', label: '5 minutes' },
    { value: '25', label: '25 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Appearance Setting */}
          <div className="flex items-center justify-between py-4 border-b border-background-alt">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-text-primary mb-1">
                Appearance
              </h3>
              <p className="text-sm text-gray-500">
                {darkMode ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
            <ToggleSwitch
              enabled={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
          </div>

          {/* Default Timer Setting */}
          <div className="py-4 border-b border-background-alt">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  Default Timer
                </h3>
                <p className="text-sm text-gray-500">
                  Default duration for "Just Start"
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {timerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDefaultTimer(option.value)}
                  className={`py-3 px-4 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                    defaultTimer === option.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-text-primary border-background-alt hover:border-primary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Setting */}
          <div className="flex items-center justify-between py-4 border-b border-background-alt">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-text-primary mb-1">
                Sound
              </h3>
              <p className="text-sm text-gray-500">
                {soundEnabled ? 'Notifications enabled' : 'Notifications disabled'}
              </p>
            </div>
            <ToggleSwitch
              enabled={soundEnabled}
              onToggle={() => setSoundEnabled(!soundEnabled)}
            />
          </div>
        </div>

        {/* App Info */}
        <div className="mt-12 pt-8 border-t border-background-alt">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Current</h2>
            <p className="text-sm text-gray-500 mb-1">A zen focus timer</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;