import React, { useState, useEffect } from 'react';

interface TimerScreenProps {
  initialMinutes: number;
  onQuit: () => void;
}

const TimerScreen: React.FC<TimerScreenProps> = ({ initialMinutes, onQuit }) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalSeconds]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleAdd15Minutes = () => {
    setTotalSeconds(prev => prev + (15 * 60));
  };

  const handleQuit = () => {
    onQuit();
  };

  // Handle timer completion
  useEffect(() => {
    if (totalSeconds === 0) {
      setIsRunning(false);
      // TODO: Show completion options in next iteration
    }
  }, [totalSeconds]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Timer Display */}
        <div className="text-center mb-16">
          <div className="text-8xl font-bold text-black mb-4 font-mono tracking-wider">
            {formatTime(totalSeconds)}
          </div>
          <div className="text-lg text-gray-600">
            {isRunning ? 'Focus Time' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="px-6 pb-24">
        <div className="space-y-4">
          <button
            onClick={handlePauseResume}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-white text-black border-black hover:bg-gray-50 transition-all duration-200"
          >
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          
          <button
            onClick={handleAdd15Minutes}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-white text-black border-black hover:bg-gray-50 transition-all duration-200"
          >
            Add 15 min
          </button>
          
          <button
            onClick={handleQuit}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-white text-black border-black hover:bg-black hover:text-white transition-all duration-200"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerScreen;