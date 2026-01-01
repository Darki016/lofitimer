import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    return (
        <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        src={themes[theme]}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
    );
};

export default BackgroundEngine;
