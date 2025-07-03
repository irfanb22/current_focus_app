import React from 'react';
import CompletionScreen from './CompletionScreen';
import { TimerState } from '../../App';

interface TimerScreenProps {
  timerState: TimerState;
  onUpdateTimer: (updates: Partial<TimerState>) => void;
  onEndTimer: () => void;
  userIntention: string;
}

const TimerScreen: React.FC<TimerScreenProps> = ({ 
  timerState, 
  onUpdateTimer, 
  onEndTimer,
  userIntention
}) => {
  const { totalSeconds, isRunning, originalMinutes, showCompletion } = timerState;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    onUpdateTimer({ isRunning: !isRunning });
  };

  const handleAdd15Minutes = () => {
    onUpdateTimer({ totalSeconds: totalSeconds + (15 * 60) });
  };

  const handleQuit = () => {
    onEndTimer();
  };

  // Handle completion screen actions
  const handleEndSession = () => {
    onEndTimer();
  };

  const handleAdd20Minutes = () => {
    onUpdateTimer({
      showCompletion: false,
      totalSeconds: 20 * 60,
      originalMinutes: 20,
      isRunning: true,
    });
  };

  // Show completion screen when timer is done
  if (showCompletion) {
    return (
      <CompletionScreen
        focusedMinutes={originalMinutes}
        onEndSession={handleEndSession}
        onAdd20Minutes={handleAdd20Minutes}
        userIntention={userIntention}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Show intention if set */}
        {userIntention && (
          <div className="mb-8 text-center">
            <p className="text-gray-500 text-sm mb-2">Focusing on:</p>
            <p className="text-lg text-text-primary font-medium italic">
              "{userIntention}"
            </p>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-16">
          <div className="text-8xl font-bold text-text-primary mb-4 font-mono tracking-wider">
            {formatTime(totalSeconds)}
          </div>
          <div className="text-lg text-gray-500">
            {isRunning ? 'Focus Time' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="px-6 pb-24">
        <div className="space-y-4">
          <button
            onClick={handlePauseResume}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-primary text-white border-primary hover:bg-opacity-90 transition-all duration-200"
          >
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          
          <button
            onClick={handleAdd15Minutes}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-background-alt hover:bg-background-alt transition-all duration-200"
          >
            Add 15 min
          </button>
          
          <button
            onClick={handleQuit}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-background-alt hover:bg-text-primary hover:text-white transition-all duration-200"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerScreen;