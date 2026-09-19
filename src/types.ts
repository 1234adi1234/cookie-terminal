export interface CookiescanToken {
  mint: string;
  metadata?: {
    name?: string;
    symbol?: string;
    logo?: string;
    decimals?: number;
    description?: string;
    updateAuthority?: string;
  };
  price?: {
    usd?: string | number;
    native?: number;
    change24h?: number;
  };
  marketData?: {
    volume24h?: number;
    volumeChange24h?: number;
    liquidity?: number;
    marketCap?: number;
    supply?: number;
    holderCount?: number;
  };
  lastUpdated?: string;
}

export interface CookiescanMarketSide {
  mint: string;
  symbol?: string;
  amount?: number;
  priceUsd?: number;
}

export interface CookiescanMarket {
  marketId: string;
  type: string;
  baseToken: CookiescanMarketSide;
  quoteToken: CookiescanMarketSide;
  liquidityUsd?: number;
  liquidityDisplay?: string;
}

export interface AggSegment {
  pool: string;
  venue: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  percentage?: number;
  hopIndex: number;
}

export interface AggQuote {
  inAmount: string;
  outAmount: string;
  feePct: number;
  feeAmount: string;
  netOutAmount: string;
  minOutAmount: string;
  priceImpactPct: number | null;
  path: string[];
  isSplit: boolean;
  isMultiHop: boolean;
  segments: AggSegment[];
  warnings?: string[];
}

export interface EpochInfo {
  absoluteSlot: number;
  blockHeight: number;
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  transactionCount: number;
}

export type ChainStatus = 'healthy' | 'degraded' | 'offline';

export interface ChainHealth {
  status: ChainStatus;
  coreVersion: string | null;
  featureSet: number | null;
  epochInfo: EpochInfo | null;
  isFallback: boolean;
  error: string | null;
}

export interface FetchResult<T> {
  data: T;
  status: ChainStatus;
  isFallback: boolean;
  error: string | null;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balanceLamports: number;
  balanceCook: number;
  walletName: string | null;
  isSimulated?: boolean;
}
