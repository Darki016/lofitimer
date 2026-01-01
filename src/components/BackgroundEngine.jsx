
import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';

const themes = {
    rain: '/assets/videos/lofi-anime-girl-watching-the-rain-with-cat-moewalls-com.mp4',
    bedroom: '/assets/videos/mylivewallpapers.com-Study-Session.mp4',
    city: '/assets/videos/a-quiet-night-in-a-rainy-pixel-city-moewalls-com.mp4',
    school: '/assets/videos/anime-school-girl-broken-heart-pixel-moewalls-com.mp4',
    furry: '/assets/videos/furry-lofi-study-break-moewalls-com.mp4',
    midoriya: '/assets/videos/izuku-midoriya-study-my-hero-academia-moewalls-com.mp4',
    sasuke: '/assets/videos/mylivewallpapers.com-Sasuke-Studying.mp4',
    ukinami: '/assets/videos/ukinami-yuzuhas-pixelated-lofi-moewalls-com.mp4',
};

const BackgroundEngine = () => {
    const { theme } = useStore();
    const videoRefs = useRef({});

    useEffect(() => {
        // Manage playback efficiently: Only play the active one, pause others
        Object.keys(themes).forEach(key => {
            const video = videoRefs.current[key];
            if (video) {
                if (key === theme) {
                    video.play().catch(e => console.log('Play prevented:', e));
                } else {
                    video.pause();
                }
            }
        });
    }, [theme]);

    return (
        <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-black">
            {Object.entries(themes).map(([key, src]) => (
                <div
                    key={key}
                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                    style={{
                        opacity: theme === key ? 1 : 0,
                        zIndex: theme === key ? 1 : 0
                    }}
                >
                    <video
                        ref={el => videoRefs.current[key] = el}
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                        src={src}
                    />
                </div>
            ))}

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10" />
        </div>
    );
};

export default BackgroundEngine;

