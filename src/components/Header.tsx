import { useAccount, useSignMessage, useSendTransaction, useConnect, useDisconnect } from 'wagmi';
import { useGameStore } from '../store/gameStore';
import { useState } from 'react';
import { Award, Zap, MessageCircle } from 'lucide-react';
import { ERC8021_CONFIG, encodeAttributionData } from '../lib/erc8021/config';
import { toHex } from 'viem';

export function Header() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { score, discoveredRecipes } = useGameStore();
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleScoreSubmit = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }
    
    setIsSubmitting(true);
    setStatusText('Signing...');
    try {
      // SIWE simple message for high score
      const message = `Alchemist Score Submission\n\nScore: ${score}\nRecipes: ${discoveredRecipes.length}\nAttribution: ${ERC8021_CONFIG.ATTRIBUTION_CODE}\nBuilder: ${ERC8021_CONFIG.BUILDER_CODE}`;
      const signature = await signMessageAsync({ account: address, message });
      console.log("SIWE Signature:", signature);
      
      setStatusText('Validating on-chain...');
      // Submit the signed score to the chain via a self-transaction
      await sendTransactionAsync({
        to: address,
        value: 0n,
        data: toHex(`AlchemistScore|${score}|${signature}`)
      });

      setStatusText('Submitted!');
      alert('Score and SIWE signature submitted on-chain successfully!');
    } catch (e: any) {
      console.error(e);
      setStatusText('Failed');
      alert(`Submission failed: ${e?.message || 'Unknown error'}`);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusText('');
      }, 3000);
    }
  };

  const handleSayGM = async () => {
    if (!isConnected || !address) return;
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
    <nav className="absolute top-0 w-full p-6 flex flex-col md:flex-row justify-between items-center z-50 gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-2xl font-bold text-white">A</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200">Alchemist</h1>
          <p className="text-[10px] text-purple-300/60 uppercase tracking-[0.2em] -mt-1">Enchanted Laboratory</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Score</span>
            <span className="font-mono">{score}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider">Discovered</span>
            <span className="font-mono">{discoveredRecipes.length}</span>
          </div>
        </div>

        {isConnected && (
          <button 
            onClick={handleSayGM}
            title="Say GM on-chain"
            className="flex items-center gap-1 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 rounded-full text-xs font-semibold transition-all"
          >
            <MessageCircle size={14} />
            Say GM
          </button>
        )}
        
        {score > 0 && isConnected && (
          <button 
            onClick={handleScoreSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-semibold text-sm border border-orange-500/20 shadow-lg shadow-orange-900/20 hover:scale-105 transition-all text-white"
          >
            <Zap size={14} />
            {isSubmitting ? statusText || 'Submitting...' : 'Submit Score'}
          </button>
        )}
        
        {!isConnected ? (
          <button 
            onClick={() => {
              if (!connectors || connectors.length === 0) {
                alert("No web3 wallet detected. Please install a wallet like MetaMask or open this app in an external browser.");
                return;
              }
              connect({ connector: connectors[0] });
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-semibold text-sm border border-white/20 shadow-lg text-white hover:scale-105 transition-all"
          >
            Connect Wallet
          </button>
        ) : (
          <button 
            onClick={() => disconnect()}
            title="Disconnect"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-semibold text-sm border border-white/20 shadow-lg text-white hover:bg-red-500 hover:scale-105 transition-all"
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        )}
      </div>
    </nav>
  );
}
