import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MahjongTileCard from '@/Components/Molecules/MahjongTileCard';
import type { MahjongTile } from '@/Stores/useGameStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TutorialProps {
    from?: 'landing' | 'game';
}

const exampleTiles: MahjongTile[] = [
    { id: 'tutorial-bamboo-5', type: 'number', suit: 'bamboo', rank: 5, name: '5 Bamboo', initialValue: 5, currentValue: 5 },
    { id: 'tutorial-dot-2', type: 'number', suit: 'dot', rank: 2, name: '2 Dot', initialValue: 2, currentValue: 2 },
    { id: 'tutorial-char-7', type: 'number', suit: 'character', rank: 7, name: '7 Character', initialValue: 7, currentValue: 7 },
    { id: 'tutorial-wind-east', type: 'wind', suit: 'wind', name: 'East Wind', initialValue: 5, currentValue: 6 },
    { id: 'tutorial-dragon-red', type: 'dragon', suit: 'dragon', name: 'Red Dragon', initialValue: 5, currentValue: 4 },
];

export default function Tutorial() {
    const { from = 'landing' } = usePage<TutorialProps>().props;
    const backHref = from === 'game' ? '/game' : '/';

    return (
        <div className="min-h-screen bg-[#102e12] text-white p-2 sm:p-4">
            <Head title="How To Play" />

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-7xl mx-auto bg-black/25 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 backdrop-blur-md"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-black tracking-tight">How To Play</h1>
                        <p className="text-emerald-100/70 text-xs sm:text-sm">Everything you need in one screen.</p>
                    </div>
                    <div className={cn("grid gap-2 w-full sm:w-auto", from === 'game' ? "grid-cols-1" : "grid-cols-2 sm:flex")}>
                        <Link href={backHref} className="text-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold">
                            {from === 'game' ? 'Back to Game' : 'Back'}
                        </Link>
                        {from !== 'game' && (
                            <Link href="/game" className="text-center px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs sm:text-sm font-semibold">
                                Start Game
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 text-xs sm:text-sm items-start">
                    <section className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 h-fit">
                        <h2 className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold mb-2">Tile Colors</h2>
                        <ul className="space-y-1.5 text-emerald-50/90">
                            <li><span className="font-bold text-emerald-300">Bamboo</span> = green number</li>
                            <li><span className="font-bold text-blue-300">Dot</span> = blue number</li>
                            <li><span className="font-bold text-rose-300">Character</span> = red number</li>
                            <li><span className="font-bold text-sky-300">Wind</span> = special blue symbol</li>
                            <li><span className="font-bold text-amber-300">Dragon</span> = special tile</li>
                        </ul>
                    </section>

                    <section className="lg:col-span-8 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 h-fit">
                        <h2 className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold mb-2">Tile Value Examples</h2>
                        <p className="text-emerald-100/80 text-xs mb-2">Number tiles keep face value. Winds/Dragons start at 5. Badge is current value.</p>
                        <div className="flex flex-nowrap sm:flex-wrap items-start gap-2 sm:gap-4 pt-2 pb-2 px-1 sm:px-2 overflow-x-auto sm:overflow-visible snap-x snap-mandatory">
                            {exampleTiles.map((tile) => (
                                <div key={tile.id} className="shrink-0 snap-start scale-[0.48] sm:scale-[0.58] origin-top-left">
                                    <MahjongTileCard tile={tile} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 h-fit">
                        <h2 className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold mb-2">Round Flow</h2>
                        <ol className="space-y-1.5 list-decimal pl-5 text-emerald-50/90">
                            <li>Current hand has 3 tiles.</li>
                            <li>Choose <span className="font-bold">Higher</span> or <span className="font-bold">Lower</span>.</li>
                            <li>Next 3-tile hand is drawn and compared.</li>
                            <li>Previous hand moves to history.</li>
                        </ol>
                    </section>

                    <section className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 h-fit">
                        <h2 className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold mb-2">Scoring</h2>
                        <ul className="space-y-1.5 text-emerald-50/90">
                            <li><span className="font-bold text-emerald-300">Win</span>: +10</li>
                            <li><span className="font-bold text-rose-300">Loss</span>: -5 (min 0)</li>
                            <li>Special tile in drawn hand:
                                <span className="block">Win -&gt; value +1</span>
                                <span className="block">Loss -&gt; value -1</span>
                            </li>
                        </ul>
                    </section>

                    <section className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 h-fit">
                        <h2 className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold mb-2">Deck & Game Over</h2>
                        <ul className="space-y-1.5 text-emerald-50/90">
                            <li>HUD shows <span className="font-bold">Draw</span> and <span className="font-bold">Discard</span> piles.</li>
                            <li>When draw is short, reshuffle with a fresh deck + discard.</li>
                            <li>Game over if any tile hits <span className="font-bold">0 or 10</span>.</li>
                            <li>Game over on draw exhaustion for the <span className="font-bold">3rd time</span>.</li>
                        </ul>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
