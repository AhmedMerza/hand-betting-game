import { create } from 'zustand';

export type GameStatus = 'idle' | 'betting' | 'dealing' | 'evaluating' | 'gameover';
export type TileType = 'number' | 'wind' | 'dragon';
export type Suit = 'bamboo' | 'dot' | 'character' | 'wind' | 'dragon';

export interface MahjongTile {
    id: string;
    type: TileType;
    suit: Suit;
    rank?: number; // 1-9 for numbers
    name: string;
    initialValue: number;
    currentValue: number;
}

export interface HistoryEntry {
    id: string;
    hand: MahjongTile[];
    score: number;
    isWin: boolean;
}

interface GameState {
    // State
    status: GameStatus;
    deck: MahjongTile[];
    drawPile: string[]; // IDs
    discardPile: string[]; // IDs
    currentHand: string[]; // IDs
    history: HistoryEntry[];
    score: number;
    reshuffleCount: number;

    // Actions
    startGame: () => void;
    bet: (direction: 'higher' | 'lower') => void;
    resetGame: () => void;
}

// Helper to generate the initial deck
const generateDeck = (instance = 0): MahjongTile[] => {
    const tiles: MahjongTile[] = [];
    const suits: Suit[] = ['bamboo', 'dot', 'character'];
    
    // 1. Number Tiles (1-9 in 3 suits, 4 of each)
    suits.forEach(suit => {
        for (let rank = 1; rank <= 9; rank++) {
            for (let i = 0; i < 4; i++) {
                tiles.push({
                    id: `${instance}-${suit}-${rank}-${i}`,
                    type: 'number',
                    suit: suit,
                    rank: rank,
                    name: `${rank} ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
                    initialValue: rank,
                    currentValue: rank
                });
            }
        }
    });

    // 2. Winds (4 types, 4 of each)
    const winds: Suit[] = ['wind'];
    const windNames = ['North', 'South', 'East', 'West'];
    windNames.forEach(name => {
        for (let i = 0; i < 4; i++) {
            tiles.push({
                id: `${instance}-wind-${name}-${i}`,
                type: 'wind',
                suit: 'wind',
                name: `${name} Wind`,
                initialValue: 5,
                currentValue: 5
            });
        }
    });

    // 3. Dragons (3 types, 4 of each)
    const dragonNames = ['Red', 'Green', 'White'];
    dragonNames.forEach(name => {
        for (let i = 0; i < 4; i++) {
            tiles.push({
                id: `${instance}-dragon-${name}-${i}`,
                type: 'dragon',
                suit: 'dragon',
                name: `${name} Dragon`,
                initialValue: 5,
                currentValue: 5
            });
        }
    });

    return tiles;
};

export const useGameStore = create<GameState>((set, get) => ({
    status: 'idle',
    deck: [],
    drawPile: [],
    discardPile: [],
    currentHand: [],
    history: [],
    score: 0,
    reshuffleCount: 0,

    startGame: () => {
        const newDeck = generateDeck(0);
        const shuffledIds = [...newDeck].map(t => t.id).sort(() => Math.random() - 0.5);
        
        // Initial hand
        const initialHand = shuffledIds.slice(0, 3);
        const remainingDrawPile = shuffledIds.slice(3);

        set({
            status: 'betting',
            deck: newDeck,
            drawPile: remainingDrawPile,
            discardPile: [],
            currentHand: initialHand,
            score: 0,
            reshuffleCount: 0,
            history: []
        });
    },

    bet: (direction) => {
        let { status, currentHand, drawPile, discardPile, deck, score, history, reshuffleCount } = get();
        
        if (status !== 'betting') return;

        // 1. Handle Reshuffling ("Growing Universe") BEFORE drawing if needed
        let updatedDeck = [...deck];
        let updatedDrawPile = [...drawPile];
        let updatedDiscardPile = [...discardPile];
        let updatedReshuffleCount = reshuffleCount;

        if (updatedDrawPile.length < 3) {
            if (updatedReshuffleCount >= 2) { // 3rd time draw pile runs out
                set({ status: 'gameover' });
                return;
            }
            
            const freshDeck = generateDeck(updatedReshuffleCount + 1);
            const freshIds = freshDeck.map(t => t.id);
            updatedDeck = [...updatedDeck, ...freshDeck];
            // Combine current discard pile with the fresh deck
            updatedDrawPile = [...updatedDrawPile, ...updatedDiscardPile, ...freshIds].sort(() => Math.random() - 0.5);
            updatedDiscardPile = [];
            updatedReshuffleCount += 1;
        }

        // 2. Calculate current hand value
        const currentTotal = currentHand.reduce((sum, id) => {
            const tile = updatedDeck.find(t => t.id === id);
            return sum + (tile?.currentValue || 0);
        }, 0);

        // 3. Draw next hand
        const nextHand = updatedDrawPile.slice(0, 3);
        updatedDrawPile = updatedDrawPile.slice(3);

        // 4. Calculate next hand value
        const nextTotal = nextHand.reduce((sum, id) => {
            const tile = updatedDeck.find(t => t.id === id);
            return sum + (tile?.currentValue || 0);
        }, 0);

        // 5. Evaluate Win/Loss
        const isWin = direction === 'higher' ? nextTotal > currentTotal : nextTotal < currentTotal;
        const newScore = isWin ? score + 10 : Math.max(0, score - 5);

        // 6. Apply Dynamic Scaling
        updatedDeck = updatedDeck.map(tile => {
            if (nextHand.includes(tile.id) && tile.type !== 'number') {
                const adjustment = isWin ? 1 : -1;
                return { ...tile, currentValue: Math.max(0, Math.min(10, tile.currentValue + adjustment)) };
            }
            return tile;
        });

        // 7. Check Game Over (Any tile reaches 0 or 10)
        const hasReachedLimit = updatedDeck.some(t => t.currentValue <= 0 || t.currentValue >= 10);
        
        updatedDiscardPile = [...updatedDiscardPile, ...currentHand];

        // Store a snapshot of the current hand for history.
        const handSnapshot = currentHand
            .map((id) => updatedDeck.find((tile) => tile.id === id))
            .filter((tile): tile is MahjongTile => Boolean(tile))
            .map((tile) => ({ ...tile }));

        set({
            status: hasReachedLimit ? 'gameover' : 'betting',
            currentHand: nextHand,
            drawPile: updatedDrawPile,
            discardPile: updatedDiscardPile,
            deck: updatedDeck,
            score: newScore,
            reshuffleCount: updatedReshuffleCount,
            history: [{
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                hand: handSnapshot,
                score: currentTotal,
                isWin,
            }, ...history]
        });
    },

    resetGame: () => set({
        status: 'idle',
        deck: [],
        drawPile: [],
        discardPile: [],
        currentHand: [],
        history: [],
        score: 0,
        reshuffleCount: 0,
    })
}));
