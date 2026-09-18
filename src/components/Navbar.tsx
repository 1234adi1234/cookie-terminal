import React, { useState } from 'react';
import { Cookie, Wallet, ExternalLink, ShieldCheck, ChevronDown, CheckCircle2, Zap } from 'lucide-react';
import type { WalletState } from '../types';
import { connectWallet, detectWallets } from '../services/wallet';

interface NavbarProps {
  wallet: WalletState;
  setWallet: (wallet: WalletState) => void;
  cookPriceUsd: number;
}

export const Navbar: React.FC<NavbarProps> = ({ wallet, setWallet, cookPriceUsd }) => {
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detected = detectWallets();

  const handleConnect = async (type: 'nightly' | 'phantom' | 'standard' | 'demo') => {
    try {
      setConnecting(true);
      setError(null);
      const state = await connectWallet(type);
      setWallet(state);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWallet({
      connected: false,
      address: null,
      balanceLamports: 0,
      balanceCook: 0,
      walletName: null,
    });
  };

  return (
    <>
      <nav className="glass-panel sticky top-0 z-50 border-b border-white/10 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo & Network Status */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 shadow-lg shadow-amber-500/30">
              <Cookie className="h-6 w-6 text-slate-950" />
              <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white sm:text-xl">CookieTerminal</span>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
                  SVM
                </span>
              </div>
              <p className="hidden text-xs text-slate-400 sm:block">DeFi & Analytics Suite</p>
            </div>
          </div>

          {/* Center: Live Price & Network Pill */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 border border-white/5 text-xs">
              <span className="text-slate-400">COOK:</span>
              <span className="font-mono font-medium text-amber-400">
                ${cookPriceUsd > 0 ? cookPriceUsd.toFixed(7) : '0.0000757'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 text-xs text-emerald-300">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>Cookie Chain Mainnet</span>
            </div>
          </div>

          {/* Right: Wallet Button */}
          <div className="flex items-center gap-3">
            {wallet.connected ? (
              <div className="flex items-center gap-2">
                <div className="hidden rounded-lg bg-white/5 px-3 py-1.5 border border-white/5 sm:block text-right">
                  <div className="text-xs text-slate-400">{wallet.walletName}</div>
                  <div className="font-mono text-xs font-medium text-amber-400">
                    {wallet.balanceCook.toFixed(4)} COOK
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition-all border border-white/10"
                >
                  <span className="font-mono">
                    {wallet.address?.slice(0, 4)}...{wallet.address?.slice(-4)}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Wallet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Connect to Cookie Chain</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="mt-5 space-y-3">
              {/* Nightly Option (Official Required Partner) */}
              <button
                onClick={() => handleConnect('nightly')}
                disabled={connecting}
                className="flex w-full items-center justify-between rounded-xl bg-purple-600/10 border border-purple-500/30 p-3.5 text-left hover:bg-purple-600/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 font-bold">
                    N
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>Nightly Wallet</span>
                      <span className="rounded bg-amber-400/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                        Required by Bounty
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {detected.nightly ? 'Extension detected' : 'Native Cookie Chain SVM wallet'}
                    </p>
                  </div>
                </div>
                {detected.nightly ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-purple-300" />
                )}
              </button>

              {/* Phantom / Generic Solana Option */}
              <button
                onClick={() => handleConnect('phantom')}
                disabled={connecting}
                className="flex w-full items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3.5 text-left hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-bold">
                    P
                  </div>
                  <div>
                    <div className="font-semibold text-white">Phantom / Solflare</div>
                    <p className="text-xs text-slate-400">Standard SVM provider</p>
                  </div>
                </div>
                {detected.phantom && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              </button>

              {/* Demo Sandbox Mode */}
              <button
                onClick={() => handleConnect('demo')}
                disabled={connecting}
                className="flex w-full items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-left hover:bg-amber-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Sandbox / Demo Session</div>
                    <p className="text-xs text-amber-300/80">Explore full terminal with live test funds</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-400">Instant</span>
              </button>
            </div>

            <div className="mt-5 text-center text-xs text-slate-400">
              Don't have Nightly yet?{' '}
              <a
                href="https://nightly.app/"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:underline inline-flex items-center gap-1"
              >
                Get Nightly Wallet <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
