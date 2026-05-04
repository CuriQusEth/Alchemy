import { useGameStore } from '../store/gameStore';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ERC8021_CONFIG } from '../lib/erc8021/config';

import { useAccount, useSendTransaction } from 'wagmi';
import { toHex } from 'viem';

export function RecipeBook() {
  const { discoveredRecipes, potionsShelved, score } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const handleSayGM = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const dataStr = `GM Alchemist! Attribution:${ERC8021_CONFIG.ATTRIBUTION_CODE} Builder:${ERC8021_CONFIG.BUILDER_CODE}`;
      await sendTransactionAsync({
        to: address,
        value: 0n,
        data: toHex(dataStr)
      });
      alert('GM sent on-chain confirmed!');
    } catch (e: any) {
      console.error(e);
      alert(`Transaction failed: ${e?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full flex md:flex-col gap-4">
      {/* On-chain Stats Card */}
      <div className="backdrop-blur-lg bg-indigo-900/20 border border-indigo-500/20 rounded-3xl p-6 w-full">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4">Web3 Lab Stats</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] text-white/40 uppercase mb-1">Score</p>
            <p className="text-sm font-bold font-mono">{score}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] text-white/40 uppercase mb-1">Discovered</p>
            <p className="text-sm font-bold font-mono">{discoveredRecipes.length}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSayGM}
          className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-gray-200 transition-colors"
        >
          Say GM (Simple TX)
        </button>

        <p className="text-center text-[9px] text-white/30 mt-3 font-mono uppercase tracking-tighter">
          Builder ID: {ERC8021_CONFIG.BUILDER_CODE || 'bc_wiuk1ety'}
        </p>
      </div>

      {/* Recipe Book Preview */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-6 w-full flex flex-col">
        <h2 className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-6 flex justify-between">
          Grimoire
          <span className="text-xs text-white/40 font-normal">{discoveredRecipes.length} Found</span>
        </h2>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {potionsShelved.slice(-8).map((p, i) => (
            <div 
              key={i} 
              className="aspect-square rounded-xl flex items-center justify-center text-xl border border-white/10"
              style={{ backgroundColor: `${p.color}20` }}
              title={p.name}
            >
              {p.id === 'sludge' ? '🧫' : '🧪'}
            </div>
          ))}
          {potionsShelved.length === 0 && (
             <div className="col-span-4 text-center text-white/30 text-xs py-4 italic">No potions brewed yet.</div>
          )}
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="w-full mt-auto py-3 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-xs font-bold uppercase tracking-widest text-indigo-200 hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          <BookOpen size={16} />
          View Full Recipe Book
        </button>
      </div>
      
      {/* Full Book Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0515]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold uppercase tracking-widest text-amber-200">Grimoire</h2>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white text-sm font-bold uppercase tracking-wider">Close</button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/60 mb-4 uppercase tracking-widest">
                  <span>Discovered</span>
                  <span className="font-mono">{discoveredRecipes.length} recipes</span>
                </div>
                
                <div className="space-y-3">
                  {potionsShelved.map((p, i) => (
                    <div key={i} className="flex gap-4 items-center bg-black/20 border border-white/5 p-3 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ backgroundColor: `${p.color}20`, borderColor: `${p.color}40` }}>
                        <span className="text-2xl">{p.id === 'sludge' ? '🧫' : '🧪'}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">{p.name}</h3>
                        <p className="text-[10px] text-white/50">{p.description}</p>
                      </div>
                      <div className="text-xs font-mono font-bold" style={{ color: p.color }}>
                        +{p.value}
                      </div>
                    </div>
                  ))}
                  {potionsShelved.length === 0 && (
                     <div className="text-center text-white/40 text-sm py-8 italic">No potions brewed yet.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
