import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { X } from 'lucide-react';

const THEMES = [
    { id: 'rain', name: 'Rainy Window', src: '/assets/videos/lofi-anime-girl-watching-the-rain-with-cat-moewalls-com.mp4' },
    { id: 'bedroom', name: 'Study Session', src: '/assets/videos/mylivewallpapers.com-Study-Session.mp4' },
    { id: 'city', name: 'Night City', src: '/assets/videos/a-quiet-night-in-a-rainy-pixel-city-moewalls-com.mp4' },
    { id: 'school', name: 'Broken Heart', src: '/assets/videos/anime-school-girl-broken-heart-pixel-moewalls-com.mp4' },
    { id: 'furry', name: 'Cozy Break', src: '/assets/videos/furry-lofi-study-break-moewalls-com.mp4' },
    { id: 'midoriya', name: 'Hero Study', src: '/assets/videos/izuku-midoriya-study-my-hero-academia-moewalls-com.mp4' },
    { id: 'sasuke', name: 'Ninja Focus', src: '/assets/videos/mylivewallpapers.com-Sasuke-Studying.mp4' },
    { id: 'ukinami', name: 'Pixel Vibes', src: '/assets/videos/ukinami-yuzuhas-pixelated-lofi-moewalls-com.mp4' },
];



const SettingsModal = ({ isOpen, onClose }) => {
    const { theme, setTheme, pomodoroSettings, setPomodoroSettings } = useStore();
    const [activeTab, setActiveTab] = useState('general');
    const [localSettings, setLocalSettings] = useState(pomodoroSettings);

    const handleSave = () => {
        setPomodoroSettings(localSettings);
        onClose(); // Close modal after saving
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Drawer - Right Side */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-96 bg-black/80 backdrop-blur-2xl border-l border-white/10 z-50 p-6 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-mono font-bold tracking-tighter">Station Settings</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs - Pill Style */}
                        <div className="flex p-1 bg-white/5 rounded-xl mb-6">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'general' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('timer')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'timer' ? 'bg-white/10 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                            >
                                Timer
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {activeTab === 'general' ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Background Theme</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {THEMES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={`relative overflow-hidden group rounded-xl border transition-all text-left h-24 flex items-center ${theme === t.id ? 'border-white ring-2 ring-white/20' : 'border-white/10 hover:border-white/30'}`}
                                                >
                                                    {/* Video Preview Background */}
                                                    <div className="absolute inset-0 z-0">
                                                        <video
                                                            src={t.src}
                                                            muted
                                                            loop
                                                            autoPlay
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                    </div>

                                                    <div className="relative z-10 p-4">
                                                        <p className="font-bold text-lg text-white shadow-black drop-shadow-md">{t.name}</p>
                                                        {theme === t.id && <p className="text-xs text-white/80 font-mono mt-1">● Active</p>}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Timer Lengths Inputs */}
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-white">Timer Lengths</h3>
                                            <p className="text-xs text-white/50">Adjust your focus and break durations.</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2"> {/* Tighter Grid for narrower sidebar */}
                                            {/* Focus Input */}
                                            <div className="space-y-2 col-span-1">
                                                <label className="text-xs font-bold text-white/90">Focus</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={localSettings.focus}
                                                        onChange={(e) => setLocalSettings({ ...localSettings, focus: parseInt(e.target.value) || 0 })}
                                                        className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#6d5afc] transition-colors no-spinner text-sm"
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30">min</span>
                                                </div>
                                            </div>

                                            {/* Short Break Input */}
                                            <div className="space-y-2 col-span-1">
                                                <label className="text-xs font-bold text-white/90">Short</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={localSettings.shortBreak}
                                                        onChange={(e) => setLocalSettings({ ...localSettings, shortBreak: parseInt(e.target.value) || 0 })}
                                                        className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#6d5afc] transition-colors no-spinner text-sm"
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30">min</span>
                                                </div>
                                            </div>

                                            {/* Long Break Input */}
                                            <div className="space-y-2 col-span-1">
                                                <label className="text-xs font-bold text-white/90">Long</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={localSettings.longBreak}
                                                        onChange={(e) => setLocalSettings({ ...localSettings, longBreak: parseInt(e.target.value) || 0 })}
                                                        className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#6d5afc] transition-colors no-spinner text-sm"
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30">min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition active:scale-95"
                                        >
                                            Save Changes
                                        </button>
                                        <p className="text-xs text-center text-white/30">
                                            Saving will reset the current timer.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
