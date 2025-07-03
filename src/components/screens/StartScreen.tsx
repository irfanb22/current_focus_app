import React from 'react';

const StartScreen: React.FC = () => {
  const handleTimerSelect = (duration: string) => {
    alert(`Selected: ${duration}`);
  };

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