import React, { useState } from 'react';
import { Terminal, Play, Bot, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { getChainHealth, fetchSwapQuote, fetchTokens } from '../services/cookieChain';

export const AgentTab: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('get_chain_health');
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const tools = [
    {
      id: 'get_chain_health',
      name: 'get_chain_health',
      desc: 'Verify SVM node status, solana-core 4.1.2, and feature sets',
    },
    {
      id: 'get_epoch_info',
      name: 'get_epoch_info',
      desc: 'Audit real-time slots, block height, and 95M+ tx count',
    },
    {
      id: 'quote_swap',
      name: 'quote_swap (Cookiebox)',
      desc: 'Route optimal swap liquidity for 1.0 COOK to bCOOK',
    },
    {
      id: 'fetch_tokens',
      name: 'fetch_tokens (Cookie DAS)',
      desc: 'Query live token registry and price feed for COOK',
    },
  ];

  const handleRunTool = async () => {
    setRunning(true);
    setOutput(null);

    try {
      if (selectedTool === 'get_chain_health') {
        const res = await getChainHealth();
        setOutput(
          JSON.stringify(
            {
              status: 'success',
              tool: 'get_chain_health',
              runtime: 'Cookie Chain SVM',
              rpcEndpoint: 'https://rpc.cookiescan.io',
              result: res,
            },
            null,
            2
          )
        );
      } else if (selectedTool === 'get_epoch_info') {
        const res = await getChainHealth();
        setOutput(
          JSON.stringify(
            {
              status: 'success',
              tool: 'get_epoch_info',
              epochInfo: res.epochInfo,
              note: 'Sub-second slot intervals on Cookie Chain SVM',
            },
            null,
            2
          )
        );
      } else if (selectedTool === 'quote_swap') {
        const res = await fetchSwapQuote(
          'So11111111111111111111111111111111111111112',
          'EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz',
          1_000_000_000
        );
        setOutput(
          JSON.stringify(
            {
              status: 'success',
              tool: 'quote_swap',
              aggregator: 'Cookiebox Swap API (agg.cookiebox.app)',
              pair: 'COOK / bCOOK',
              amountInLamports: '1000000000',
              route: res,
            },
            null,
            2
          )
        );
      } else if (selectedTool === 'fetch_tokens') {
        const res = await fetchTokens();
        setOutput(
          JSON.stringify(
            {
              status: 'success',
              tool: 'fetch_tokens',
              source: 'api.cookiescan.io (Cookie DAS API)',
              tokenCount: res.count,
              cookUsd: res.cookUsd,
              topTokensSample: res.tokens.slice(0, 3).map((t) => ({
                mint: t.mint,
                symbol: t.metadata?.symbol,
                name: t.metadata?.name,
                priceUsd: t.price?.usd,
              })),
            },
            null,
            2
          )
        );
      }
    } catch (err: any) {
      setOutput(JSON.stringify({ status: 'error', message: err.message }, null, 2));
    } finally {
      setRunning(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Autonomous Agent MCP Console</h2>
            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
              cookie-mcp
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test and simulate Model Context Protocol (MCP) agent tools directly against Cookie Chain
          </p>
        </div>
        <div className="font-mono text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
          npx -y cookie-mcp
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tool Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Agent Tools</label>
          <div className="space-y-2">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTool(t.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedTool === t.id
                    ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-md'
                    : 'glass-card border-white/5 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="font-mono text-xs font-bold text-amber-300">{t.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleRunTool}
            disabled={running}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            {running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            <span>Execute Agent Tool</span>
          </button>
        </div>

        {/* Live Terminal Output */}
        <div className="md:col-span-2 glass-panel rounded-2xl border border-white/10 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>agent-terminal :: {selectedTool}</span>
            </div>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-slate-300 hover:bg-white/20"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="mt-3 flex-1 min-h-[260px] max-h-[360px] overflow-y-auto rounded-xl bg-slate-950/80 p-4 font-mono text-xs text-emerald-400 border border-white/5">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-600 space-y-2 py-12">
                <Sparkles className="h-6 w-6 text-slate-700" />
                <p>Click "Execute Agent Tool" to inspect real-time JSON payloads from Cookie Chain.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
