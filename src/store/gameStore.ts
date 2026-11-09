import { create } from 'zustand';

export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  color: string;
  element?: string;
}

export interface Potion {
  id: string;
  name: string;
  description: string;
  color: string;
  value: number;
  isMasterwork?: boolean;
}

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'fire_crystal', name: 'Fire Crystal', icon: '🔥', color: '#f97316', element: 'Fire' },
  { id: 'water_essence', name: 'Water Essence', icon: '💧', color: '#06b6d4', element: 'Water' },
  { id: 'earth_root', name: 'Earth Root', icon: '🌿', color: '#10b981', element: 'Earth' },
  { id: 'wind_feather', name: 'Wind Feather', icon: '🌪️', color: '#a855f7', element: 'Wind' },
  { id: 'solar_flare', name: 'Solar Flare', icon: '☀️', color: '#eab308', element: 'Fire' },
  { id: 'void_matter', name: 'Void Matter', icon: '🔮', color: '#6366f1', element: 'Void' },
];

export const RECIPES: Record<string, Potion> = {
  'fire_crystal+water_essence': {
    id: 'steam_elixir',
    name: 'Steam Elixir',
    description: 'Hot vapor with blinding speed in the Denim arena.',
    color: '#38bdf8',
    value: 120,
    isMasterwork: false,
  },
  'fire_crystal+earth_root': {
    id: 'magma_core',
    name: 'Magma Core',
    description: 'Molten earth infused with volatile thermal energy.',
    color: '#ef4444',
    value: 150,
    isMasterwork: true,
  },
  'fire_crystal+wind_feather': {
    id: 'inferno_gale',
    name: 'Inferno Gale',
    description: 'A storm of embers that scorches target arenas.',
    color: '#f59e0b',
    value: 180,
    isMasterwork: false,
  },
  'water_essence+earth_root': {
    id: 'vitality_bloom',
    name: 'Vitality Bloom',
    description: 'Restorative essence of deep ancient roots.',
    color: '#22c55e',
    value: 140,
    isMasterwork: false,
  },
  'water_essence+wind_feather': {
    id: 'frost_mist',
    name: 'Frost Mist',
    description: 'Freezing chill that locks rival casters in place.',
    color: '#0ea5e9',
    value: 160,
    isMasterwork: false,
  },
  'earth_root+wind_feather': {
    id: 'dust_cyclone',
    name: 'Dust Cyclone',
    description: 'A blinding vortex of desert sands.',
    color: '#d97706',
    value: 130,
    isMasterwork: false,
  },
  'fire_crystal+solar_flare': {
    id: 'solar_supernova',
    name: 'Solar Supernova',
    description: 'Masterwork celestial burst on Base Mainnet.',
    color: '#fbbf24',
    value: 300,
    isMasterwork: true,
  },
  'wind_feather+void_matter': {
    id: 'rift_walker',
    name: 'Rift Walker Draught',
    description: 'Phase through space with 200ms Denim block precision.',
    color: '#8b5cf6',
    value: 250,
    isMasterwork: true,
  },
};

export interface GameState {
  score: number;
  cauldron: Ingredient[];
  inventory: Ingredient[];
  discoveredRecipes: string[];
  potionsShelved: Potion[];
  health: number;
  screen: 'title' | 'game' | 'gameover' | 'leaderboard';
  
  // Actions
  addIngredientToCauldron: (ingredient: Ingredient) => void;
  undoLastIngredient: () => void;
  clearCauldron: () => void;
  mixCauldron: () => Potion;
  addScore: (points: number) => void;
  takeDamage: (amount: number) => void;
  setScreen: (screen: 'title' | 'game' | 'gameover' | 'leaderboard') => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  cauldron: [],
  inventory: INITIAL_INGREDIENTS,
  discoveredRecipes: [],
  potionsShelved: [],
  health: 100,
  screen: 'title',

  addIngredientToCauldron: (ingredient) => {
    const current = get().cauldron;
    if (current.length < 2) {
      set({ cauldron: [...current, ingredient] });
    }
  },

  undoLastIngredient: () => {
    const current = get().cauldron;
    if (current.length > 0) {
      set({ cauldron: current.slice(0, -1) });
    }
  },

  clearCauldron: () => set({ cauldron: [] }),

  mixCauldron: () => {
    const { cauldron, discoveredRecipes, potionsShelved, score } = get();
    if (cauldron.length < 2) {
      return {
        id: 'sludge',
        name: 'Murky Sludge',
        description: 'Needs more ingredients to form a true spell.',
        color: '#64748b',
        value: 10,
        isMasterwork: false,
      };
    }

    const key1 = `${cauldron[0].id}+${cauldron[1].id}`;
    const key2 = `${cauldron[1].id}+${cauldron[0].id}`;

    const recipe = RECIPES[key1] || RECIPES[key2] || {
      id: `custom_${Date.now()}`,
      name: `${cauldron[0].name.split(' ')[0]} ${cauldron[1].name.split(' ')[0]} Brew`,
      description: 'An experimental concoction bursting with Base Denim mana.',
      color: cauldron[0].color,
      value: 80,
      isMasterwork: false,
    };

    const nextDiscovered = discoveredRecipes.includes(recipe.name)
      ? discoveredRecipes
      : [...discoveredRecipes, recipe.name];

    set({
      cauldron: [],
      score: score + recipe.value,
      discoveredRecipes: nextDiscovered,
      potionsShelved: [...potionsShelved, recipe],
    });

    return recipe;
  },

  addScore: (points) => set((state) => ({ score: state.score + points })),
  takeDamage: (amount) => set((state) => ({ health: Math.max(0, state.health - amount) })),
  setScreen: (screen) => set({ screen }),
  resetGame: () => set({
    score: 0,
    cauldron: [],
    potionsShelved: [],
    discoveredRecipes: [],
    health: 100,
    screen: 'game',
  }),
}));
