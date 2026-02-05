import { http, createConfig } from 'wagmi'
import { bscTestnet, bsc } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    // OKX Wallet만 사용
    injected({ 
      target: 'okxWallet'
    }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
})

export const CONTRACTS = {
  FUNS_TOKEN: process.env.NEXT_PUBLIC_FUNS_TOKEN_ADDRESS as `0x${string}`,
  COINTOSS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
