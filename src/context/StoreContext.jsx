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
        pomodoroSettings, setPomodoroSettings
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};
