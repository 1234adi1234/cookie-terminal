import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Send, BarChart3, Bot, Network, Sparkles } from 'lucide-react';
import type { WalletState, CookiescanToken, CookiescanMarket, ChainHealth } from './types';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { SwapTab } from './components/SwapTab';
import { TransferTab } from './components/TransferTab';
import { MarketsTab } from './components/MarketsTab';
import { BridgeTab } from './components/BridgeTab';
import { AgentTab } from './components/AgentTab';
import { Footer } from './components/Footer';
import { getChainHealth, fetchTokens, fetchMarkets } from './services/cookieChain';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'swap' | 'transfer' | 'markets' | 'bridge' | 'agent'>('swap');
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balanceLamports: 0,
    balanceCook: 0,
    walletName: null,
  });

  const [health, setHealth] = useState<ChainHealth | null>(null);
  const [tokens, setTokens] = useState<CookiescanToken[]>([]);
  const [markets, setMarkets] = useState<CookiescanMarket[]>([]);
  const [cookPriceUsd, setCookPriceUsd] = useState<number>(0.0000757);

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
      try {
        const [h, t, m] = await Promise.all([getChainHealth(), fetchTokens(), fetchMarkets()]);
        setHealth(h);
        setTokens(t.tokens);
        setMarkets(m.markets);
        if (t.cookUsd) setCookPriceUsd(t.cookUsd);
      } catch (e) {
        console.error('Initial data load error:', e);
      }
    };

    loadData();
    const interval = setInterval(loadData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'swap', name: 'Swap & DEX', icon: ArrowLeftRight },
    { id: 'transfer', name: 'Transfer & Pay', icon: Send },
    { id: 'markets', name: 'Tokens & Markets', icon: BarChart3 },
    { id: 'bridge', name: 'Hyperlane Bridge', icon: Network },
    { id: 'agent', name: 'Agent MCP Console', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      <div>
        <Navbar wallet={wallet} setWallet={setWallet} cookPriceUsd={cookPriceUsd} />

        <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 cookie-glow">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Cookie Chain SVM · High-Speed Execution</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                The Autonomous DeFi & Analytics Terminal for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">Cookie Chain</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                Experience sub-second finality, 1:1 Hyperlane cross-chain bridging, Cookiebox DEX liquidity routing, and autonomous agent tooling on the community SVM.
              </p>
            </div>
            {/* Ambient background glows */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
            <div className="absolute -right-4 -bottom-16 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>
          </div>

          {/* Real-time Network Metrics */}
          <StatsBar health={health} />

          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto py-2 mb-6 border-b border-white/10 scrollbar-none gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab View */}
          <div className="mt-4">
            {activeTab === 'swap' && (
              <SwapTab wallet={wallet} tokens={tokens} cookPriceUsd={cookPriceUsd} />
            )}
            {activeTab === 'transfer' && (
              <TransferTab wallet={wallet} cookPriceUsd={cookPriceUsd} />
            )}
            {activeTab === 'markets' && (
              <MarketsTab tokens={tokens} markets={markets} cookPriceUsd={cookPriceUsd} />
            )}
            {activeTab === 'bridge' && <BridgeTab />}
            {activeTab === 'agent' && <AgentTab />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
