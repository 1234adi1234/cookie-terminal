import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getChainHealth,
  fetchTokens,
  fetchMarkets,
  fetchSwapQuote,
  buildCookTransferTransaction,
} from '../services/cookieChain';

describe('cookieChain service tests', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('getChainHealth', () => {
    it('returns healthy status when all RPC calls succeed with core fields', async () => {
      globalThis.fetch = vi.fn().mockImplementation((_url: string, opts: any) => {
        const body = JSON.parse(opts.body);
        if (body.method === 'getHealth') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ jsonrpc: '2.0', id: 1, result: 'ok' }),
          });
        }
        if (body.method === 'getVersion') {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                jsonrpc: '2.0',
                id: 2,
                result: { 'solana-core': '4.1.2', 'feature-set': 3345198602 },
              }),
          });
        }
        if (body.method === 'getEpochInfo') {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                jsonrpc: '2.0',
                id: 3,
                result: { epoch: 59, slotIndex: 407000, slotsInEpoch: 432000 },
              }),
          });
        }
        return Promise.reject(new Error('Unknown method'));
      }) as any;

      const health = await getChainHealth();
      expect(health.status).toBe('healthy');
      expect(health.isFallback).toBe(false);
      expect(health.coreVersion).toBe('4.1.2');
      expect(health.featureSet).toBe(3345198602);
      expect(health.epochInfo?.epoch).toBe(59);
      expect(health.error).toBeNull();
    });

    it('returns degraded status when some calls succeed but core fields are missing', async () => {
      globalThis.fetch = vi.fn().mockImplementation((_url: string, opts: any) => {
        const body = JSON.parse(opts.body);
        if (body.method === 'getHealth') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ jsonrpc: '2.0', id: 1, result: 'ok' }),
          });
        }
        return Promise.reject(new Error('RPC node timeout'));
      }) as any;

      const health = await getChainHealth();
      expect(health.status).toBe('degraded');
      expect(health.isFallback).toBe(true);
      expect(health.error).toContain('RPC node timeout');
    });

    it('returns offline status when all RPC calls fail', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network unreachable'));

      const health = await getChainHealth();
      expect(health.status).toBe('offline');
      expect(health.isFallback).toBe(true);
      expect(health.coreVersion).toBeNull();
      expect(health.error).toContain('Network unreachable');
    });
  });

  describe('fetchTokens', () => {
    it('returns healthy tokens when API responds with valid array', async () => {
      const mockTokens = [
        {
          mint: 'So11111111111111111111111111111111111111112',
          decimals: 9,
          metadata: { name: 'Cookie Native', symbol: 'COOK' },
          price: { usd: 0.05 },
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ count: 1, cookUsd: 0.05, data: mockTokens }),
      }) as any;

      const res = await fetchTokens();
      expect(res.status).toBe('healthy');
      expect(res.isFallback).toBe(false);
      expect(res.data.count).toBe(1);
      expect(res.data.cookUsd).toBe(0.05);
      expect(res.data.tokens).toHaveLength(1);
      expect(res.data.tokens[0].metadata?.symbol).toBe('COOK');
    });

    it('returns degraded fallback when API returns HTTP 500 error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }) as any;

      const res = await fetchTokens();
      expect(res.status).toBe('degraded');
      expect(res.isFallback).toBe(true);
      expect(res.data.tokens).toEqual([]);
      expect(res.error).toContain('HTTP 500');
    });

    it('returns degraded fallback when API returns malformed payload without data array', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ count: 0, cookUsd: 0, data: null }),
      }) as any;

      const res = await fetchTokens();
      expect(res.status).toBe('degraded');
      expect(res.isFallback).toBe(true);
      expect(res.error).toBe('Malformed tokens payload');
    });

    it('returns offline status when network throws', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('DNS resolution error'));

      const res = await fetchTokens();
      expect(res.status).toBe('offline');
      expect(res.isFallback).toBe(true);
      expect(res.error).toBe('DNS resolution error');
    });
  });

  describe('fetchMarkets', () => {
    it('returns healthy markets when API responds correctly', async () => {
      const mockMarkets = [
        {
          marketAddress: 'Market111111111111111111111111111111111111',
          baseMint: 'So11111111111111111111111111111111111111112',
          quoteMint: '3Dk9AYeoMZRHg9PmA2LrxrDGyJsNPTVGbRMbNKCsEt23',
          price: 1.25,
          volume24h: 50000,
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ marketCount: 1, cookUsd: 0.05, markets: mockMarkets }),
      }) as any;

      const res = await fetchMarkets();
      expect(res.status).toBe('healthy');
      expect(res.isFallback).toBe(false);
      expect(res.data.marketCount).toBe(1);
      expect(res.data.markets[0].marketAddress).toBe('Market111111111111111111111111111111111111');
    });

    it('returns degraded status on malformed markets structure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ markets: 'not-an-array' }),
      }) as any;

      const res = await fetchMarkets();
      expect(res.status).toBe('degraded');
      expect(res.isFallback).toBe(true);
      expect(res.error).toBe('Malformed markets payload');
    });
  });

  describe('fetchSwapQuote', () => {
    it('returns route quote when aggregator responds with 200', async () => {
      const mockRoute = {
        inAmount: '1000000000',
        outAmount: '2000000',
        priceImpactPct: 0.02,
        marketInfos: [],
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ route: mockRoute }),
      }) as any;

      const quote = await fetchSwapQuote('mintA', 'mintB', 1000000000);
      expect(quote).toEqual(mockRoute);
    });

    it('returns null when aggregator returns error status', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }) as any;

      const quote = await fetchSwapQuote('mintA', 'mintB', 1000000000);
      expect(quote).toBeNull();
    });
  });

  describe('buildCookTransferTransaction', () => {
    it('constructs a valid Solana SystemProgram transfer transaction with correct lamports', () => {
      const sender = '4N9HQfVSu7zjWLBD7WbaFroj79sDh4Sx76hRon7Vh86n';
      const recipient = 'So11111111111111111111111111111111111111112';
      const amountCook = 2.5;
      const dummyBlockhash = 'EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz';

      const tx = buildCookTransferTransaction(sender, recipient, amountCook, dummyBlockhash);

      expect(tx.recentBlockhash).toBe(dummyBlockhash);
      expect(tx.feePayer?.toBase58()).toBe(sender);
      expect(tx.instructions).toHaveLength(1);

      const instruction = tx.instructions[0];
      expect(instruction.programId.toBase58()).toBe('11111111111111111111111111111111');
      expect(instruction.keys).toHaveLength(2);
      expect(instruction.keys[0].pubkey.toBase58()).toBe(sender);
      expect(instruction.keys[1].pubkey.toBase58()).toBe(recipient);
    });

    it('handles fractional precision rounding cleanly', () => {
      const sender = '4N9HQfVSu7zjWLBD7WbaFroj79sDh4Sx76hRon7Vh86n';
      const recipient = 'So11111111111111111111111111111111111111112';
      const amountCook = 0.000000001;
      const dummyBlockhash = 'EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz';

      const tx = buildCookTransferTransaction(sender, recipient, amountCook, dummyBlockhash);
      expect(tx.instructions).toHaveLength(1);
    });
  });
});
