import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - run only once on mount

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* App Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-text-primary mb-2">Current</h1>
        <p className="text-lg text-gray-500 font-medium">A zen focus timer</p>
      </div>

      {/* Breathing Animation Circle */}
      <div className="mb-12">
        <div className="relative">
          {/* Outer breathing circle */}
          <div className="w-32 h-32 rounded-full border-2 border-primary animate-pulse opacity-30"></div>
          
          {/* Inner breathing circle */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary"
            style={{
              animation: 'breathe 3s ease-in-out infinite'
            }}
          ></div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-xl text-text-primary font-medium leading-relaxed max-w-sm">
          Take a deep breath and pause for a moment
        </p>
      </div>

      {/* Custom CSS for breathing animation */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;