import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import BackgroundEngine from './components/BackgroundEngine';
import ClockWidget from './components/ClockWidget';
import AudioPlayer from './components/AudioPlayer';
import TimerBrain from './components/TimerBrain';
import ProductivityHub from './components/ProductivityHub';
import { Settings, Menu } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import ModeToggle from './components/ModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

function LofiStation() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white font-sans selection:bg-white/30">
      <BackgroundEngine />

      {/* Main Layout Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-36">

        {/* Top Bar (Icons) */}
        <div className="absolute top-8 left-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="glass-btn p-3 hover:scale-105 transition-transform"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="absolute top-8 right-8">
          <button
            onClick={() => setSettingsOpen(true)}
            className="glass-btn p-3 hover:scale-105 transition-transform"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Center Widget Cluster */}
        <div className="flex flex-col items-center gap-12">
          {/* Clock */}
          <ClockWidget />

          {/* Timer */}
          <TimerBrain />
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-12 left-12">
          <ModeToggle />
        </div>

        <div className="absolute bottom-12 right-12">
          <AudioPlayer />
        </div>
      </div>

      {/* Overlays (Sidebar, Modals) */}
      <ProductivityHub isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />

    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <LofiStation />
    </StoreProvider>
  );
}

export default App;
