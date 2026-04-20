import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '../Stores/useGameStore';

const getState = () => useGameStore.getState();

const findIds = (predicate: (tile: (typeof getState extends () => infer T ? T : never)['deck'][number]) => boolean, count: number) => {
    return getState().deck.filter(predicate).slice(0, count).map((tile) => tile.id);
};

describe('useGameStore Logic', () => {
    beforeEach(() => {
        useGameStore.getState().resetGame();
    });

    it('should generate a full deck of 136 tiles on start', () => {
        const store = useGameStore.getState();
        store.startGame();
        
        const state = useGameStore.getState();
        expect(state.deck.length).toBe(136);
        expect(state.drawPile.length).toBe(133); // 136 - 3 in hand
        expect(state.currentHand.length).toBe(3);
    });

    it('should scale non-number tiles correctly on a win', () => {
        const store = useGameStore.getState();
        store.startGame();

        // Put a known special tile at the front of drawPile so it appears in nextHand.
        const stateBefore = useGameStore.getState();
        const nonNumberTileId = stateBefore.drawPile.find((id) => {
            const tile = stateBefore.deck.find((candidate) => candidate.id === id);
            return tile?.type !== 'number';
        });

        if (!nonNumberTileId) {
            return;
        }

        useGameStore.setState((state) => ({
            drawPile: [
                nonNumberTileId,
                ...state.drawPile.filter((id) => id !== nonNumberTileId),
            ],
        }));

        const tileBefore = stateBefore.deck.find((tile) => tile.id === nonNumberTileId);
        const initialVal = tileBefore!.currentValue;

        store.bet('higher');

        const stateAfter = useGameStore.getState();
        const updatedTile = stateAfter.deck.find((tile) => tile.id === nonNumberTileId);

        // Any special tile in nextHand should be adjusted by +1 or -1.
        expect(updatedTile!.currentValue).not.toBe(initialVal);
    });

    it('should trigger game over if a tile reaches 10', () => {
        const store = useGameStore.getState();
        store.startGame();
        
        // Manually set a tile in the hand to 9 and force a win
        const state = useGameStore.getState();
        const firstTileId = state.currentHand[0];
        
        // We simulate the scaling logic manually for this unit test 
        // to prove the "Game Over" trigger works.
        useGameStore.setState(s => ({
            deck: s.deck.map(t => t.id === firstTileId ? { ...t, currentValue: 10, type: 'dragon' } : t)
        }));

        // Trigger a bet to run the game-over check
        store.bet('higher');

        expect(useGameStore.getState().status).toBe('gameover');
    });

    it('should trigger game over if a special tile reaches 0 after a loss', () => {
        const store = getState();
        store.startGame();

        const highCurrentHand = findIds((tile) => tile.type === 'number' && (tile.rank ?? 0) >= 8, 3);
        const lowNextNumbers = findIds((tile) => tile.type === 'number' && (tile.rank ?? 0) <= 2 && !highCurrentHand.includes(tile.id), 2);
        const specialNextTileId = findIds((tile) => tile.type !== 'number' && !highCurrentHand.includes(tile.id), 1)[0];

        useGameStore.setState((state) => ({
            currentHand: highCurrentHand,
            drawPile: [specialNextTileId, ...lowNextNumbers, ...state.drawPile.filter((id) => ![specialNextTileId, ...lowNextNumbers].includes(id))],
            deck: state.deck.map((tile) => tile.id === specialNextTileId ? { ...tile, currentValue: 1 } : tile),
        }));

        store.bet('higher');

        const updatedSpecial = getState().deck.find((tile) => tile.id === specialNextTileId);
        expect(updatedSpecial?.currentValue).toBe(0);
        expect(getState().status).toBe('gameover');
    });

    it('should implement the "Growing Universe" reshuffle', () => {
        const store = useGameStore.getState();
        store.startGame();
        
        // Manually empty the draw pile
        useGameStore.setState({ drawPile: [] });

        // Trigger a bet which should force a reshuffle
        store.bet('higher');

        const state = useGameStore.getState();
        // 136 (original) + 136 (new deck) = 272 tiles total
        expect(state.deck.length).toBe(272);
        expect(state.reshuffleCount).toBe(1);
    });

    it('should end the game when the draw pile runs out for the third time', () => {
        const store = getState();
        store.startGame();

        useGameStore.setState({
            drawPile: [],
            reshuffleCount: 2,
        });

        store.bet('higher');

        expect(getState().status).toBe('gameover');
    });

    it('should not let score drop below zero on a losing round', () => {
        const store = getState();
        store.startGame();

        const highCurrentHand = findIds((tile) => tile.type === 'number' && (tile.rank ?? 0) >= 8, 3);
        const lowNextHand = findIds((tile) => tile.type === 'number' && (tile.rank ?? 0) <= 2 && !highCurrentHand.includes(tile.id), 3);

        useGameStore.setState((state) => ({
            score: 0,
            currentHand: highCurrentHand,
            drawPile: [...lowNextHand, ...state.drawPile.filter((id) => !lowNextHand.includes(id))],
        }));

        store.bet('higher');

        expect(getState().score).toBe(0);
    });

    it('should keep deck IDs unique after a reshuffle', () => {
        const store = getState();
        store.startGame();

        useGameStore.setState({ drawPile: [] });

        store.bet('higher');

        const ids = getState().deck.map((tile) => tile.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('should store a snapshot of the previous hand in history', () => {
        const store = getState();
        store.startGame();

        const previousHandIds = [...getState().currentHand];

        store.bet('higher');

        const historyEntry = getState().history[0];
        expect(historyEntry.hand).toHaveLength(3);
        expect(historyEntry.hand.map((tile) => tile.id)).toEqual(previousHandIds);
    });
});
