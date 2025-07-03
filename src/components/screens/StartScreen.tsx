import React from 'react';

const StartScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-black mb-6">Start Timer</h1>
        
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Ready to start</p>
            <p className="text-gray-400 text-sm mt-2">Timer functionality will be added here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;