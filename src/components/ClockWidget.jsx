import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const ClockWidget = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center select-none"
        >
            <h1 className="text-9xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
                {format(time, 'h:mm a')}
            </h1>
            <p className="text-xl font-light tracking-widest uppercase text-white/80 mt-2">
                {format(time, 'EEEE, MMMM do')}
            </p>
        </motion.div>
    );
};

export default ClockWidget;
