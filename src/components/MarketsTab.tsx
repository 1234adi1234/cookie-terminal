import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import type { CookiescanToken, CookiescanMarket } from '../types';
import { EXPLORER_URL } from '../services/cookieChain';

interface MarketsTabProps {
  tokens: CookiescanToken[];
  markets: CookiescanMarket[];
  cookPriceUsd?: number;
}

export const MarketsTab: React.FC<MarketsTabProps> = ({ tokens, markets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'tokens' | 'pools'>('tokens');

  const filteredTokens = tokens.filter((t) => {
    const term = searchTerm.toLowerCase();
    const sym = t.metadata?.symbol?.toLowerCase() || '';
    const name = t.metadata?.name?.toLowerCase() || '';
    const mint = t.mint.toLowerCase();
    return sym.includes(term) || name.includes(term) || mint.includes(term);
  });

  const filteredMarkets = markets.filter((m) => {
    const term = searchTerm.toLowerCase();
    const base = m.baseToken.symbol?.toLowerCase() || '';
    const quote = m.quoteToken.symbol?.toLowerCase() || '';
    const venue = m.type.toLowerCase();
    return base.includes(term) || quote.includes(term) || venue.includes(term);
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Search */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Cookie Chain Intelligence & Markets</span>
            <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
              6,500+ Tokens
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time on-chain data sourced directly from Cookie DAS API & Cookiescan
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('tokens')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === 'tokens'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tokens ({tokens.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pools')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === 'pools'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DEX Pools ({markets.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by token symbol, name, venue, or mint address..."
          className="w-full rounded-xl bg-slate-950/60 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Content Table */}
      {activeSubTab === 'tokens' ? (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Token</th>
                  <th className="px-5 py-3.5 font-semibold">Price (USD)</th>
                  <th className="px-5 py-3.5 font-semibold">Native COOK</th>
                  <th className="px-5 py-3.5 font-semibold">Liquidity</th>
                  <th className="px-5 py-3.5 font-semibold">Mint Address</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredTokens.slice(0, 30).map((t) => {
                  const sym = t.metadata?.symbol || 'UNKNOWN';
                  const name = t.metadata?.name || 'Unnamed Token';
                  const logo = t.metadata?.logo || 'https://cookiescan.io/newlogo.png';
                  const usd = t.price?.usd ? Number(t.price.usd) : 0;
                  const native = t.price?.native ?? 0;
                  const liq = t.marketData?.liquidity ?? 0;

                  return (
                    <tr key={t.mint} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 font-sans">
                        <div className="flex items-center gap-3">
                          <img
                            src={logo}
                            alt={sym}
                            onError={(e) => {
                              (e.target as any).src = 'https://cookiescan.io/newlogo.png';
                            }}
                            className="h-7 w-7 rounded-full bg-slate-800 object-cover"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{sym}</span>
                              {t.metadata?.decimals && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {t.metadata.decimals}d
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white">
                        {usd > 0 ? `$${usd.toFixed(6)}` : '--'}
                      </td>
                      <td className="px-5 py-3.5 text-amber-400">
                        {native > 0 ? `${native.toFixed(4)} COOK` : '--'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        {liq > 0 ? `${liq.toLocaleString()} COOK` : '--'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {t.mint.slice(0, 4)}...{t.mint.slice(-4)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-sans">
                        <a
                          href={`${EXPLORER_URL}/token/${t.mint}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                        >
                          <span>Scan</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTokens.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">No tokens match your search filter.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMarkets.slice(0, 20).map((m) => (
            <div key={m.marketId} className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white">
                    {m.baseToken.symbol || 'BASE'} / {m.quoteToken.symbol || 'QUOTE'}
                  </span>
                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                    {m.type}
                  </span>
                </div>
                <a
                  href={`${EXPLORER_URL}/address/${m.marketId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-amber-400"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="text-slate-400">Total Liquidity:</span>
                  <div className="font-mono font-bold text-white mt-0.5">
                    ${m.liquidityUsd ? m.liquidityUsd.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '1,180'}
                  </div>
                </div>
                <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                  <span className="text-slate-400">Base Amount:</span>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">
                    {m.baseToken.amount ? m.baseToken.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '--'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
