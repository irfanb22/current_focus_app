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
  startTime: number | null;
  pausedDuration: number;
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
    startTime: null,
    pausedDuration: 0,
  });
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);

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

  // Helper function to format time for tab title
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/sounds/chime_current_end.wav');
  }, []);

  // Timestamp-based timer logic - runs reliably in background tabs
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState.isActive && timerState.isRunning && timerState.startTime) {
      interval = setInterval(() => {
        const actualRemainingMs = timerState.originalMinutes * 60 * 1000 - (Date.now() - (timerState.startTime || 0) - timerState.pausedDuration);
        const newTotalSeconds = Math.max(0, Math.floor(actualRemainingMs / 1000));
        
        // Update tab title regardless of visibility
        document.title = `🌊 ${formatTime(newTotalSeconds)} - Current`;
        
        // Update state
        setTimerState(prev => ({
          ...prev,
          totalSeconds: newTotalSeconds
        }));
        
        // Handle timer completion
        if (newTotalSeconds === 0) {
          if (interval) clearInterval(interval);
          document.title = "Current - A zen focus timer";
          setTimerState(prev => ({
            ...prev,
            isRunning: false,
            showPreFinish: true
          }));
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (!timerState.isActive) {
        document.title = "Current - A zen focus timer";
      }
    };
  }, [timerState.isActive, timerState.isRunning, timerState.startTime, timerState.originalMinutes, timerState.pausedDuration]);

  // Page Visibility API - sync timer when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && timerState.isActive && timerState.isRunning && timerState.startTime) {
        const actualRemainingMs = timerState.originalMinutes * 60 * 1000 - (Date.now() - (timerState.startTime || 0) - timerState.pausedDuration);
        const newTotalSeconds = Math.max(0, Math.floor(actualRemainingMs / 1000));
        
        setTimerState(prev => ({
          ...prev,
          totalSeconds: newTotalSeconds
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.isActive, timerState.isRunning, timerState.startTime, timerState.originalMinutes, timerState.pausedDuration]);

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
      startTime: Date.now(),
      pausedDuration: 0,
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
      startTime: Date.now(),
      pausedDuration: 0,
    });
    setShowTimerSelection(false);
  };

  const handleUpdateTimer = (updates: Partial<TimerState>) => {
    console.log('[Debug] handleUpdateTimer called with updates:', updates);
    setTimerState(prev => {
      const newState = { ...prev, ...updates };
      
      // Handle pause
      if (updates.isRunning === false && prev.isRunning === true) {
        setPauseStartTime(Date.now());
      }
      
      // Handle resume
      if (updates.isRunning === true && prev.isRunning === false && pauseStartTime) {
        const pauseDuration = Date.now() - pauseStartTime;
        newState.pausedDuration = prev.pausedDuration + pauseDuration;
        setPauseStartTime(null);
      }
      
      return newState;
    });
  };

  const handleEndTimer = () => {
    console.log('[Debug] handleEndTimer called');
    document.title = "Current - A zen focus timer";
    setTimerState({
      isActive: false,
      totalSeconds: 0,
      isRunning: false,
      originalMinutes: 0,
      showCompletion: false,
      showPreFinish: false,
      startTime: null,
      pausedDuration: 0,
    });
    setPauseStartTime(null);
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