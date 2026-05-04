import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { Undo } from 'lucide-react';

export function Cauldron({ onMix }: { onMix: (potion: any) => void }) {
  const { cauldron, mixCauldron, undoLastIngredient } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, vx: number, vy: number, life: number, color: string, rad: number}[] = [];
    let animationFrame: number;

    const spawnParticle = () => {
      // Pick color based on current cauldron ingredients
      let color = '#a855f7'; // default purple
      if (cauldron.length > 0) {
         color = cauldron[Math.floor(Math.random() * cauldron.length)].color;
      }

      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height / 2 + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
        life: 1.0,
        color: color,
        rad: Math.random() * 3 + 2
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.2 + cauldron.length * 0.3) {
        spawnParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrame);
  }, [cauldron]);

  const handleMix = () => {
    if (cauldron.length === 2) {
      const result = mixCauldron();
      if (result) onMix(result);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full min-h-[400px]">
      
      {/* Cauldron Platform */}
      <div className="absolute top-[80%] lg:bottom-0 w-80 h-12 bg-white/5 blur-xl rounded-full pointer-events-none"></div>

      <div 
        id="cauldron-drop-zone"
        className="relative w-80 h-80"
      >
        <div className="absolute inset-0 pb-16 flex items-center justify-center w-full h-full pointer-events-none z-10 opacity-80">
          <canvas ref={canvasRef} width={300} height={300} className="w-[300px] h-[300px]" />
        </div>

        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-3xl animate-pulse pointer-events-none"></div>
        
        {/* Cauldron Body */}
        <div className="relative w-full h-full rounded-full border-4 border-slate-700/50 bg-slate-900 shadow-inner flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none"></div>
          
          {/* Liquid Filling */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-800/80 to-teal-500/40 blur-md transition-all duration-700" 
               style={{ 
                 opacity: cauldron.length > 0 ? 1 : 0.4,
               }}></div>
          
          <div className="z-30 absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence>
              {cauldron.map((ing, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ y: -100, opacity: 0, scale: 0.5, rotate: Math.random() * 90 }}
                  animate={{ y: idx * -10, opacity: 1, scale: 1, rotate: Math.random() * 45 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  transition={{ type: 'spring' }}
                  style={{ fontSize: '2rem' }}
                >
                  {ing.icon}
                </motion.div>
              ))}
            </AnimatePresence>
            {cauldron.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-12 opacity-60">
                 <span className="text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">⚗️</span>
                 <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/60">Empty Cauldron</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Interaction Controls */}
      <div className="mt-12 flex gap-4 z-30">
        <button 
          onClick={undoLastIngredient}
          disabled={cauldron.length === 0}
          className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold uppercase tracking-tighter text-sm hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Undo Last
        </button>

        <button 
          onClick={handleMix}
          disabled={cauldron.length < 2}
          className={`px-10 py-3 rounded-full font-bold uppercase tracking-tighter text-sm transition-all shadow-xl ${
            cauldron.length === 2 
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-900/20 text-white cursor-pointer hover:scale-105'
            : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed shadow-none'
          }`}
        >
          Finalize Brew
        </button>
      </div>
    </div>
  );
}
