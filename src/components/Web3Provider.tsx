import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/wagmi';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tuned for Denim's fast 200ms canonical blocks
      staleTime: 1000,
      refetchInterval: 1000,
    },
  },
});

export { wagmiConfig };

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
