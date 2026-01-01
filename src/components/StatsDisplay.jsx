import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trophy, Clock, Target, Calendar } from 'lucide-react';

const StatsDisplay = () => {
    const { stats } = useStore();

    const StatCard = ({ icon: Icon, label, value, subLabel, highlight = false }) => (
        <div className={`p-4 rounded-2xl border ${highlight
            ? 'bg-gradient-to-br from-[#6d5afc]/20 to-[#6d5afc]/5 border-[#6d5afc]/30'
            : 'bg-white/5 border-white/10'
            } flex flex-col gap-3 relative overflow-hidden`}>
            {highlight && <div className="absolute top-0 right-0 p-3 opacity-20"><Icon size={48} /></div>}
            <div className={`p-2 w-fit rounded-lg ${highlight ? 'bg-[#6d5afc] text-white' : 'bg-white/10 text-white/70'}`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-3xl font-bold tabular-nums tracking-tight">{value}</h4>
                <p className="text-xs uppercase tracking-wider font-medium opacity-60">{label}</p>
                {subLabel && <p className="text-[10px] text-white/30 mt-1">{subLabel}</p>}
            </div>
        </div>
    );

    const formatTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Daily Highlight */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    icon={Clock}
                    label="Focus Today"
                    value={formatTime(stats.daily.minutes)}
                    highlight={true}
                />
                <StatCard
                    icon={Target}
                    label="Sessions"
                    value={stats.daily.sessions}
                    subLabel="Today's Pomodoros"
                />
            </div>

            {/* Total Stats */}
            <div className="space-y-2">
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest px-1">All Time</h3>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard
                        icon={Trophy}
                        label="Total Sessions"
                        value={stats.total.sessions}
                    />
                    <StatCard
                        icon={Calendar}
                        label="Total Time"
                        value={formatTime(stats.total.minutes)}
                    />
                </div>
            </div>

            {/* Motivation */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/60 italic">
                    "Consistency is the key to mastery."
                </p>
            </div>
        </div>
    );
};

export default StatsDisplay;
