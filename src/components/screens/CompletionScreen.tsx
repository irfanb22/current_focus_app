import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletionScreenProps {
  focusedMinutes: number;
  onEndSession: () => void;
  onAdd20Minutes: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ 
  focusedMinutes, 
  onEndSession, 
  onAdd20Minutes 
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Celebration Icon */}
        <div className="mb-8">
          <CheckCircle 
            size={80} 
            className="text-black mx-auto animate-pulse" 
            strokeWidth={1.5}
          />
        </div>

        {/* Congratulatory Message */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-6">
            Session Complete!
          </h1>
          <p className="text-xl text-gray-600">
            You focused for <span className="font-semibold text-black">{focusedMinutes} minutes</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-24">
        <div className="space-y-4">
          <button
            onClick={onAdd20Minutes}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-black text-white border-black hover:bg-gray-800 transition-all duration-200"
          >
            Add 20 Minutes
          </button>
          
          <button
            onClick={onEndSession}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-white text-black border-black hover:bg-gray-50 transition-all duration-200"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;