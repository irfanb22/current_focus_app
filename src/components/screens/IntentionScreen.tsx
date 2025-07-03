import React, { useState } from 'react';

interface IntentionScreenProps {
  onContinue: (intention: string) => void;
  onJustStart: (intention: string) => void;
}

const IntentionScreen: React.FC<IntentionScreenProps> = ({ onContinue, onJustStart }) => {
  const [intention, setIntention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(intention.trim());
  };

  const handleContinue = () => {
    onContinue(intention.trim());
  };

  const handleJustStart = () => {
    onJustStart(intention.trim());
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Question */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-primary mb-4 leading-relaxed">
            What needs your current focus?
          </h1>
          <p className="text-gray-500 text-lg">
            Set an intention for your session
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Type your intention here..."
              className="w-full px-6 py-4 text-lg text-text-primary bg-background border-2 border-background-alt rounded-lg focus:border-primary focus:outline-none transition-colors duration-200 resize-none"
              rows={3}
              maxLength={150}
            />
            <div className="text-right mt-2">
              <span className="text-sm text-gray-400">
                {intention.length}/150
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-primary text-white border-primary hover:bg-opacity-90 transition-all duration-200"
            >
              Continue
            </button>
            
            <button
              type="button"
              onClick={handleJustStart}
              className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              Just Start (25 min)
            </button>
          </div>
        </form>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => onContinue('')}
            className="text-gray-400 hover:text-text-primary transition-colors duration-200 text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntentionScreen;