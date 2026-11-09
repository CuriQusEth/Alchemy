/**
 * Base Mainnet - Denim Upgrade Configuration
 * 
 * Denim activated on Base Mainnet on November 5, 2026.
 * It replaced Flashblocks with 200ms native canonical blocks.
 * All transactions and receipts confirm within canonical 200ms blocks.
 */

export const BASE_DENIM_CONFIG = {
  chainId: 8453,
  chainName: 'Base Mainnet',
  upgrade: 'Denim',
  blockTimeMs: 200,
  consensus: 'Canonical 200ms Blocks',
  rpcUrl: 'https://mainnet.base.org',
  fallbackRpcUrls: [
    'https://base.llamarpc.com',
    'https://1rpc.io/base'
  ],
  blockExplorer: 'https://basescan.org',
  gmContractAddress: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
  agentWallet: '0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B',
  flashblocksRetired: true,
  status: 'active'
} as const;
