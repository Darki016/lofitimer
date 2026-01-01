import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import { Leaf, Timer } from 'lucide-react';

const ModeToggle = () => {
    const { timerMode, setTimerMode } = useStore();

    const modes = [
        { id: 'pomodoro', icon: Leaf, label: 'Pomodoro' },
        { id: 'stopwatch', icon: Timer, label: 'Stopwatch' } // Using 'stopwatch' for the second option as requested
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
            {modes.map((mode) => {
                const isActive = timerMode === mode.id;
                return (
                    <button
                        key={mode.id}
                        onClick={() => setTimerMode(mode.id)}
                        className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-mode-pill"
                                className="absolute inset-0 bg-[#6d5afc] rounded-full shadow-[0_0_15px_rgba(109,90,252,0.5)]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <div className="relative z-10">
                            <mode.icon size={20} fill={isActive ? "currentColor" : "none"} />
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ModeToggle;
