import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
    id: number;
    player_name: string;
    score: number;
    reshuffles: number;
    created_at: string;
}

interface Props {
    laravelVersion: string;
    phpVersion: string;
    leaderboard: LeaderboardEntry[];
}

export default function Welcome({ laravelVersion, phpVersion, leaderboard }: Props) {
    return (
        <div className="min-h-screen bg-[#1a3a17] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Head title="Welcome" />

            {/* Table felt texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-2xl w-full bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-12 text-center z-10"
            >
                <div className="mb-8 flex justify-center gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-12 bg-[#FDFCF0] rounded-md border border-gray-300 shadow-sm" />
                    ))}
                </div>

                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                    HAND BETTING <span className="text-emerald-400">GAME</span>
                </h1>
                <p className="text-emerald-100/60 mb-12 text-lg">
                    A technical assessment build with Laravel, Inertia, and React.
                </p>

                <div className="space-y-6">
                    <Link 
                        href="/game"
                        className="block w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] transform hover:-translate-y-1 active:translate-y-0"
                    >
                        START NEW GAME
                    </Link>
                    
                    <div className="mt-16 text-left">
                        <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Top 5 Leaderboard</h2>
                        <div className="bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                            {leaderboard && leaderboard.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/5 text-emerald-100/40 text-[10px] uppercase tracking-tighter">
                                            <th className="px-4 py-3 text-left">Player</th>
                                            <th className="px-4 py-3 text-center">Score</th>
                                            <th className="px-4 py-3 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {leaderboard.map((entry, idx) => (
                                            <tr key={entry.id} className="text-emerald-50">
                                                <td className="px-4 py-3 font-medium flex items-center gap-2">
                                                    <span className="text-emerald-500/50 w-4">{idx + 1}.</span>
                                                    {entry.player_name}
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold text-emerald-400">{entry.score}</td>
                                                <td className="px-4 py-3 text-right text-[10px] text-emerald-100/30">
                                                    {new Date(entry.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-emerald-100/40 italic text-sm">No scores yet. Be the first to play!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest text-emerald-100/20">
                    Laravel v{laravelVersion} • PHP v{phpVersion}
                </div>
            </motion.div>
        </div>
    );
}
