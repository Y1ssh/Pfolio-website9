import React, { useState } from 'react';
import { Scene } from './components/Scene';
import LandingPage from './components/LandingPage';
import './index.css';

function App() {
  const [landingPageVisible, setLandingPageVisible] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleLandingPage = () => {
    setLandingPageVisible(!landingPageVisible);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="App relative">
      <Scene onToggleLandingPage={toggleLandingPage} onToggleTheme={toggleTheme} theme={theme} />
      {landingPageVisible && <LandingPage theme={theme} />}
    </div>
  );
}

export default App; 