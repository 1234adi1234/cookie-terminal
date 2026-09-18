import { PublicKey } from '@solana/web3.js';
import type { WalletState } from '../types';

declare global {
  interface Window {
    nightly?: {
      solana?: {
        connect: () => Promise<{ publicKey: PublicKey }>;
        disconnect: () => Promise<void>;
        signTransaction: (tx: any) => Promise<any>;
        signAllTransactions: (txs: any[]) => Promise<any[]>;
        publicKey?: PublicKey;
      };
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (tx: any) => Promise<any>;
      signAndSendTransaction?: (tx: any) => Promise<{ signature: string }>;
      publicKey?: PublicKey;
    };
  }
}

export function detectWallets() {
  return {
    nightly: typeof window !== 'undefined' && !!window.nightly?.solana,
    phantom: typeof window !== 'undefined' && !!window.solana?.isPhantom,
    genericSolana: typeof window !== 'undefined' && !!window.solana,
  };
}

export async function connectWallet(walletType: 'nightly' | 'phantom' | 'standard' | 'demo'): Promise<WalletState> {
  if (walletType === 'demo') {
    // Generate a clean demo session for sandbox exploration
    const demoPubkey = '4N9HQfVSu7zjWLBD7WbaFroj79sDh4Sx76hRon7Vh86n';
    return {
      connected: true,
      address: demoPubkey,
      balanceLamports: 15_420_000_000,
      balanceCook: 15.42,
      walletName: 'Demo Session (Aditya Dev)',
      isSimulated: true,
    };
  }

  if (walletType === 'nightly') {
    if (typeof window !== 'undefined' && window.nightly?.solana) {
      const res = await window.nightly.solana.connect();
      const address = res.publicKey.toString();
      return {
        connected: true,
        address,
        balanceLamports: 0,
        balanceCook: 0,
        walletName: 'Nightly Wallet',
        isSimulated: false,
      };
    }
    throw new Error('Nightly Wallet extension not detected in browser. Please install Nightly from nightly.app.');
  }

  if (typeof window !== 'undefined' && window.solana) {
    const res = await window.solana.connect();
    const address = res.publicKey.toString();
    return {
      connected: true,
      address,
      balanceLamports: 0,
      balanceCook: 0,
      walletName: window.solana.isPhantom ? 'Phantom' : 'Solana Wallet',
      isSimulated: false,
    };
  }

  throw new Error('No Solana-compatible wallet found. Please install Nightly or Phantom.');
}
