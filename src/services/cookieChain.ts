import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import type {
  CookiescanToken,
  CookiescanMarket,
  AggQuote,
  EpochInfo,
  ChainHealth,
  ChainStatus,
  FetchResult,
} from '../types';

export const COOKIE_RPC_URL = 'https://rpc.cookiescan.io';
export const COOKIESCAN_API_URL = 'https://api.cookiescan.io';
export const COOKIEBOX_AGG_API_URL = 'https://agg.cookiebox.app';
export const EXPLORER_URL = 'https://cookiescan.io';

// Native COOK mint on Cookie Chain
export const COOK_MINT = 'So11111111111111111111111111111111111111112';
export const COOK_DECIMALS = 9;

// Default tokens for fast selection
export const POPULAR_TOKENS = [
  {
    symbol: 'COOK',
    name: 'Cookie Native',
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    logo: 'https://cookiescan.io/newlogo.png',
  },
  {
    symbol: 'bCOOK',
    name: 'Liquid Staked COOK',
    mint: 'EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz',
    decimals: 9,
    logo: 'https://cookiescan.io/newlogo.png',
  },
  {
    symbol: 'TRS',
    name: 'Trash',
    mint: '3Dk9AYeoMZRHg9PmA2LrxrDGyJsNPTVGbRMbNKCsEt23',
    decimals: 6,
    logo: 'https://ipfs.io/ipfs/QmaMg8bUEKsC6qX1fmrNU8EcfYSpA78eTsGoSpYpRfMNcV',
  },
];

export const connection = new Connection(COOKIE_RPC_URL, 'confirmed');

export async function getChainHealth(): Promise<ChainHealth> {
  const [healthRes, verRes, epochRes] = await Promise.allSettled([
    rpcCall('getHealth', 1),
    rpcCall('getVersion', 2),
    rpcCall('getEpochInfo', 3),
  ]);

  const versionOk = verRes.status === 'fulfilled';
  const epochOk = epochRes.status === 'fulfilled';
  const healthOk = healthRes.status === 'fulfilled';

  let status: ChainStatus;
  if (versionOk && epochOk && healthOk) {
    status = 'healthy';
  } else if (versionOk || epochOk || healthOk) {
    status = 'degraded';
  } else {
    status = 'offline';
  }

  const versionResult = versionOk ? verRes.value?.result : null;
  const epochResult = epochOk ? epochRes.value?.result : null;

  // A "healthy" claim requires actually receiving the core fields, not defaults.
  if (status === 'healthy' && (!versionResult || !epochResult)) {
    status = 'degraded';
  }

  return {
    status,
    coreVersion: versionResult?.['solana-core'] ?? null,
    featureSet: versionResult?.['feature-set'] ?? null,
    epochInfo: (epochResult as EpochInfo | null) ?? null,
    isFallback: status !== 'healthy',
    error: status === 'healthy' ? null : describeHealthFailure(healthRes, verRes, epochRes),
  };
}

async function rpcCall(method: string, id: number): Promise<any> {
  const res = await fetch(COOKIE_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method }),
  });
  if (!res.ok) {
    throw new Error(`${method} failed with HTTP ${res.status}`);
  }
  const json = await res.json();
  if (json?.error) {
    throw new Error(`${method} returned RPC error: ${JSON.stringify(json.error)}`);
  }
  return json;
}

function describeHealthFailure(...results: PromiseSettledResult<any>[]): string {
  const reasons = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));
  return reasons.length ? reasons.join('; ') : 'Incomplete RPC response';
}

export async function fetchTokens(): Promise<FetchResult<{ count: number; cookUsd: number; tokens: CookiescanToken[] }>> {
  const empty = { count: 0, cookUsd: 0, tokens: [] as CookiescanToken[] };
  try {
    const res = await fetch(`${COOKIESCAN_API_URL}/api/tokens`);
    if (!res.ok) {
      return { data: empty, status: 'degraded', isFallback: true, error: `Tokens API returned HTTP ${res.status}` };
    }
    const data = await res.json();
    const tokens: CookiescanToken[] = Array.isArray(data?.data) ? data.data : [];
    if (!Array.isArray(data?.data)) {
      return { data: empty, status: 'degraded', isFallback: true, error: 'Malformed tokens payload' };
    }
    return {
      data: {
        count: typeof data.count === 'number' ? data.count : tokens.length,
        cookUsd: typeof data.cookUsd === 'number' ? data.cookUsd : 0,
        tokens,
      },
      status: 'healthy',
      isFallback: false,
      error: null,
    };
  } catch (err) {
    return {
      data: empty,
      status: 'offline',
      isFallback: true,
      error: err instanceof Error ? err.message : 'Tokens API unreachable',
    };
  }
}

export async function fetchMarkets(): Promise<
  FetchResult<{ marketCount: number; cookUsd: number; markets: CookiescanMarket[] }>
> {
  const empty = { marketCount: 0, cookUsd: 0, markets: [] as CookiescanMarket[] };
  try {
    const res = await fetch(`${COOKIESCAN_API_URL}/api/markets`);
    if (!res.ok) {
      return { data: empty, status: 'degraded', isFallback: true, error: `Markets API returned HTTP ${res.status}` };
    }
    const data = await res.json();
    const markets: CookiescanMarket[] = Array.isArray(data?.markets) ? data.markets : [];
    if (!Array.isArray(data?.markets)) {
      return { data: empty, status: 'degraded', isFallback: true, error: 'Malformed markets payload' };
    }
    return {
      data: {
        marketCount: typeof data.marketCount === 'number' ? data.marketCount : markets.length,
        cookUsd: typeof data.cookUsd === 'number' ? data.cookUsd : 0,
        markets,
      },
      status: 'healthy',
      isFallback: false,
      error: null,
    };
  } catch (err) {
    return {
      data: empty,
      status: 'offline',
      isFallback: true,
      error: err instanceof Error ? err.message : 'Markets API unreachable',
    };
  }
}

export async function fetchSwapQuote(
  inputMint: string,
  outputMint: string,
  amountInLamports: number
): Promise<AggQuote | null> {
  try {
    const url = `${COOKIEBOX_AGG_API_URL}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInLamports}`;
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.route || null;
  } catch (err) {
    console.error('Failed to fetch quote from Cookiebox:', err);
    return null;
  }
}

export async function getWalletCookBalance(address: string): Promise<number> {
  try {
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export function buildCookTransferTransaction(
  senderAddress: string,
  recipientAddress: string,
  amountCook: number,
  recentBlockhash: string
): Transaction {
  const fromPubkey = new PublicKey(senderAddress);
  const toPubkey = new PublicKey(recipientAddress);
  const lamports = Math.round(amountCook * LAMPORTS_PER_SOL);

  const tx = new Transaction({
    recentBlockhash,
    feePayer: fromPubkey,
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  return tx;
}
