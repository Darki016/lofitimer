import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Flame, Coffee, Twitter } from 'lucide-react'; // Twitter as Bird proxy

const SOUNDS = [
    { id: 'rain', label: 'Rain', icon: CloudRain, path: '/assets/sounds/rain.mp3' },
    { id: 'fire', label: 'Fire', icon: Flame, path: '/assets/sounds/fire.mp3' },
    { id: 'cafe', label: 'Cafe', icon: Coffee, path: '/assets/sounds/cafe.mp3' },
    { id: 'birds', label: 'Birds', icon: Twitter, path: '/assets/sounds/birds.mp3' },
];

const AmbientMixer = () => {
    const [volumes, setVolumes] = useState(() => JSON.parse(localStorage.getItem('ambientVolumes')) || {
        rain: 0, fire: 0, cafe: 0, birds: 0
    });
    const audioRefs = useRef({});

    useEffect(() => {
        localStorage.setItem('ambientVolumes', JSON.stringify(volumes));
    }, [volumes]);

    useEffect(() => {
        // Sync audio volumes
        Object.entries(volumes).forEach(([id, vol]) => {
            const audio = audioRefs.current[id];
            if (audio) {
                if (vol > 0 && audio.paused) {
                    audio.play().catch(e => console.log('Audio play failed:', e));
                } else if (vol === 0 && !audio.paused) {
                    audio.pause();
                }
                audio.volume = vol / 100;
            }
        });
    }, [volumes]);

    const handleVolumeChange = (id, val) => {
        setVolumes(prev => ({ ...prev, [id]: parseInt(val) }));
    };

    const toggleSound = (id) => {
        setVolumes(prev => ({
            ...prev,
            [id]: prev[id] > 0 ? 0 : 50 // Toggle between 0 and 50%
        }));
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Ambient Mixer</h3>

            {SOUNDS.map(sound => (
                <div key={sound.id} className="flex items-center gap-4">
                    {/* Icon / Toggle */}
                    <button
                        onClick={() => toggleSound(sound.id)}
                        className={`p-3 rounded-xl transition-all ${volumes[sound.id] > 0
                            ? 'bg-white text-black shadow-lg shadow-white/10'
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <sound.icon size={20} />
                    </button>

                    {/* Slider */}
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                            <span className={volumes[sound.id] > 0 ? 'text-white' : 'text-white/30'}>{sound.label}</span>
                            <span className="text-white/30">{volumes[sound.id]}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={volumes[sound.id]}
                            onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                    </div>

                    {/* Hidden Audio */}
                    <audio
                        ref={el => audioRefs.current[sound.id] = el}
                        src={sound.path}
                        loop
                    />
                </div>
            ))}
        </div>
    );
};

export default AmbientMixer;
