import React, { useState } from 'react';
import { ArrowRightLeft, ExternalLink, ShieldCheck, Info } from 'lucide-react';

export const BridgeTab: React.FC = () => {
  const [direction, setDirection] = useState<'solana_to_cookie' | 'cookie_to_solana'>('solana_to_cookie');
  const [bridgeAmount, setBridgeAmount] = useState('1000');

  const amt = parseFloat(bridgeAmount) || 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Hyperlane Cross-Chain COOK Bridge</h2>
              <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                1:1 Pegged
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Transfer COOK seamlessly between Solana Mainnet and Cookie Chain SVM
            </p>
          </div>
          <a
            href="https://www.cookiechain.wtf/bridge"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Launch Official Bridge</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Bridge Calculator & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Calculator */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bridge Direction</span>
              <button
                onClick={() =>
                  setDirection(direction === 'solana_to_cookie' ? 'cookie_to_solana' : 'solana_to_cookie')
                }
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-white/20 transition-all"
              >
                <ArrowRightLeft className="h-3 w-3" /> Switch
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/60 border border-white/10 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-xs font-bold text-white">
                  {direction === 'solana_to_cookie' ? 'SOL' : 'COOK'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {direction === 'solana_to_cookie' ? 'Solana Mainnet' : 'Cookie Chain (SVM)'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {direction === 'solana_to_cookie' ? 'Token-2022 SPL (6 decimals)' : 'Native COOK (9 decimals)'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">FROM</span>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-400">Amount to Bridge</label>
              <div className="mt-1.5 flex items-center justify-between rounded-xl bg-slate-950/60 border border-white/10 p-3">
                <input
                  type="number"
                  min="0"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  className="w-full bg-transparent font-mono text-xl font-bold text-white focus:outline-none"
                />
                <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
                  COOK
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/60 border border-white/10 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 text-xs font-bold text-slate-950">
                  {direction === 'solana_to_cookie' ? 'COOK' : 'SOL'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {direction === 'solana_to_cookie' ? 'Cookie Chain (SVM)' : 'Solana Mainnet'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {direction === 'solana_to_cookie' ? 'Native COOK (9 decimals)' : 'Token-2022 SPL (6 decimals)'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-mono">TO</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Conversion Ratio:</span>
              <span className="font-mono text-white font-semibold">1 : 1 Exactly</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Est. Output:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {amt.toLocaleString()} COOK
              </span>
            </div>
          </div>
        </div>

        {/* Technical Architecture & Contracts */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Verified On-Chain Contracts</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Hyperlane Warp Route deployment contracts verified on mainnet
            </p>

            <div className="mt-4 space-y-3 font-mono text-[11px]">
              <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                <div className="text-slate-400 font-sans text-xs">Cookie Warp Program</div>
                <div className="text-amber-400 mt-0.5 break-all">
                  Aa9wq46NB7qkg1amnBuMRsV1DunmkPHuoRLWZgWiBKdn
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                <div className="text-slate-400 font-sans text-xs">Solana Warp Program</div>
                <div className="text-purple-300 mt-0.5 break-all">
                  B1C91jLcqXYYz57bBWR8dSEjBrJDhWSeNokZ5SDEopu3
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                <div className="text-slate-400 font-sans text-xs">Solana SPL Mint (Token-2022)</div>
                <div className="text-slate-200 mt-0.5 break-all">
                  36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-300 flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Bridge finality takes approx 1-3 minutes depending on Solana block confirmations. Native COOK is unlocked
              automatically upon Hyperlane relayer delivery.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
