import { useGameStore, Ingredient } from '../store/gameStore';
import { motion } from 'motion/react';
import { useRef } from 'react';

export function Shelf() {
  const { inventory, addIngredientToCauldron, cauldron } = useGameStore();
  const constraintsRef = useRef(null);

  return (
    <div className="w-full h-full flex flex-col gap-4" ref={constraintsRef}>
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col h-full min-h-[300px]">
        <h2 className="text-sm font-bold uppercase tracking-widest text-amber-200 mb-4 flex justify-between">
          Ingredients
          <span className="text-xs text-white/40 font-normal">{inventory.length}</span>
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1">
          {inventory.map((ing) => {
            const isAtLimit = cauldron.length >= 2;
            return (
              <IngredientItem 
                key={ing.id} 
                ingredient={ing} 
                disabled={isAtLimit}
                onDropInCauldron={() => addIngredientToCauldron(ing)}
                constraintsRef={constraintsRef}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IngredientItem({ 
  ingredient, 
  disabled, 
  onDropInCauldron,
  constraintsRef
}: { 
  ingredient: Ingredient, 
  disabled: boolean,
  onDropInCauldron: () => void,
  constraintsRef: any
}) {

  const handleDragEnd = (event: any, info: any) => {
    // Check if we dropped over the cauldron
    const element = document.elementFromPoint(info.point.x, info.point.y);
    if (element?.closest('#cauldron-drop-zone')) {
      onDropInCauldron();
    }
  };

  return (
    <div className={`aspect-square rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col items-center justify-center gap-1 group relative z-40 transition-opacity ${disabled ? 'opacity-50' : 'hover:bg-white/10'}`}>
      <motion.div
        drag={!disabled}
        dragSnapToOrigin
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9, cursor: 'grabbing' } : {}}
        // We also allow tapping to add directly for accessibility/mobile ease
        onClick={() => !disabled && onDropInCauldron()}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border z-50 ${disabled ? 'cursor-not-allowed grayscale' : 'cursor-grab shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
        style={{ 
          backgroundColor: `${ingredient.color}30`, 
          borderColor: `${ingredient.color}60`,
          touchAction: disabled ? 'auto' : 'none' // Prevent scroll while dragging
        }}
      >
        {ingredient.icon}
      </motion.div>
      <span className="text-[10px] uppercase font-bold text-white/80 text-center w-full truncate px-1 mt-1">
        {ingredient.name}
      </span>
    </div>
  );
}
