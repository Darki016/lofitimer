import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

const MODES = {
    POMODORO: 'pomodoro',
    TIMER: 'timer',
    STOPWATCH: 'stopwatch'
};

const PRESETS = [
    { label: '10m', val: 10 * 60 },
    { label: '25m', val: 25 * 60 },
    { label: '40m', val: 40 * 60 },
    { label: '50m', val: 50 * 60 },
    { label: '1h', val: 60 * 60 },
];

const TimerBrain = () => {
    const {
        timerMode, setTimerMode,
        timeLeft, setTimeLeft,
        isActive, setIsActive,
        pomodoroSettings
    } = useStore();

    const [pomodoroState, setPomodoroState] = useState('focus');
    const [completedSessions, setCompletedSessions] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    // Custom Time Inputs
    const [customH, setCustomH] = useState(0);
    const [customM, setCustomM] = useState(0);
    const [customS, setCustomS] = useState(0);

    // React to mode changes (e.g., from external toggle) or settings change
    useEffect(() => {
        setIsActive(false);
        setIsEditing(false);
        if (timerMode === MODES.POMODORO) {
            // Instead of resetting state purely, ideally we check if we need to update the time
            // For now, if settings change, we update the time if we are in that state
            setTimeLeft(pomodoroSettings[pomodoroState] * 60);
        } else if (timerMode === MODES.STOPWATCH) {
            setTimeLeft(0);
        } else {
            setTimeLeft(10 * 60);
        }
    }, [timerMode, pomodoroSettings]);

    // Update time if settings change specifically for the current state (handled above partially, but let's be explicit)
    // Actually simplicity: if settings change, we reset the timer to the new setting value for the current state.

    // Sync input state when opening edit
    useEffect(() => {
        if (isEditing) {
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;
            setCustomH(h);
            setCustomM(m);
            setCustomS(s);
        }
    }, [isEditing, timeLeft]);

    // Interval Logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (timerMode === MODES.STOPWATCH) {
                    setTimeLeft(prev => prev + 1);
                } else {
                    setTimeLeft((prev) => {
                        if (prev <= 0) {
                            handleTimerComplete();
                            return 0; // Clamp
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timerMode, pomodoroState]);

    const handleTimerComplete = () => {
        if (timerMode === MODES.POMODORO) {
            if (pomodoroState === 'focus') {
                const newSessions = completedSessions + 1;
                setCompletedSessions(newSessions);
                if (newSessions % 4 === 0) {
                    setPomodoroState('longBreak');
                    setTimeLeft(pomodoroSettings.longBreak * 60);
                } else {
                    setPomodoroState('shortBreak');
                    setTimeLeft(pomodoroSettings.shortBreak * 60);
                }
            } else {
                setPomodoroState('focus');
                setTimeLeft(pomodoroSettings.focus * 60);
            }
            setIsActive(true); // Auto-start next session
        } else {
            setIsActive(false);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (timerMode === MODES.POMODORO) {
            // Reset to current state's default time
            setTimeLeft(pomodoroSettings[pomodoroState] * 60);
        } else if (timerMode === MODES.TIMER) {
            setTimeLeft(10 * 60);
        } else {
            setTimeLeft(0);
        }
    };

    const switchMode = (mode) => {
        setTimerMode(mode);
        setIsActive(false);
        setIsEditing(false);
        if (mode === MODES.POMODORO) {
            // Default reset on mode switch
            setPomodoroState('focus');
            setTimeLeft(pomodoroSettings.focus * 60);
        } else if (mode === MODES.STOPWATCH) {
            setTimeLeft(0);
        } else {
            setTimeLeft(10 * 60);
        }
    };

    const switchPomodoroState = (state) => {
        setPomodoroState(state);
        setIsActive(false);
        setTimeLeft(pomodoroSettings[state] * 60);
    };

    const applyCustomTime = () => {
        const totalSeconds = (parseInt(customH) || 0) * 3600 + (parseInt(customM) || 0) * 60 + (parseInt(customS) || 0);
        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds);
            setIsEditing(false);
        }
    };

    return (
        <motion.div layout className="relative flex flex-col items-center gap-6">

            <AnimatePresence mode="wait">
                {timerMode === MODES.POMODORO ? (
                    <motion.div
                        key="pomodoro"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-6 w-full max-w-lg"
                    >
                        {/* Pomodoro State Pills */}
                        <div className="flex items-center gap-4 mt-2">
                            {[
                                { id: 'focus', label: 'Focus' },
                                { id: 'shortBreak', label: 'Short Break' },
                                { id: 'longBreak', label: 'Long Break' }
                            ].map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => switchPomodoroState(st.id)}
                                    className={`px-6 py-2 rounded-xl border font-medium transition-all ${pomodoroState === st.id
                                        ? 'bg-[#6d5afc] border-[#6d5afc] text-white shadow-lg shadow-[#6d5afc]/30' // Active Purple
                                        : 'bg-transparent border-white/20 text-white/70 hover:border-white/50 hover:bg-white/5'
                                        }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>

                        {/* Pomodoro Dots */}
                        <div className="flex gap-3 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full border border-white/50 transition-all duration-500 ${i < (completedSessions % 4) ? 'bg-white scale-110' : 'bg-transparent'
                                        } ${i === (completedSessions % 4) && pomodoroState === 'focus' && isActive ? 'animate-pulse bg-white/50' : ''}`}
                                />
                            ))}
                        </div>

                        {/* Huge Timer Display */}
                        <h1 className="text-[10rem] leading-none font-bold tracking-tighter tabular-nums drop-shadow-2xl mt-4 font-sans">
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </h1>

                        {/* New Controls Layout */}
                        <div className="flex items-center gap-6 mt-8">
                            {/* Start Button */}
                            <button
                                onClick={toggleTimer}
                                className={`h-16 px-12 rounded-2xl flex items-center gap-3 text-xl font-bold uppercase tracking-wider transition-all shadow-xl ${isActive
                                    ? 'bg-red-500/90 hover:bg-red-500 text-white shadow-red-500/20'
                                    : 'bg-[#6d5afc] hover:bg-[#5b4be0] text-white shadow-[#6d5afc]/30'
                                    }`}
                            >
                                {isActive ? 'Pause' : 'Start'}
                            </button>

                            {/* Reset */}
                            <button onClick={resetTimer} className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition backdrop-blur-sm">
                                <RotateCcw size={28} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    // STOPWATCH MODE UI (Simplified, no edit)
                    <motion.div
                        key="stopwatch"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <h2 className="text-xl font-medium text-white/50 uppercase tracking-widest mb-4">Stopwatch</h2>

                        {/* Timer Display */}
                        <div className="relative group">
                            <motion.h1
                                layout
                                className="text-9xl font-mono font-bold tracking-tighter tabular-nums drop-shadow-2xl cursor-default"
                            >
                                {formatTime(timeLeft)}
                            </motion.h1>
                        </div>

                        <p className="h-6 text-white/70 uppercase tracking-widest text-sm font-light">
                            {isActive ? 'Running' : 'Paused'}
                        </p>

                        <div className="flex items-center gap-6 mt-6">
                            <button onClick={resetTimer} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition backdrop-blur-sm group">
                                <RotateCcw size={24} className="group-hover:-rotate-90 transition-transform duration-500" />
                            </button>

                            <button onClick={toggleTimer} className="p-6 rounded-full bg-white text-black shadow-lg shadow-white/20 hover:scale-105 active:scale-95 transition">
                                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal (For Timer Mode) */}
            <AnimatePresence>
                {isEditing && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 w-80"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-sm font-bold uppercase tracking-wider text-white/50">Set Duration</span>
                                <button onClick={() => setIsEditing(false)} className="hover:text-white text-white/50"><X size={16} /></button>
                            </div>

                            {/* Presets */}
                            <div className="grid grid-cols-5 gap-2">
                                {PRESETS.map(p => (
                                    <button
                                        key={p.label}
                                        onClick={() => { setTimeLeft(p.val); setIsEditing(false); }}
                                        className="py-2 rounded-lg bg-white/5 hover:bg-white/20 transition text-xs font-mono"
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Input */}
                            <div className="flex items-center gap-2 justify-center py-2">
                                <div className="flex flex-col items-center">
                                    <input
                                        type="number" min="0" max="99"
                                        value={customH} onChange={e => setCustomH(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-16 h-12 bg-white/5 border border-white/10 rounded-lg text-center text-xl font-mono outline-none focus:border-white/40"
                                    />
                                    <span className="text-[10px] uppercase text-white/30 mt-1">Hrs</span>
                                </div>
                                <span className="text-xl font-mono opacity-50">:</span>
                                <div className="flex flex-col items-center">
                                    <input
                                        type="number" min="0" max="59"
                                        value={customM} onChange={e => setCustomM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                        className="w-16 h-12 bg-white/5 border border-white/10 rounded-lg text-center text-xl font-mono outline-none focus:border-white/40"
                                    />
                                    <span className="text-[10px] uppercase text-white/30 mt-1">Mins</span>
                                </div>
                                <span className="text-xl font-mono opacity-50">:</span>
                                <div className="flex flex-col items-center">
                                    <input
                                        type="number" min="0" max="59"
                                        value={customS} onChange={e => setCustomS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                        className="w-16 h-12 bg-white/5 border border-white/10 rounded-lg text-center text-xl font-mono outline-none focus:border-white/40"
                                    />
                                    <span className="text-[10px] uppercase text-white/30 mt-1">Secs</span>
                                </div>
                            </div>

                            <button
                                onClick={applyCustomTime}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition shadow-lg"
                            >
                                Set Timer
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default TimerBrain;
