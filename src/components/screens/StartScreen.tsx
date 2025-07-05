import React from 'react';
import TimerScreen from './TimerScreen';
import { TimerState } from '../../App';

interface StartScreenProps {
  timerState: TimerState;
  onStartTimer: (minutes: number) => void;
  onStartTimerWithIntention: (minutes: number, updatedIntention?: string) => void;
  onUpdateTimer: (updates: Partial<TimerState>) => void;
  onEndTimer: () => void;
  userIntention: string;
  emotionCategory: 'pleasant' | 'unpleasant' | null;
  selectedEmotion: string | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  timerState, 
  onStartTimer, 
  onStartTimerWithIntention,
  onUpdateTimer, 
  onEndTimer,
  userIntention,
  emotionCategory,
  selectedEmotion
}) => {
  const [currentIntention, setCurrentIntention] = React.useState(userIntention);

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
      case '75 minutes':
        minutes = 75;
        break;
      case 'Just Start':
        minutes = 30; // Default to 30 minutes for "Just Start"
        break;
      default:
        minutes = 30;
    }
    
    onStartTimer(minutes);
  };

  const handlePleasantTimerSelect = (minutes: number) => {
    onStartTimerWithIntention(minutes, currentIntention);
  };

  const handleSkipRefinement = () => {
    onStartTimerWithIntention(30, userIntention);
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

  // Pleasant emotions branch - refined focus flow
  if (emotionCategory === 'pleasant') {
    const pleasantTimerOptions = [
      { label: '30 minutes', minutes: 30, subtitle: 'Find your flow' },
      { label: '60 minutes', minutes: 60, subtitle: 'Deep focus' },
      { label: '90 minutes', minutes: 90, subtitle: 'Flow state' },
    ];

    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-4 leading-relaxed">
                  Let's refine your focus
                </h1>
                <p className="text-gray-500 text-lg">
                  Want to make this more specific and actionable?
                </p>
              </div>

              {/* Examples Box */}
              <div className="mb-8 p-4 bg-background-alt rounded-lg">
                <p className="text-sm text-gray-600 mb-3 font-medium">Examples:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• "Write opening paragraph" (instead of "write blog post")</p>
                  <p>• "Clear desk surface" (instead of "clean office")</p>
                  <p>• "Review login function" (instead of "fix the code")</p>
                </div>
              </div>

              {/* Refinement Input */}
              <div className="mb-8">
                <textarea
                  value={currentIntention}
                  onChange={(e) => setCurrentIntention(e.target.value)}
                  placeholder="Refine your intention here..."
                  className="w-full px-6 py-4 text-lg text-text-primary bg-background border-2 border-background-alt rounded-lg focus:border-primary focus:outline-none transition-colors duration-200 resize-none"
                  rows={3}
                  maxLength={150}
                />
                <div className="text-right mt-2">
                  <span className="text-sm text-gray-400">
                    {currentIntention.length}/150
                  </span>
                </div>
              </div>

              {/* Timer Options */}
              <div className="space-y-4 mb-6">
                {pleasantTimerOptions.map((option) => (
                  <button
                    key={option.minutes}
                    onClick={() => handlePleasantTimerSelect(option.minutes)}
                    className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-background-alt hover:bg-background-alt transition-all duration-200 text-center"
                  >
                    <div>
                      {option.label}
                      <p className="text-sm text-gray-400 mt-1">
                        {option.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Skip Refinement */}
              <div className="text-center">
                <button
                  onClick={handleSkipRefinement}
                  className="text-gray-400 hover:text-text-primary transition-colors duration-200 text-sm"
                >
                  Skip refinement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unpleasant emotions branch - make it tiny flow
  if (emotionCategory === 'unpleasant') {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-4 leading-relaxed">
                  Let's make this tiny
                </h1>
                
                {/* Show original intention */}
                {userIntention && (
                  <div className="mb-4 p-3 bg-background-alt rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Original focus:</p>
                    <p className="text-base text-text-primary font-medium italic">
                      "{userIntention}"
                    </p>
                  </div>
                )}
                
                <p className="text-gray-500 text-lg">
                  What's the smallest piece you could start with?
                </p>
              </div>

              {/* Examples Box */}
              <div className="mb-8 p-4 bg-background-alt rounded-lg">
                <p className="text-sm text-gray-600 mb-3 font-medium">Examples:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• "Write one sentence"</p>
                  <p>• "Open the file"</p>
                  <p>• "Clear one small area"</p>
                  <p>• "Read what I have so far"</p>
                </div>
              </div>

              {/* Tiny intention input */}
              <div className="mb-6">
                <textarea
                  value={currentIntention}
                  onChange={(e) => setCurrentIntention(e.target.value)}
                  placeholder="What's the tiniest step you could take?"
                  className="w-full px-6 py-4 text-lg text-text-primary bg-background border-2 border-background-alt rounded-lg focus:border-primary focus:outline-none transition-colors duration-200 resize-none"
                  rows={3}
                  maxLength={150}
                />
                <div className="text-right mt-2">
                  <span className="text-sm text-gray-400">
                    {currentIntention.length}/150
                  </span>
                </div>
              </div>

              {/* Motivational text */}
              <div className="mb-8 text-center">
                <p className="text-gray-600 italic leading-relaxed">
                  "Task anxiety is a house of cards. It falls apart the minute you start."
                </p>
              </div>

              {/* Start 5-minute timer button */}
              {currentIntention.trim().length > 0 && (
                <button
                  onClick={() => onStartTimerWithIntention(5, currentIntention)}
                  className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-primary text-white border-primary hover:bg-opacity-90 transition-all duration-200"
                >
                  Start 5-minute timer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default flow for non-pleasant emotions or no emotion selected
  const timerOptions = [
    { label: '5 minutes', value: '5 minutes', subtitle: 'Small step' },
    { label: '30 minutes', value: '30 minutes', subtitle: 'Find your flow' },
    { label: '60 minutes', value: '60 minutes', subtitle: 'Deep focus' },
    { label: '75 minutes', value: '75 minutes', subtitle: 'Flow state' },
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
                className={`w-full py-4 px-6 text-lg font-medium rounded-lg border-2 transition-all duration-200 text-center ${
                  option.isOutlined
                    ? 'bg-background text-text-primary border-primary hover:bg-primary hover:text-white'
                    : 'bg-background text-text-primary border-background-alt hover:bg-background-alt'
                }`}
              >
                <div>
                  {option.label}
                  {option.subtitle && (
                    <p className="text-sm text-gray-400 mt-1">
                      {option.subtitle}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;