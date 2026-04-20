import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MahjongTile as TileType } from '@/Stores/useGameStore';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Props {
    tile: TileType;
    className?: string;
}

export default function MahjongTile({ tile, className }: Props) {
    const isSpecial = tile.type !== 'number';
    
    // Determine colors based on tile type/suit
    const getSymbolColor = () => {
        if (tile.suit === 'dragon') {
            if (tile.name.includes('Red')) return 'text-red-600';
            if (tile.name.includes('Green')) return 'text-green-600';
            return 'text-gray-400';
        }
        if (tile.suit === 'wind') return 'text-blue-700';
        if (tile.suit === 'bamboo') return 'text-green-700';
        if (tile.suit === 'character') return 'text-red-700';
        return 'text-blue-800';
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -12 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
                "relative w-24 h-36 bg-[#FDFCF0] rounded-xl shadow-[0_4px_0_0_#d1d1b5,0_8px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-3 border border-[#e5e5c5] select-none",
                className
            )}
        >
            {/* Dynamic Value Badge - Positioned Top Right */}
            <div className={cn(
                "absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 shadow-sm",
                isSpecial ? "bg-amber-200 border-white text-amber-900" : "bg-slate-200 border-white text-slate-700"
            )}>
                {tile.currentValue}
            </div>

            {/* Tile Name / Rank */}
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {tile.type === 'number' ? tile.suit : tile.type}
            </div>

            {/* Main Symbol */}
            <div className={cn("text-5xl font-black text-center", getSymbolColor())}>
                {tile.rank || tile.name.charAt(0)}
            </div>

            {/* Sub label */}
            <div className="text-[10px] font-medium text-gray-500 truncate w-full text-center mb-1">
                {tile.name}
            </div>
        </motion.div>
    );
}
