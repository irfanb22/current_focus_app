import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getCompletionQuote } from '../../constants/quotes';

interface CompletionScreenProps {
  focusedMinutes: number;
  onEndSession: () => void;
  userIntention: string;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ 
  focusedMinutes, 
  onEndSession, 
  userIntention
}) => {
  const completionQuote = getCompletionQuote();

  return (
    <div className="min-h-screen bg-success flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Celebration Icon */}
        <div className="mb-8">
          <CheckCircle 
            size={80} 
            className="text-text-primary mx-auto animate-pulse" 
            strokeWidth={1.5}
          />
        </div>

        {/* Congratulatory Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-6">
            Session Complete!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            You focused for <span className="font-semibold text-text-primary">{focusedMinutes} minutes</span>
          </p>
          
          {/* Quote Display */}
          <div className="mt-6 mb-4">
            <p className="text-gray-600 italic text-lg mb-2">
              "{completionQuote.text}"
            </p>
            <p className="text-gray-500 text-sm">
              - {completionQuote.author}
            </p>
          </div>
          
          {/* Show completed intention */}
          {userIntention && (
            <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">You focused on:</p>
              <p className="text-lg text-text-primary font-medium italic">
                "{userIntention}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-24">
        <button
          onClick={onEndSession}
          className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-primary text-white border-primary hover:bg-opacity-90 transition-all duration-200"
        >
          Start Again
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;