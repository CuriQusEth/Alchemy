import { motion, AnimatePresence } from 'motion/react';
import { Potion } from '../store/gameStore';

export function PotionResult({ potion, onClose }: { potion: Potion | null, onClose: () => void }) {
  if (!potion) return null;

  const isMasterwork = potion.isMasterwork;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0515]/90 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-sm flex flex-col items-center text-center relative overflow-hidden"
          style={{
            boxShadow: `0 0 80px ${potion.color}30`,
          }}
        >
          {/* Background flare */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-30 pointer-events-none blur-[80px] rounded-full" 
               style={{ backgroundColor: potion.color }} />
          
          <h2 className="text-xs font-bold text-white/50 mb-2 uppercase tracking-widest relative z-10">
            {potion.id === 'sludge' ? 'Experiment Failed' : 'Potion Crafted!'}
          </h2>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-32 h-32 mb-6 rounded-full flex items-center justify-center text-6xl shadow-2xl relative z-10 border border-white/10"
            style={{ 
              background: `radial-gradient(circle at center, ${potion.color}40, transparent)`,
              boxShadow: `inset 0 0 30px ${potion.color}80, 0 10px 40px ${potion.color}60`
            }}
          >
            {potion.id === 'sludge' ? '🧫' : '🧪'}
          </motion.div>

          <h3 className="text-3xl font-serif font-bold mb-2 relative z-10" style={{ color: potion.id === 'sludge' ? '#9ca3af' : potion.color }}>
            {potion.name}
          </h3>
          
          <p className="text-white/60 italic mb-8 relative z-10 text-sm">
            "{potion.description}"
          </p>

          <div className="flex gap-4 w-full mb-8 relative z-10">
            <div className="flex-1 bg-black/30 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold transform translate-y-1">Essence Value</div>
              <div className="text-2xl font-mono text-amber-400">+{potion.value}</div>
            </div>
            {isMasterwork && (
              <div className="flex-1 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/20 flex flex-col items-center justify-center">
                <div className="text-[10px] text-yellow-500/70 uppercase tracking-widest mb-1 font-bold">Rarity</div>
                <div className="text-xs font-bold text-yellow-400 mt-1 uppercase tracking-wider">MASTERWORK</div>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all bg-white/10 border border-white/20 text-white hover:bg-white/20 relative z-10 shadow-lg shadow-black/50"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
