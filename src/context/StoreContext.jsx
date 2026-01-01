import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    // Theme State
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'rain');

    // Timer State
    const [timerMode, setTimerMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak, timer, stopwatch
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Audio State
    const [volume, setVolume] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    // Todo/Notes State (Persisted)
    const [notes, setNotes] = useState(() => localStorage.getItem('notes') || '');
    const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || []);

    // Geolocation / Timezone
    const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Pomodoro Settings (Persisted)
    const [pomodoroSettings, setPomodoroSettings] = useState(() => JSON.parse(localStorage.getItem('pomodoroSettings')) || {
        focus: 25,
        shortBreak: 5,
        longBreak: 15
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('notes', notes);
    }, [notes]);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroSettings));
    }, [pomodoroSettings]);

    // Initial Geolocation fetch
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                // Here we could use an API to get timezone from lat/long if needed, 
                // but browser usually provides correct local timezone.
                // We'll keep the browser default unless user overrides.
            });
        }
    }, []);


    // Stats State (Persisted)
    const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('stats')) || {
        daily: { sessions: 0, minutes: 0, lastDate: new Date().toDateString() },
        total: { sessions: 0, minutes: 0 }
    });

    // Check if new day
    useEffect(() => {
        const today = new Date().toDateString();
        if (stats.daily.lastDate !== today) {
            setStats(prev => ({
                ...prev,
                daily: { sessions: 0, minutes: 0, lastDate: today }
            }));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('stats', JSON.stringify(stats));
    }, [stats]);

    const updateStats = (minutes) => {
        setStats(prev => ({
            daily: {
                ...prev.daily,
                sessions: prev.daily.sessions + 1,
                minutes: prev.daily.minutes + minutes,
                lastDate: new Date().toDateString()
            },
            total: {
                ...prev.total,
                sessions: prev.total.sessions + 1,
                minutes: prev.total.minutes + minutes
            }
        }));
    };

    const value = {
        theme, setTheme,
        timerMode, setTimerMode,
        timeLeft, setTimeLeft,
        isActive, setIsActive,
        volume, setVolume,
        isPlaying, setIsPlaying,
        currentTrackIndex, setCurrentTrackIndex,
        notes, setNotes,
        todos, setTodos,
        timeZone, setTimeZone,
        pomodoroSettings, setPomodoroSettings,
        stats, updateStats
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};
