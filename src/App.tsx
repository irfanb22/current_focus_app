import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import MySessionsScreen from './components/screens/MySessionsScreen';
import StartScreen from './components/screens/StartScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import SplashScreen from './components/screens/SplashScreen';

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
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    totalSeconds: 0,
    isRunning: false,
    originalMinutes: 0,
    showCompletion: false,
  });

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
      // Auto-navigate to Start tab when timer completes
      setActiveTab('start');
    }
  }, [timerState.isActive, timerState.totalSeconds, timerState.showCompletion]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleStartTimer = (minutes: number) => {
    setTimerState({
      isActive: true,
      totalSeconds: minutes * 60,
      isRunning: true,
      originalMinutes: minutes,
      showCompletion: false,
    });
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
        return (
          <StartScreen 
            timerState={timerState}
            onStartTimer={handleStartTimer}
            onUpdateTimer={handleUpdateTimer}
            onEndTimer={handleEndTimer}
          />
        );
      case 'settings':
        return <SettingsScreen />;
      default:
        return (
          <StartScreen 
            timerState={timerState}
            onStartTimer={handleStartTimer}
            onUpdateTimer={handleUpdateTimer}
            onEndTimer={handleEndTimer}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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