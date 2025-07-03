import React, { useState } from 'react';
import TimerScreen from './TimerScreen';

const StartScreen: React.FC = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  const handleTimerSelect = (duration: string) => {
    let minutes: number;
    
    switch (duration) {
      case '5 minutes':
        minutes = 5;
        break;
      case '30 minutes':
        minutes = 30;
        break;
      case '60 minutes':
        minutes = 60;
        break;
      case '90 minutes':
        minutes = 90;
        break;
      case 'Just Start':
        minutes = 25; // Default to 25 minutes for "Just Start"
        break;
      default:
        minutes = 25;
    }
    
    setSelectedMinutes(minutes);
    setShowTimer(true);
  };

  const handleQuitTimer = () => {
    setShowTimer(false);
    setSelectedMinutes(0);
  };

  // Show timer screen if timer is active
  if (showTimer) {
    return (
      <TimerScreen 
        initialMinutes={selectedMinutes}
        onQuit={handleQuitTimer}
      />
    );
  }

  const timerOptions = [
    { label: '5 minutes', value: '5 minutes' },
    { label: '30 minutes', value: '30 minutes' },
    { label: '60 minutes', value: '60 minutes' },
    { label: '90 minutes', value: '90 minutes' },
    { label: 'Just Start', value: 'Just Start', isOutlined: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <h1 className="text-3xl font-bold text-black mb-12 text-center">
            Ready to Focus
          </h1>
          
          <div className="w-full max-w-sm space-y-4">
            {timerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTimerSelect(option.value)}
                className={`w-full py-4 px-6 text-lg font-medium rounded-lg border-2 transition-all duration-200 ${
                  option.isOutlined
                    ? 'bg-white text-black border-black hover:bg-black hover:text-white'
                    : 'bg-white text-black border-black hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;