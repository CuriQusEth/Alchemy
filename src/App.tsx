/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Web3Provider } from './components/Web3Provider';
import { Header } from './components/Header';
import { Cauldron } from './components/Cauldron';
import { Shelf } from './components/Shelf';
import { PotionResult } from './components/PotionResult';
import { RecipeBook } from './components/RecipeBook';
import { useState } from 'react';
import { Potion } from './store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useSendTransaction } from 'wagmi';
import { Sun } from 'lucide-react';

function MainMenu({ onStart }: { onStart: () => void; key?: string }) {
  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0515] overflow-hidden text-slate-100"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="text-center z-10 flex flex-col items-center">
        <motion.div
           animate={{ y: [0, -20, 0] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
           className="text-8xl mb-8 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]"
        >
          ⚗️
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-red-400 mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
          Cast Alchemist
        </h1>
        <p className="text-red-300/60 font-mono tracking-widest text-sm uppercase mb-12">
          Mix • Cast • Survive
        </p>
        
        <button 
          onClick={onStart}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-semibold text-lg text-white shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-transform border border-white/20"
        >
          Enter Laboratory
        </button>
      </div>
    </motion.div>
  );
}

function GameScreen() {
  const [resultPotion, setResultPotion] = useState<Potion | null>(null);

  // Background is dynamic dark with some color hints
  return (
    <div className="relative min-h-screen bg-[#0a0515] text-slate-100 flex flex-col font-sans overflow-hidden w-full">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center pt-28 px-4 lg:px-10 pb-10 gap-8 relative z-10 w-full max-w-[1200px] mx-auto min-h-screen">
        <div className="w-full lg:w-72 flex-shrink-0">
          <Shelf />
        </div>
        <div className="flex-1 flex justify-center items-center w-full">
          <Cauldron onMix={(p) => setResultPotion(p)} />
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <RecipeBook />
        </div>
      </main>

      <PotionResult potion={resultPotion} onClose={() => setResultPotion(null)} />
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <Web3Provider>
      <AppContent started={started} setStarted={setStarted} />
    </Web3Provider>
  );
}

function AppContent({ started, setStarted }: { started: boolean, setStarted: (s: boolean) => void }) {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    if (!isConnected) return;
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: 0n,
      data: '0x'
    });
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <AnimatePresence>
        {!started && <MainMenu key="menu" onStart={() => setStarted(true)} />}
      </AnimatePresence>
      {started && <GameScreen />}

      {/* Global GM Button from prompt */}
      {isConnected && (
        <div className="absolute bottom-4 right-4 z-[9999]">
          <button 
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            Say GM
          </button>
        </div>
      )}
    </div>
  );
}


