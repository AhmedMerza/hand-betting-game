import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface TutorialProps {
    from?: 'landing' | 'game';
}

export default function Tutorial() {
    const { from = 'landing' } = usePage<TutorialProps>().props;
    const backHref = from === 'game' ? '/game' : '/';

    return (
        <div className="min-h-screen bg-[#102e12] text-white p-4 sm:p-6 lg:p-8">
            <Head title="How To Play" />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/25 border border-white/10 rounded-3xl p-5 sm:p-8 lg:p-10 backdrop-blur-md"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                                How The Game Works
                            </h1>
                            <p className="text-emerald-100/70 mt-2">
                                Quick guide to values, colors, scoring, reshuffles, and game-over rules.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href={backHref}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold"
                            >
                                Back
                            </Link>
                            <Link
                                href="/game"
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold"
                            >
                                Skip To Game
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm uppercase tracking-widest text-emerald-300 font-bold mb-3">Tile Types & Colors</h2>
                            <ul className="space-y-2 text-sm text-emerald-50/90">
                                <li><span className="font-bold text-emerald-300">Bamboo:</span> number tiles shown in green.</li>
                                <li><span className="font-bold text-blue-300">Dot:</span> number tiles shown in blue.</li>
                                <li><span className="font-bold text-rose-300">Character:</span> number tiles shown in red.</li>
                                <li><span className="font-bold text-sky-300">Winds:</span> special tiles, blue letter/symbol.</li>
                                <li><span className="font-bold text-amber-300">Dragons:</span> special tiles (red/green/white variants).</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm uppercase tracking-widest text-emerald-300 font-bold mb-3">Tile Values</h2>
                            <ul className="space-y-2 text-sm text-emerald-50/90">
                                <li><span className="font-bold">Number tiles:</span> value equals face value (1 to 9).</li>
                                <li><span className="font-bold">Winds/Dragons:</span> start at value 5.</li>
                                <li><span className="font-bold">Value badge:</span> top-right circle on each card shows current value.</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm uppercase tracking-widest text-emerald-300 font-bold mb-3">Round Flow</h2>
                            <ol className="space-y-2 text-sm text-emerald-50/90 list-decimal pl-5">
                                <li>You see a current hand of 3 tiles and its total.</li>
                                <li>Choose <span className="font-bold">Bet Higher</span> or <span className="font-bold">Bet Lower</span>.</li>
                                <li>A new 3-tile hand is drawn and compared with the previous total.</li>
                                <li>History stores each previous hand with its total and win/loss result.</li>
                            </ol>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h2 className="text-sm uppercase tracking-widest text-emerald-300 font-bold mb-3">Scoring & Scaling</h2>
                            <ul className="space-y-2 text-sm text-emerald-50/90">
                                <li><span className="font-bold text-emerald-300">Win:</span> +10 score.</li>
                                <li><span className="font-bold text-rose-300">Loss:</span> -5 score (not below 0).</li>
                                <li>If a <span className="font-bold">wind/dragon</span> is in the drawn hand:
                                    <span className="block">Win round: tile value +1</span>
                                    <span className="block">Loss round: tile value -1</span>
                                </li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-black/20 p-5 lg:col-span-2">
                            <h2 className="text-sm uppercase tracking-widest text-emerald-300 font-bold mb-3">Draw, Discard, Reshuffle, Game Over</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-50/90">
                                <ul className="space-y-2">
                                    <li><span className="font-bold">Draw Pile:</span> cards left to draw for next hands.</li>
                                    <li><span className="font-bold">Discard Pile:</span> previous hands moved here.</li>
                                    <li><span className="font-bold">Reshuffles Used:</span> shown in HUD, max 2 successful reshuffles.</li>
                                </ul>
                                <ul className="space-y-2">
                                    <li><span className="font-bold">Reshuffle rule:</span> when draw pile is short, a fresh deck is added and shuffled with discard.</li>
                                    <li><span className="font-bold">Game Over if:</span> any tile reaches value 0 or 10.</li>
                                    <li><span className="font-bold">Game Over if:</span> draw pile runs out for the 3rd time.</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/game"
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-lg tracking-wide shadow-xl"
                        >
                            Start Game
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
