import React from 'react';

interface PreFinishScreenProps {
  onKeepGoing: () => void;
  onCompleteSession: () => void;
  userIntention: string;
  focusedMinutes: number;
}

const PreFinishScreen: React.FC<PreFinishScreenProps> = ({ 
  onKeepGoing, 
  onCompleteSession,
  userIntention,
  focusedMinutes
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Show intention if set */}
        {userIntention && (
          <div className="mb-8 text-center">
            <p className="text-gray-500 text-sm mb-2">You focused on:</p>
            <p className="text-lg text-text-primary font-medium italic">
              "{userIntention}"
            </p>
          </div>
        )}

        {/* Question */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-primary mb-4 leading-relaxed">
            How are you feeling?
          </h1>
          <p className="text-gray-500 text-lg">
            You rode this current for {focusedMinutes} minutes
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onKeepGoing}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-primary text-white border-primary hover:bg-opacity-90 transition-all duration-200"
          >
            Let's ride this current (+15 minutes)
          </button>
          
          <button
            onClick={onCompleteSession}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-background-alt hover:bg-background-alt transition-all duration-200"
          >
            Complete my current session
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreFinishScreen;