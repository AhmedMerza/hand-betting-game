import React from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    laravelVersion: string;
    phpVersion: string;
}

export default function Welcome({ laravelVersion, phpVersion }: Props) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <Head title="Welcome" />
            
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Hand Betting Game
                </h1>
                <p className="text-gray-600 mb-8">
                    A technical assessment build with Laravel, Inertia, and React.
                </p>

                <div className="space-y-4">
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md">
                        New Game
                    </button>
                    
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-500 italic">No scores yet. Be the first to play!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </div>
            </div>
        </div>
    );
}
