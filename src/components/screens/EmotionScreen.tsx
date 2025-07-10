import React, { useState } from 'react';

interface EmotionScreenProps {
  onEmotionSelect: (emotion: string, category: 'pleasant' | 'unpleasant') => void;
  onBack: () => void;
}

const EmotionScreen: React.FC<EmotionScreenProps> = ({ onEmotionSelect, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<'pleasant' | 'unpleasant' | null>(null);

  const pleasantEmotions = [
    { label: 'Ready', value: 'ready' },
    { label: 'Excited', value: 'excited' },
    { label: 'Confident', value: 'confident' },
  ];

  const unpleasantEmotions = [
    { label: 'Drained', value: 'drained' },
    { label: 'Overwhelmed', value: 'overwhelmed' },
    { label: 'Discouraged', value: 'discouraged' },
  ];

  const handleCategorySelect = (category: 'pleasant' | 'unpleasant') => {
    setSelectedCategory(category);
  };

  const handleEmotionSelect = (emotion: string) => {
    if (selectedCategory) {
      onEmotionSelect(emotion, selectedCategory);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-12 left-6 text-text-primary text-2xl font-bold hover:text-primary transition-colors duration-200"
        aria-label="Back"
      >
        &lt;
      </button>
      
      <div className="w-full max-w-md">
        {/* Question */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-primary mb-4 leading-relaxed">
            How does starting feel right now?
          </h1>
          <p className="text-gray-500 text-lg">
            {selectedCategory ? 'Choose what resonates most' : 'Check in with yourself'}
          </p>
        </div>

        {/* Category Selection */}
        {!selectedCategory && (
          <div className="space-y-4">
            <button
              onClick={() => handleCategorySelect('pleasant')}
              className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-primary text-white border-primary hover:bg-opacity-90 transition-all duration-200"
            >
              Pleasant
            </button>
            
            <button
              onClick={() => handleCategorySelect('unpleasant')}
              className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-background-alt hover:bg-background-alt transition-all duration-200"
            >
              Unpleasant
            </button>
          </div>
        )}

        {/* Specific Emotion Selection */}
        {selectedCategory && (
          <div className="space-y-4">
            {(selectedCategory === 'pleasant' ? pleasantEmotions : unpleasantEmotions).map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => handleEmotionSelect(emotion.value)}
                className="w-full py-4 px-6 text-lg font-medium rounded-lg border-2 bg-background text-text-primary border-background-alt hover:bg-background-alt transition-all duration-200"
              >
                {emotion.label}
              </button>
            ))}
            
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-full py-3 px-6 text-base font-medium rounded-lg border-2 bg-background text-gray-500 border-gray-300 hover:text-text-primary hover:border-background-alt transition-all duration-200 mt-6"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionScreen;