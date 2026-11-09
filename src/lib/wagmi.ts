import { http, createConfig, fallback } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { BASE_DENIM_CONFIG } from './baseDenim'

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: fallback([
      http(BASE_DENIM_CONFIG.rpcUrl, {
        batch: true,
        retryCount: 3,
        retryDelay: 150,
      }),
      http(BASE_DENIM_CONFIG.fallbackRpcUrls[0]),
    ]),
  },
  // Tuned for Base Mainnet Denim's 200ms canonical blocks:
  pollingInterval: 250,
})

export const wagmiConfig = config
