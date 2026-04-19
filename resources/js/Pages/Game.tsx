import React, { useEffect, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { useGameStore } from '@/Stores/useGameStore';
import MahjongTileCard from '@/Components/Molecules/MahjongTileCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Game() {
    const { 
        status, 
        currentHand, 
        deck, 
        drawPile, 
        discardPile, 
        score, 
        reshuffleCount,
        startGame, 
        bet 
    } = useGameStore();

    const { post, processing } = useForm({
        score: 0,
        reshuffles: 0,
        player_name: 'Guest'
    });

    const [hasSaved, setHasSaved] = useState(false);

    // Start game on mount if not started
    useEffect(() => {
        if (status === 'idle') {
            startGame();
        }
    }, []);

    // Handle Game Over: Save Score
    useEffect(() => {
        if (status === 'gameover' && !hasSaved) {
            post('/scores', {
                data: { score, reshuffles: reshuffleCount, player_name: 'Guest' },
                onSuccess: () => setHasSaved(true),
                preserveScroll: true
            });
        }
    }, [status]);

    // Helper to get full tile object from ID
    const getTile = (id: string) => deck.find(t => t.id === id);

    const handTotal = currentHand.reduce((sum, id) => {
        const t = getTile(id);
        return sum + (t?.currentValue || 0);
    }, 0);

    if (status === 'gameover') {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <h1 className="text-6xl font-black text-rose-500 tracking-tighter">GAME OVER</h1>
                    
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
                        {processing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                                <p className="text-xs uppercase tracking-widest font-bold animate-pulse">Saving Score...</p>
                            </div>
                        )}
                        <p className="text-slate-400 uppercase tracking-widest text-sm mb-2">Final Score</p>
                        <p className="text-7xl font-bold">{score}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => {
                                setHasSaved(false);
                                startGame();
                            }}
                            disabled={processing}
                            className="py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg"
                        >
                            Play Again
                        </button>
                        <button 
                            onClick={() => router.get('/')}
                            disabled={processing}
                            className="py-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg"
                        >
                            Leaderboard
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a3a17] text-white flex flex-col overflow-hidden relative">
            <Head title="Playing Game" />

            {/* Header / HUD */}
            <div className="p-6 flex justify-between items-start bg-black/20 backdrop-blur-sm border-b border-white/5 z-20">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Total Score</p>
                    <p className="text-4xl font-black tabular-nums tracking-tight">{score}</p>
                </div>
                
                <div className="flex gap-8 text-right">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase text-slate-400">Reshuffles</p>
                        <p className="text-lg font-bold">{reshuffleCount} / 3</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase text-slate-400 font-mono">Draw Pile</p>
                        <p className="text-lg font-bold text-emerald-300 tabular-nums">{drawPile.length}</p>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

                {/* The Hand */}
                <div className="z-10 flex flex-col items-center gap-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-xs uppercase tracking-[0.4em] text-emerald-300/40 font-bold">Hand Total</h2>
                        <motion.div 
                            key={handTotal}
                            initial={{ scale: 1.5, color: '#10b981' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="text-8xl font-black tracking-tighter"
                        >
                            {handTotal}
                        </motion.div>
                    </div>

                    <div className="flex gap-6 p-10 bg-black/20 rounded-[40px] border border-white/5 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] backdrop-blur-md min-h-[220px] min-w-[380px] items-center justify-center">
                        <AnimatePresence mode="popLayout">
                            {currentHand.map((id) => {
                                const tile = getTile(id);
                                return tile ? <MahjongTileCard key={id} tile={tile} /> : null;
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Betting Controls */}
                <div className="mt-16 flex gap-6 z-10">
                    <button 
                        onClick={() => bet('lower')}
                        className="group flex flex-col items-center gap-2 px-10 py-8 bg-rose-950/40 hover:bg-rose-600 border border-rose-500/20 rounded-3xl transition-all shadow-xl active:scale-95"
                    >
                        <span className="text-3xl transition-transform group-hover:-translate-y-1">↓</span>
                        <span className="font-bold uppercase tracking-widest text-xs">Bet Lower</span>
                    </button>

                    <button 
                        onClick={() => bet('higher')}
                        className="group flex flex-col items-center gap-2 px-10 py-8 bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-500/20 rounded-3xl transition-all shadow-xl active:scale-95"
                    >
                        <span className="text-3xl transition-transform group-hover:-translate-y-1">↑</span>
                        <span className="font-bold uppercase tracking-widest text-xs">Bet Higher</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 text-center z-20 border-t border-white/5">
                <button 
                    onClick={() => router.get('/')}
                    className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                    Quit Game
                </button>
            </div>
        </div>
    );
}
