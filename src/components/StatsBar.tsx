import React from 'react';
import { Activity, Layers, Coins, Cpu, Clock } from 'lucide-react';
import type { ChainHealth } from '../types';

interface StatsBarProps {
  health: ChainHealth | null;
}

export const StatsBar: React.FC<StatsBarProps> = ({ health }) => {
  const epoch = health?.epochInfo?.epoch ?? 59;
  const slot = health?.epochInfo?.absoluteSlot ?? 25895000;
  const txCount = health?.epochInfo?.transactionCount ?? 95280000;
  const blockHeight = health?.epochInfo?.blockHeight ?? 25449500;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 my-6">
      {/* Total Transactions */}
      <div className="glass-card rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Total Transactions</span>
          <Activity className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-2 font-mono text-lg font-bold text-white tracking-tight">
          {(txCount / 1_000_000).toFixed(2)}M
        </div>
        <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
          <span>●</span> <span>Sub-second Finality</span>
        </div>
      </div>

      {/* Current Slot & Block Height */}
      <div className="glass-card rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Slot / Height</span>
          <Layers className="h-4 w-4 text-purple-400" />
        </div>
        <div className="mt-2 font-mono text-lg font-bold text-white tracking-tight">
          #{(slot / 1_000_000).toFixed(2)}M
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Block: #{blockHeight.toLocaleString()}
        </div>
      </div>

      {/* Epoch Progress */}
      <div className="glass-card rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Active Epoch</span>
          <Clock className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="mt-2 font-mono text-lg font-bold text-white tracking-tight">
          Epoch {epoch}
        </div>
        <div className="text-[10px] text-cyan-300 mt-0.5">
          Slots: 432,000 / epoch
        </div>
      </div>

      {/* Transaction Fee */}
      <div className="glass-card rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Transfer Gas Fee</span>
          <Coins className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 font-mono text-lg font-bold text-emerald-400 tracking-tight">
          &lt;0.00001 COOK
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          ~$0.0000007 / tx
        </div>
      </div>

      {/* Deploy Cost */}
      <div className="glass-card rounded-xl p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Deploy Cost</span>
          <Cpu className="h-4 w-4 text-pink-400" />
        </div>
        <div className="mt-2 font-mono text-lg font-bold text-pink-300 tracking-tight">
          ~$0.05
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Program Deployments
        </div>
      </div>
    </div>
  );
};
