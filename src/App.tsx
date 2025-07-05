import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import MySessionsScreen from './components/screens/MySessionsScreen';
import StartScreen from './components/screens/StartScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import SplashScreen from './components/screens/SplashScreen';
import IntentionScreen from './components/screens/IntentionScreen';
import EmotionScreen from './components/screens/EmotionScreen';

export type TabType = 'sessions' | 'start' | 'settings';

export interface TimerState {
  isActive: boolean;
  totalSeconds: number;
  isRunning: boolean;
  originalMinutes: number;
  showCompletion: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('start');
  const [showSplash, setShowSplash] = useState(true);
  const [userIntention, setUserIntention] = useState('');
  const [showTimerSelection, setShowTimerSelection] = useState(false);
  const [showEmotionScreen, setShowEmotionScreen] = useState(false);
  const [userEmotion, setUserEmotion] = useState<{
    emotion: string;
    category: 'pleasant' | 'unpleasant';
  } | null>(null);
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    totalSeconds: 0,
    isRunning: false,
    originalMinutes: 0,
    showCompletion: false,
  });

  // Audio reference for completion chime
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/sounds/chime_current_end.wav');
  }, []);

  // Timer logic runs at App level - continues regardless of active tab
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState.isActive && timerState.isRunning && timerState.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          totalSeconds: prev.totalSeconds - 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isActive, timerState.isRunning, timerState.totalSeconds]);

  // Handle timer completion at App level
  useEffect(() => {
    if (timerState.isActive && timerState.totalSeconds === 0 && !timerState.showCompletion) {
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        showCompletion: true
      }));
      
      // Play completion chime
      if (audioRef.current) {
        try {
          audioRef.current.play().catch(error => {
            console.log('Audio playback failed:', error);
          });
        } catch (error) {
          console.log('Audio playback error:', error);
        }
      }
      
      // Auto-navigate to Start tab when timer completes
      setActiveTab('start');
    }
  }, [timerState.isActive, timerState.totalSeconds, timerState.showCompletion]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleIntentionComplete = (intention: string) => {
    setUserIntention(intention);
    setShowEmotionScreen(true);
  };

  const handleIntentionJustStart = (intention: string) => {
    setUserIntention(intention);
    // Immediately start a 25-minute timer
    handleStartTimer(25);
  };

  const handleEmotionSelect = (emotion: string, category: 'pleasant' | 'unpleasant') => {
    setUserEmotion({ emotion, category });
    setShowEmotionScreen(false);
    setShowTimerSelection(true);
  };

  const handleStartTimer = (minutes: number) => {
    setTimerState({
      isActive: true,
      totalSeconds: minutes * 60,
      isRunning: true,
      originalMinutes: minutes,
      showCompletion: false,
    });
    setShowTimerSelection(false);
  };

  const handleUpdateTimer = (updates: Partial<TimerState>) => {
    setTimerState(prev => ({ ...prev, ...updates }));
  };

  const handleEndTimer = () => {
    setTimerState({
      isActive: false,
      totalSeconds: 0,
      isRunning: false,
      originalMinutes: 0,
      showCompletion: false,
    });
    // Clear the intention and timer selection state when ending a timer session
    setUserIntention('');
    setUserEmotion(null);
    setShowEmotionScreen(false);
    setShowTimerSelection(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'sessions':
        return <MySessionsScreen />;
      case 'start':
        // Show timer screen if timer is active
        if (timerState.isActive) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              userIntention={userIntention}
            />
          );
        }
        // Show timer selection screen if user has completed intention
        if (showTimerSelection) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              userIntention={userIntention}
            />
          );
        }
        // Show emotion screen if user has completed intention but not selected emotion
        if (showEmotionScreen) {
          return (
            <EmotionScreen 
              onEmotionSelect={handleEmotionSelect}
            />
          );
        }
        // Default: show intention screen when no timer is active
        return (
          <IntentionScreen 
            onContinue={handleIntentionComplete}
            onJustStart={handleIntentionJustStart}
          />
        );
      case 'settings':
        return <SettingsScreen />;
      default:
        // Default case - same logic as 'start'
        if (timerState.isActive) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              userIntention={userIntention}
            />
          );
        }
        if (showTimerSelection) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              userIntention={userIntention}
            />
          );
        }
        if (showEmotionScreen) {
          return (
            <EmotionScreen 
              onEmotionSelect={handleEmotionSelect}
            />
          );
        }
        return (
          <IntentionScreen 
            onContinue={handleIntentionComplete}
            onJustStart={handleIntentionJustStart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 pb-20">
        {renderScreen()}
      </div>
      
      {/* Bottom Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        hasActiveTimer={timerState.isActive}
      />
    </div>
  );
}

export default App;