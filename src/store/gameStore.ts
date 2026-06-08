import { create } from 'zustand';

export type ElementType = 'Fire' | 'Water' | 'Earth' | 'Wind';

interface GameState {
  screen: 'title' | 'game' | 'gameover' | 'leaderboard';
  score: number;
  cauldron: ElementType[];
  spells: string[];
  health: number;
  setScreen: (screen: GameState['screen']) => void;
  addScore: (points: number) => void;
  addToCauldron: (element: ElementType) => void;
  clearCauldron: () => void;
  takeDamage: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'title',
  score: 0,
  cauldron: [],
  spells: [],
  health: 100,
  setScreen: (screen) => set({ screen }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  addToCauldron: (element) => {
    const current = get().cauldron;
    if (current.length < 3) {
      set({ cauldron: [...current, element] });
    }
  },
  clearCauldron: () => set({ cauldron: [] }),
  takeDamage: (amount) => {
    const nextHealth = Math.max(0, get().health - amount);
    set({ health: nextHealth });
    if (nextHealth <= 0) {
      set({ screen: 'gameover' });
    }
  },
  resetGame: () => set({ score: 0, cauldron: [], spells: [], health: 100, screen: 'game' })
}));
