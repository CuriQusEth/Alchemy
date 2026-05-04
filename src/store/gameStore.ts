import { create } from 'zustand';

export interface Ingredient {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface Potion {
  id: string;
  name: string;
  color: string;
  value: number;
  description: string;
  isMasterwork?: boolean;
}

interface GameState {
  inventory: Ingredient[];
  cauldron: Ingredient[];
  discoveredRecipes: string[];
  potionsShelved: Potion[];
  score: number;
  addIngredientToCauldron: (ing: Ingredient) => void;
  mixCauldron: () => Potion | null;
  clearCauldron: () => void;
  awardPoints: (points: number) => void;
  undoLastIngredient: () => void;
}

// Some dummy data
export const INGREDIENTS: Record<string, Ingredient> = {
  fire: { id: 'fire', name: 'Fire Essence', color: '#ef4444', icon: '🔥', description: 'Hot to the touch.' },
  water: { id: 'water', name: 'Crystal Water', color: '#3b82f6', icon: '💧', description: 'Pure and calming.' },
  moon: { id: 'moon', name: 'Moon Petals', color: '#c084fc', icon: '🌸', description: 'Glows in the dark.' },
  shadow: { id: 'shadow', name: 'Shadow Root', color: '#1f2937', icon: '🪹', description: 'Absorbs light.' },
  earth: { id: 'earth', name: 'Earth Dust', color: '#854d0e', icon: '🪨', description: 'Heavy and grounded.' },
  star: { id: 'star', name: 'Star Fragment', color: '#fef08a', icon: '⭐', description: 'A piece of heaven.' },
};

// Recipes map: ingredient1.id + '-' + ingredient2.id => Potion (ids sorted alphabetically for map key)
const RECIPES: Record<string, Potion> = {
  'fire-water': { id: 'steam', name: 'Steam Potion', color: '#94a3b8', value: 10, description: 'Clouds in a bottle.' },
  'moon-shadow': { id: 'visions', name: 'Night Sight', color: '#4c1d95', value: 50, description: 'See the unseen.' },
  'earth-fire': { id: 'magma', name: 'Magma Brew', color: '#b91c1c', value: 25, description: 'Sizzling hot.' },
  'star-water': { id: 'starlight', name: 'Starlight Brew', color: '#fde047', value: 100, description: 'Liquid brilliance.', isMasterwork: true },
  'earth-moon': { id: 'golem', name: 'Golem Sap', color: '#3f6212', value: 30, description: 'Toughens skin.' },
  'fire-star': { id: 'cosmic', name: 'Cosmic Flare', color: '#f97316', value: 200, description: 'Unleashes the stars.', isMasterwork: true }
};

export const useGameStore = create<GameState>((set, get) => ({
  inventory: Object.values(INGREDIENTS),
  cauldron: [],
  discoveredRecipes: [],
  potionsShelved: [],
  score: 0,
  addIngredientToCauldron: (ing) => {
    const current = get().cauldron;
    if (current.length < 2) {
      set({ cauldron: [...current, ing] });
    }
  },
  undoLastIngredient: () => {
    const current = get().cauldron;
    if (current.length > 0) {
      set({ cauldron: current.slice(0, -1) });
    }
  },
  mixCauldron: () => {
    const state = get();
    if (state.cauldron.length !== 2) return null;
    
    // Sort ids to match recipe keys
    const ids = [state.cauldron[0].id, state.cauldron[1].id].sort();
    const recipeKey = `${ids[0]}-${ids[1]}`;
    const result = RECIPES[recipeKey];

    if (result) {
      const isNew = !state.discoveredRecipes.includes(result.id);
      set((s) => ({
        discoveredRecipes: isNew ? [...s.discoveredRecipes, result.id] : s.discoveredRecipes,
        potionsShelved: [...s.potionsShelved, result],
        score: s.score + result.value * (isNew ? 2 : 1), // Bonus for discovering
        cauldron: [],
      }));
      return result;
    } else {
      // Failed recipe (sludge)
      const sludge: Potion = { id: 'sludge', name: 'Sludge', color: '#4b5563', value: 1, description: 'A failed experiment.' };
      set((s) => ({
        potionsShelved: [...s.potionsShelved, sludge],
        cauldron: [],
        score: s.score + 1
      }));
      return sludge;
    }
  },
  clearCauldron: () => set({ cauldron: [] }),
  awardPoints: (pts) => set((s) => ({ score: s.score + pts })),
}));
