import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const tracks = [
    { title: "Snowy Window", src: "/assets/audios/snowy-window.mp3" },
    { title: "Neon Tokyo", src: "/assets/audios/neon-tokyo.mp3" },
    { title: "Time to Share", src: "/assets/audios/time-to-share.mp3" },
    { title: "Storm Clouds", src: "/assets/audios/storm-clouds.mp3" },
    { title: "Ambient Lofi", src: "/assets/audios/ambient-lofi.mp3" },
    { title: "Chill Vibes", src: "/assets/audios/chill-vibes.mp3" },
    { title: "Coffee Lofi", src: "/assets/audios/coffee-lofi.mp3" },
    { title: "Morning Coffee", src: "/assets/audios/morning-coffee.mp3" },
    { title: "Good Night", src: "/assets/audios/good-night.mp3" },
    { title: "Ambient Study", src: "/assets/audios/ambient-study.mp3" },
    { title: "Just Chill", src: "/assets/audios/lofi-chill.mp3" },
    { title: "Lofi Girl", src: "/assets/audios/lofi-girl.mp3" },
    { title: "Deep Focus", src: "/assets/audios/deep-focus.mp3" },
    { title: "Calm Study", src: "/assets/audios/calm-study.mp3" },
    { title: "Tasty Vibes", src: "/assets/audios/tasty-vibes.mp3" },
    { title: "Missing You", src: "/assets/audios/missing-you.mp3" },
    { title: "Polen", src: "/assets/audios/Polen.mp3" }
];

const AudioPlayer = () => {
    const { volume, setVolume, isPlaying, setIsPlaying, currentTrackIndex, setCurrentTrackIndex } = useStore();
    const audioRef = useRef(new Audio(tracks[0].src));
    const [isLooping, setIsLooping] = useState(true);

    // Handle Track Changes
    useEffect(() => {
        // Only update src if it changed to avoid reloading on re-renders
        if (audioRef.current.src !== window.location.origin + tracks[currentTrackIndex].src.replace(/ /g, '%20')) {
            audioRef.current.src = tracks[currentTrackIndex].src;
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.log("Playback interrupted"));
                }
            }
        }
    }, [currentTrackIndex]);

    // Handle Play/Pause
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play failed:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Handle Loop & Autoplay Next
    useEffect(() => {
        audioRef.current.loop = isLooping;
        const handleEnded = () => {
            if (!isLooping) {
                nextTrack();
            }
        };
        audioRef.current.addEventListener('ended', handleEnded);
        return () => audioRef.current.removeEventListener('ended', handleEnded);
    }, [isLooping]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-96 flex flex-col gap-6 shadow-2xl backdrop-blur-2xl bg-black/40 border-white/10"
        >
            {/* Track Info */}
            <div className="w-full flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="w-full flex justify-center overflow-hidden">
                    <motion.div
                        animate={isPlaying ? { y: -4 } : { y: 0 }}
                        transition={isPlaying ? {
                            repeat: Infinity,
                            repeatType: "mirror",
                            duration: 1.2,
                            ease: "easeInOut"
                        } : { duration: 0.5 }}
                        className="text-white/90 font-mono text-sm font-bold tracking-wide"
                    >
                        {tracks[currentTrackIndex].title}
                    </motion.div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-2">
                <button onClick={() => setIsLooping(!isLooping)} className={`p-2 rounded-full transition ${isLooping ? 'text-white bg-white/10' : 'text-white/30 hover:text-white/60'}`}>
                    <Repeat size={18} />
                </button>

                <div className="flex items-center gap-6">
                    <button onClick={prevTrack} className="hover:text-white text-white/50 transition active:scale-95"><SkipBack size={24} /></button>

                    <button onClick={togglePlay} className="p-4 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-lg shadow-white/20">
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>

                    <button onClick={nextTrack} className="hover:text-white text-white/50 transition active:scale-95"><SkipForward size={24} /></button>
                </div>

                <div className="w-8" /> {/* Spacer for balance */}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 group px-2">
                <Volume2 size={18} className="text-white/50" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                />
            </div>
        </motion.div>
    );
};

export default AudioPlayer;
