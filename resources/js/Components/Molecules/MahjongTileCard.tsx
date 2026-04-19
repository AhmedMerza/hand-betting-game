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
            layout
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={cn(
                "relative w-20 h-28 bg-[#FDFCF0] rounded-lg shadow-[0_4px_0_0_#d1d1b5,0_8px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-2 border border-[#e5e5c5] select-none",
                className
            )}
        >
            {/* Dynamic Value Badge */}
            <div className={cn(
                "absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm",
                isSpecial ? "bg-amber-100 border-amber-400 text-amber-800" : "bg-gray-100 border-gray-300 text-gray-600"
            )}>
                {tile.currentValue}
            </div>

            {/* Tile Name / Rank */}
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                {tile.suit}
            </div>

            {/* Main Symbol */}
            <div className={cn("text-3xl font-black text-center", getSymbolColor())}>
                {tile.rank || tile.name.charAt(0)}
            </div>

            {/* Sub label */}
            <div className="text-[9px] font-medium text-gray-500 truncate w-full text-center">
                {tile.name}
            </div>
        </motion.div>
    );
}
