import React from 'react';
import { Cookie, ExternalLink, Code, MessageSquare, Send, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/40 py-10 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">CookieTerminal</div>
            <p className="text-xs text-slate-500">Built for Cookie Chain (SVM) · Open Source</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <a
            href="https://www.cookiechain.wtf"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Homepage</span>
          </a>
          <a
            href="https://docs.cookiechain.wtf"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Docs</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://cookiescan.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Explorer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://www.cookiechain.wtf/bridge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Hyperlane Bridge</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/1234adi1234/cookie-terminal"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Code className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://x.com/TheCookieChain"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>@TheCookieChain</span>
          </a>
          <a
            href="https://t.me/TheCookieNetChain"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Telegram</span>
          </a>
        </div>

        <div className="text-xs text-slate-500">
          Powered by Cookie Chain SVM & Superteam Earn
        </div>
      </div>
    </footer>
  );
};
