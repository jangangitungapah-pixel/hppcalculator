import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/ui/cn';
import { OfflineBadge } from '../pwa/OfflineBadge';
import { useSync } from '../../hooks/useSync';

export const Header = ({ title }) => {
  const { t } = useLanguage();
  const { syncStatus } = useSync();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface-glass border-b border-white/20 shadow-sm transition-premium">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-page mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-coral text-white shadow-sm shadow-glow-primary transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-text-primary hidden sm:inline-block">
              {t('app.name')}
            </span>
          </Link>
          
          {title && (
            <div className="flex items-center gap-3">
              <span className="text-border-strong hidden lg:inline-block">|</span>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-text-primary truncate">
                {title}
              </h1>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-accent-gold/20 to-primary/20 text-primary-active border border-accent-gold/30 rounded-full hidden sm:inline-flex shadow-sm">
            Premium MVP
          </span>
          <Link to="/sync" className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm flex items-center transition-colors", 
            syncStatus === 'synced' ? "bg-success-50 text-success-700 border-success-200 hover:bg-success-100" :
            syncStatus === 'syncing' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/20" :
            syncStatus === 'error' ? "bg-error-50 text-error-700 border-error-200 hover:bg-error-100" :
            syncStatus === 'offline' ? "bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100" :
            syncStatus === 'local_unapproved' ? "bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100" :
            syncStatus === 'ready' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/20" :
            "bg-surface-alt text-text-tertiary border-border hover:bg-surface-muted"
          )}>
            {
              syncStatus === 'syncing' ? 'Syncing' :
              syncStatus === 'synced' ? 'Synced' :
              syncStatus === 'error' ? 'Sync Error' :
              syncStatus === 'offline' ? 'Offline' :
              syncStatus === 'local_unapproved' ? 'Local akun' :
              syncStatus === 'ready' ? 'Siap Sync' :
              'Local'
            }
          </Link>
          <OfflineBadge />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};
