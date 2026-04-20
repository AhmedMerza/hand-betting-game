import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { MAX_RESHUFFLES, useGameStore } from '@/Stores/useGameStore';
import MahjongTileCard from '@/Components/Molecules/MahjongTileCard';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function AnimatedNumber({
    value,
    duration = 260,
    className,
}: {
    value: number;
    duration?: number;
    className?: string;
}) {
    const [displayValue, setDisplayValue] = useState(value);
    const previousValueRef = React.useRef(value);

    useEffect(() => {
        const from = previousValueRef.current;
        const to = value;

        if (from === to) {
            setDisplayValue(to);
            return;
        }

        let animationFrame = 0;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const nextValue = Math.round(from + (to - from) * eased);
            setDisplayValue(nextValue);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(tick);
                return;
            }

            previousValueRef.current = to;
        };

        animationFrame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <span className={className}>{displayValue}</span>;
}

export default function Game() {
    const historyEndRef = React.useRef<HTMLDivElement>(null);

    const status = useGameStore((state) => state.status);
    const currentHand = useGameStore((state) => state.currentHand);
    const deck = useGameStore((state) => state.deck);
    const drawPile = useGameStore((state) => state.drawPile);
    const discardPile = useGameStore((state) => state.discardPile);
    const score = useGameStore((state) => state.score);
    const reshuffleCount = useGameStore((state) => state.reshuffleCount);
    const history = useGameStore((state) => state.history);
    const startGame = useGameStore((state) => state.startGame);
    const bet = useGameStore((state) => state.bet);

    const [playerName, setPlayerName] = useState('Guest');
    const [hasSaved, setHasSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [isBetLocked, setIsBetLocked] = useState(false);
    const betUnlockTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if (status === 'idle') {
            setHasSaved(false);
            setPlayerName('Guest');
            setFinalScore(0);
            startGame();
        }
    }, [startGame, status]);

    useEffect(() => {
        if (status === 'gameover') {
            setFinalScore(score);
        }
    }, [status, score]);

    useEffect(() => {
        if (status !== 'betting') {
            setIsBetLocked(false);
        }
    }, [status]);

    useEffect(() => {
        return () => {
            if (betUnlockTimerRef.current) {
                clearTimeout(betUnlockTimerRef.current);
            }
        };
    }, []);

    const getTile = (id: string) => deck.find((t) => t.id === id);
    const handTotal = currentHand.reduce((sum, id) => {
        const tile = getTile(id);
        return sum + (tile?.currentValue || 0);
    }, 0);
    const handKey = currentHand.join('|');
    const handStageWidth = currentHand.length > 0 ? (currentHand.length * 96) + ((currentHand.length - 1) * 16) : 0;
    const handStageOuterWidth = handStageWidth + 36; // extra room for badge overhang + device pixel rounding

    const saveScore = () => {
        if (hasSaved || isSaving) {
            return;
        }

        setIsSaving(true);

        router.post('/scores', {
            player_name: playerName.trim() || 'Guest',
            score: finalScore,
            reshuffles: reshuffleCount,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setHasSaved(true);
                router.get('/');
            },
            onFinish: () => setIsSaving(false),
        });
    };

    const handleBet = (direction: 'lower' | 'higher') => {
        if (status !== 'betting' || isBetLocked) {
            return;
        }

        setIsBetLocked(true);
        bet(direction);

        if (betUnlockTimerRef.current) {
            clearTimeout(betUnlockTimerRef.current);
        }

        betUnlockTimerRef.current = setTimeout(() => {
            setIsBetLocked(false);
        }, 260);
    };

    if (status === 'gameover') {
        return (
            <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center space-y-6">
                    <h1 className="text-6xl font-black text-rose-500 tracking-tighter">GAME OVER</h1>
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
                        <p className="text-slate-400 uppercase tracking-widest text-sm">Final Score: <span className="text-white font-bold">{finalScore}</span></p>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            disabled={hasSaved}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-center text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button
                            onClick={saveScore}
                            disabled={hasSaved || isSaving}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg font-bold transition-all"
                        >
                            {hasSaved ? 'Score Saved!' : (isSaving ? 'Saving...' : 'Save Score')}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setHasSaved(false);
                                setPlayerName('Guest');
                                setFinalScore(0);
                                startGame();
                            }}
                            className="py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all shadow-lg"
                        >
                            Play Again
                        </button>
                        <button onClick={() => router.get('/')} className="py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all shadow-lg">Leaderboard</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#1a3a17] text-white flex flex-col overflow-hidden relative font-sans">
            <Head title="Playing Game" />

            <div className="flex-none flex flex-wrap justify-between items-center gap-3 sm:gap-4 p-3 sm:p-6 lg:p-8 z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Total Score</span>
                    <AnimatedNumber value={score} className="text-3xl sm:text-5xl font-black" />
                </div>
                <div className="flex gap-4 sm:gap-8">
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-400 uppercase">Reshuffles Used</span>
                        <span className="text-base sm:text-xl font-bold">
                            <AnimatedNumber value={reshuffleCount} /> / {MAX_RESHUFFLES}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-400 uppercase">Draw Pile</span>
                        <AnimatedNumber value={drawPile.length} className="text-base sm:text-xl font-bold text-emerald-300" />
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-400 uppercase">Discard Pile</span>
                        <AnimatedNumber value={discardPile.length} className="text-base sm:text-xl font-bold text-amber-300" />
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col lg:flex-row p-2 sm:p-4 lg:p-6 gap-3 sm:gap-4 lg:gap-6 overflow-hidden">
                <div className="w-full lg:w-80 h-44 sm:h-56 lg:h-full bg-black/20 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/5 p-3 sm:p-4 lg:p-6 flex flex-col gap-3 sm:gap-4 overflow-hidden">
                    <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">History</h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                        {(Array.isArray(history) ? [...history].reverse() : []).map((item) => (
                            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`p-3 rounded-xl border ${item.isWin ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-rose-900/20 border-rose-500/20'}`}>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="font-bold text-lg">{item.score}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.isWin ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                        {item.isWin ? 'W' : 'L'}
                                    </span>
                                </div>
                                <div className="flex gap-1 justify-center">
                                    {item.hand.map((tile) => (
                                        <div key={tile.id} className={cn('w-8 h-10 rounded border border-gray-300 flex flex-col items-center justify-center font-bold text-gray-800 shadow-sm relative', tile.type !== 'number' ? 'bg-amber-200' : 'bg-[#FDFCF0]')}>
                                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white text-[6px] flex items-center justify-center shadow-sm">{tile.currentValue}</span>
                                            <span className="text-[8px] uppercase">{tile.name.charAt(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={historyEndRef} />
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-8">
                    <div className="text-center">
                        <h2 className="text-xs uppercase tracking-[0.4em] text-emerald-300/40 font-bold mb-2">Hand Total</h2>
                        <motion.div key={handTotal} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-5xl sm:text-8xl font-black tracking-tighter">
                            {handTotal}
                        </motion.div>
                    </div>

                    <div className="relative bg-black/20 rounded-[24px] sm:rounded-[32px] p-3 sm:p-8 border border-white/5 shadow-inner inline-flex items-center justify-center max-w-full w-full sm:w-fit mx-auto overflow-x-auto">
                        <div className="relative overflow-hidden pt-3 pb-2 px-3 mx-auto scale-95 sm:scale-100 origin-top" style={{ width: handStageOuterWidth, height: 164 }}>
                            <AnimatePresence mode="sync" initial={false}>
                                <motion.div
                                    key={handKey}
                                    initial={{ x: 120, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -120, opacity: 0 }}
                                    transition={{ duration: 0.24, ease: 'easeOut' }}
                                    className="absolute inset-0 flex items-center justify-center gap-4"
                                >
                                    {currentHand.map((id) => {
                                        const tile = getTile(id);
                                        return tile ? <MahjongTileCard key={id} tile={tile} /> : null;
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full sm:w-auto">
                        <button
                            onClick={() => handleBet('lower')}
                            disabled={isBetLocked || status !== 'betting'}
                            className="px-6 sm:px-12 py-3 sm:py-6 bg-[#3d2b2b] hover:bg-[#5a3e3e] border border-rose-500/20 rounded-2xl font-bold uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ↓ Lower
                        </button>
                        <button
                            onClick={() => handleBet('higher')}
                            disabled={isBetLocked || status !== 'betting'}
                            className="px-6 sm:px-12 py-3 sm:py-6 bg-[#2a4d2e] hover:bg-[#3d7042] border border-emerald-500/20 rounded-2xl font-bold uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ↑ Higher
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-black/40 text-center z-20 border-t border-white/5">
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={() => router.get('/')}
                        className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                        Quit Game
                    </button>
                    <button
                        onClick={() => router.get('/tutorial?from=game')}
                        className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                        How To Play
                    </button>
                </div>
            </div>
        </div>
    );
}
