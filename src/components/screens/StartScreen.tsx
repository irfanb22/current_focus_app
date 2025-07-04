import React from 'react';
import TimerScreen from './TimerScreen';
import { TimerState } from '../../App';

interface StartScreenProps {
  timerState: TimerState;
  onStartTimer: (minutes: number) => void;
  onUpdateTimer: (updates: Partial<TimerState>) => void;
  onEndTimer: () => void;
  userIntention: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  timerState, 
  onStartTimer, 
  onUpdateTimer, 
  onEndTimer,
  userIntention
}) => {
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
    
    onStartTimer(minutes);
  };

  // Show timer screen if timer is active
  if (timerState.isActive) {
    return (
      <TimerScreen 
        timerState={timerState}
        onUpdateTimer={onUpdateTimer}
        onEndTimer={onEndTimer}
        userIntention={userIntention}
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
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Show intention if set */}
          {userIntention && (
            <div className="mb-8 text-center">
              <p className="text-gray-500 text-sm mb-2">Current focus:</p>
              <p className="text-lg text-text-primary font-medium italic">
                "{userIntention}"
              </p>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-text-primary mb-12 text-center">
            Ready to Focus
          </h1>
          
          <div className="w-full max-w-sm space-y-4">
            {timerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTimerSelect(option.value)}
                className={`w-full py-4 px-6 text-lg font-medium rounded-lg border-2 transition-all duration-200 ${
                  option.isOutlined
                    ? 'bg-background text-text-primary border-primary hover:bg-primary hover:text-white'
                    : 'bg-background text-text-primary border-background-alt hover:bg-background-alt'
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