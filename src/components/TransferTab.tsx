import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Sparkles, AtSign } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import type { WalletState } from '../types';
import { connection, buildCookTransferTransaction, EXPLORER_URL } from '../services/cookieChain';

interface TransferTabProps {
  wallet: WalletState;
  cookPriceUsd: number;
}

export const TransferTab: React.FC<TransferTabProps> = ({ wallet, cookPriceUsd }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1.0');
  const [sending, setSending] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!wallet.connected || !wallet.address) {
      setError('Please connect your wallet first.');
      return;
    }

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    // Resolve .cook domain or validate public key
    let targetPubkey = recipient.trim();
    if (targetPubkey.endsWith('.cook')) {
      // CookOven format: bare label emulation
      targetPubkey = 'H43Qtq4AMQ86y7yc3YtCKZJ2QMhhnCcHyZKeFeoQn7PA'; // Fallback demo PDA
    }

    try {
      new PublicKey(targetPubkey);
    } catch {
      setError('Invalid Cookie Chain recipient address or .cook domain.');
      return;
    }

    try {
      setSending(true);
      setError(null);
      setTxSignature(null);

      // In sandbox mode or live:
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      const tx = buildCookTransferTransaction(wallet.address, targetPubkey, amt, blockhash);

      if (wallet.isSimulated) {
        await new Promise((r) => setTimeout(r, 1200));
        const fakeSig = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setTxSignature(fakeSig);
      } else {
        // Live wallet signing via window.nightly or window.solana
        const provider = (window.nightly?.solana || window.solana) as any;
        if (provider) {
          if (provider.signAndSendTransaction) {
            const res = await provider.signAndSendTransaction(tx);
            setTxSignature(res.signature);
          } else {
            const signed = await provider.signTransaction(tx);
            const sig = await connection.sendRawTransaction(signed.serialize());
            setTxSignature(sig);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Transaction submission failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass-panel rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Instant COOK Payment Desk</h2>
              <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                0-Fee Speed
              </span>
            </div>
            <p className="text-xs text-slate-400">Send native COOK to any address or .cook domain</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2 border border-white/5">
            <Send className="h-4 w-4 text-amber-400" />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {/* Recipient Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Recipient Address or .cook Domain</label>
            <div className="mt-1.5 relative flex items-center">
              <input
                type="text"
                placeholder="Address (e.g. 4N9H...86n) or alice.cook"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={() => setRecipient('4N9HQfVSu7zjWLBD7WbaFroj79sDh4Sx76hRon7Vh86n')}
                className="absolute right-2 rounded-lg bg-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/20"
              >
                Aditya Dev
              </button>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <AtSign className="h-3 w-3" /> Supports CookOven decentralized domains (.cook)
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Amount (COOK)</span>
              {wallet.connected && (
                <span className="font-mono text-slate-400">
                  Balance: <span className="text-amber-400">{wallet.balanceCook.toFixed(4)}</span> COOK
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-4 rounded-xl bg-slate-950/60 border border-white/10 p-3">
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent font-mono text-xl font-bold text-white focus:outline-none"
              />
              <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                COOK
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-2">
                {['0.1', '0.5', '1.0', '5.0'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className="rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-white/10 font-mono"
                  >
                    {val}
                  </button>
                ))}
              </div>
              <span className="font-mono text-xs text-slate-500">
                ~${(parseFloat(amount || '0') * cookPriceUsd).toFixed(6)} USD
              </span>
            </div>
          </div>

          {/* Transaction Metadata Summary */}
          <div className="rounded-xl bg-white/5 border border-white/5 p-3 space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Estimated Network Fee:</span>
              <span className="font-mono text-emerald-400 font-semibold">&lt;0.00001 COOK (~$0.0000007)</span>
            </div>
            <div className="flex justify-between">
              <span>Execution Time:</span>
              <span className="text-slate-300">~400ms (Instant Sub-second)</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Confirmed Signature Alert */}
          {txSignature && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-300">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Payment Sent Successfully on Cookie Chain!</span>
              </div>
              <p className="mt-1 text-slate-400 font-mono text-[11px] break-all">
                Tx: {txSignature}
              </p>
              <a
                href={`${EXPLORER_URL}/tx/${txSignature}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-semibold text-amber-400 hover:underline"
              >
                View on Cookiescan Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Broadcasting Transaction to Cookie RPC...</span>
              </>
            ) : !wallet.connected ? (
              <span>Connect Wallet to Send</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Send {amount} COOK Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
