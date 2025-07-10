import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navigation from './components/Navigation';
import MySessionsScreen from './components/screens/MySessionsScreen';
import StartScreen from './components/screens/StartScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import SplashScreen from './components/screens/SplashScreen';
import IntentionScreen from './components/screens/IntentionScreen';
import EmotionScreen from './components/screens/EmotionScreen';
import PreFinishScreen from './components/screens/PreFinishScreen';
import CompletionScreen from './components/screens/CompletionScreen';

export type TabType = 'sessions' | 'start' | 'settings';

export interface TimerState {
  isActive: boolean;
  totalSeconds: number;
  isRunning: boolean;
  originalMinutes: number;
  showCompletion: boolean;
  showPreFinish: boolean;
}

function App() {
  const isDevelopment = true;
  
  // Diagnostic logging for renders
  console.log('[Debug] App render timestamp:', Date.now());
  
  const [activeTab, setActiveTab] = useState<TabType>('start');
  const [showSplash, setShowSplash] = useState(!isDevelopment);
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
    showPreFinish: false,
  });

  // Log current state for debugging
  console.log('[Debug] Current state:', {
    activeTab,
    showSplash,
    userIntention,
    showTimerSelection,
    showEmotionScreen,
    userEmotion,
    timerState
  });
  // Audio reference for completion chime
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/sounds/chime_current_end.wav');
  }, []);

  // Timer logic runs at App level - continues regardless of active tab
  useEffect(() => {
    console.log('[Debug] Timer effect triggered', {
      isActive: timerState.isActive,
      isRunning: timerState.isRunning,
      totalSeconds: timerState.totalSeconds
    });
    
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
      console.log('[Debug] Timer effect cleanup');
      if (interval) clearInterval(interval);
    };
  }, [timerState.isActive, timerState.isRunning]);

  // Handle timer completion at App level
  useEffect(() => {
    console.log('[Debug] Timer completion effect triggered', {
      isActive: timerState.isActive,
      totalSeconds: timerState.totalSeconds,
      showPreFinish: timerState.showPreFinish,
      showCompletion: timerState.showCompletion
    });
    
    if (timerState.isActive && timerState.totalSeconds === 0 && !timerState.showPreFinish && !timerState.showCompletion) {
      console.log('[Debug] Timer completed - setting showPreFinish');
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        showPreFinish: true
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
  }, [timerState.isActive, timerState.totalSeconds, timerState.showPreFinish, timerState.showCompletion]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleIntentionComplete = (intention: string) => {
    setUserIntention(intention);
    setShowEmotionScreen(true);
  };

  const handleIntentionJustStart = (intention: string) => {
    setUserIntention(intention);
    // Immediately start a 30-minute timer
    handleStartTimer(30);
  };

  const handleEmotionSelect = (emotion: string, category: 'pleasant' | 'unpleasant') => {
    setUserEmotion({ emotion, category });
    setShowEmotionScreen(false);
    setShowTimerSelection(true);
  };

  const handleBackFromEmotion = () => {
    setShowEmotionScreen(false);
  };

  const handleBackToEmotionSelection = () => {
    setShowEmotionScreen(true);
    setShowTimerSelection(false);
  };

  const handleStartTimer = (minutes: number) => {
    console.log('[Debug] handleStartTimer called with minutes:', minutes);
    setTimerState({
      isActive: true,
      totalSeconds: minutes * 60,
      isRunning: true,
      originalMinutes: minutes,
      showCompletion: false,
      showPreFinish: false,
    });
    setShowTimerSelection(false);
  };

  const handleStartTimerWithIntention = (minutes: number, updatedIntention?: string) => {
    console.log('[Debug] handleStartTimerWithIntention called', { minutes, updatedIntention });
    if (updatedIntention !== undefined) {
      setUserIntention(updatedIntention);
    }
    setTimerState({
      isActive: true,
      totalSeconds: minutes * 60,
      isRunning: true,
      originalMinutes: minutes,
      showCompletion: false,
      showPreFinish: false,
    });
    setShowTimerSelection(false);
  };

  const handleUpdateTimer = (updates: Partial<TimerState>) => {
    console.log('[Debug] handleUpdateTimer called with updates:', updates);
    setTimerState(prev => ({ ...prev, ...updates }));
  };

  const handleEndTimer = () => {
    console.log('[Debug] handleEndTimer called');
    setTimerState({
      isActive: false,
      totalSeconds: 0,
      isRunning: false,
      originalMinutes: 0,
      showCompletion: false,
      showPreFinish: false,
    });
    // Clear the intention and timer selection state when ending a timer session
    setUserIntention('');
    setUserEmotion(null);
    setShowEmotionScreen(false);
    setShowTimerSelection(false);
  };

  const handleKeepGoing = () => {
    console.log('[Debug] handleKeepGoing called');
    setTimerState(prev => ({
      ...prev,
      showPreFinish: false,
      totalSeconds: 15 * 60, // Add 15 minutes
      isRunning: true,
    }));
  };

  const handleCompleteSession = () => {
    console.log('[Debug] handleCompleteSession called');
    setTimerState(prev => ({
      ...prev,
      showPreFinish: false,
      showCompletion: true,
    }));
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
        // Show pre-finish screen if timer reached zero
        if (timerState.showPreFinish) {
          return (
            <PreFinishScreen
              onKeepGoing={handleKeepGoing}
              onCompleteSession={handleCompleteSession}
              userIntention={userIntention}
              focusedMinutes={timerState.originalMinutes}
            />
          );
        }
        // Show timer screen if timer is active
        if (timerState.isActive) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onStartTimerWithIntention={handleStartTimerWithIntention}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              userIntention={userIntention}
              emotionCategory={userEmotion?.category || null}
              selectedEmotion={userEmotion?.emotion || null}
            />
          );
        }
        // Show timer selection screen if user has completed intention
        if (showTimerSelection) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onStartTimerWithIntention={handleStartTimerWithIntention}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              onBackToEmotion={handleBackToEmotionSelection}
              userIntention={userIntention}
              emotionCategory={userEmotion?.category || null}
              selectedEmotion={userEmotion?.emotion || null}
            />
          );
        }
        // Show emotion screen if user has completed intention but not selected emotion
        if (showEmotionScreen) {
          return (
            <EmotionScreen 
              onEmotionSelect={handleEmotionSelect}
              onBack={handleBackFromEmotion}
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
        if (timerState.showPreFinish) {
          return (
            <PreFinishScreen
              onKeepGoing={handleKeepGoing}
              onCompleteSession={handleCompleteSession}
              userIntention={userIntention}
              focusedMinutes={timerState.originalMinutes}
            />
          );
        }
        if (timerState.isActive) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onStartTimerWithIntention={handleStartTimerWithIntention}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              userIntention={userIntention}
              emotionCategory={userEmotion?.category || null}
              selectedEmotion={userEmotion?.emotion || null}
            />
          );
        }
        if (showTimerSelection) {
          return (
            <StartScreen 
              timerState={timerState}
              onStartTimer={handleStartTimer}
              onStartTimerWithIntention={handleStartTimerWithIntention}
              onUpdateTimer={handleUpdateTimer}
              onEndTimer={handleEndTimer}
              onBackToEmotion={handleBackToEmotionSelection}
              userIntention={userIntention}
              emotionCategory={userEmotion?.category || null}
              selectedEmotion={userEmotion?.emotion || null}
            />
          );
        }
        if (showEmotionScreen) {
          return (
            <EmotionScreen 
              onEmotionSelect={handleEmotionSelect}
              onBack={handleBackFromEmotion}
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