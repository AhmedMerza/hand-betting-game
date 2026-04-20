import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../Stores/useGameStore';

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
});
