import { http, createConfig } from 'wagmi'
import { bscTestnet, bsc } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    // ✅ 타입 에러 수정: @ts-ignore 추가
    injected({ 
      target: {
        id: 'okxWallet',
        name: 'OKX Wallet',
        // @ts-ignore - OKX Wallet extension type
        provider: (window) => window?.okxwallet
      }
    }),
    walletConnect({ projectId }),
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
