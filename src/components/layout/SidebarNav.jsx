import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { useSync } from '../../hooks/useSync';
import { LayoutDashboard, Calculator, History, Settings, Sparkles, BookOpen, Package, Apple, TrendingUp, BarChart3, Database, ShieldCheck, Store, ListChecks, UserCircle, Cloud, PackageSearch } from 'lucide-react';
import { cn } from '../../lib/ui/cn';
import { motion } from 'framer-motion';

export const SidebarNav = () => {
  const { t, lang } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { syncStatus } = useSync();

  const navGroups = [
    {
      label: lang === 'id' ? 'Menu Utama' : 'Main Menu',
      items: [
        { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav.dashboard') },
        { to: '/calculator', icon: <Calculator className="w-5 h-5" />, label: t('nav.calculate') },
      ]
    },
    {
      label: lang === 'id' ? 'Biaya & Resep' : 'Costing',
      items: [
        { to: '/ingredients', icon: <Apple className="w-5 h-5" />, label: t('nav.ingredients') },
        { to: '/recipes', icon: <BookOpen className="w-5 h-5" />, label: t('nav.recipes') },
        { to: '/products', icon: <Package className="w-5 h-5" />, label: t('nav.products') },
        { to: '/inventory', icon: <PackageSearch className="w-5 h-5" />, label: lang === 'id' ? 'Inventory' : 'Inventory' },
      ]
    },
    {
      label: lang === 'id' ? 'Harga Jual' : 'Pricing',
      items: [
        { to: '/channel-pricing', icon: <TrendingUp className="w-5 h-5" />, label: lang === 'id' ? 'Simulasi Harga' : 'Pricing Simulation' },
        { to: '/channel-profiles', icon: <Store className="w-5 h-5" />, label: lang === 'id' ? 'Profil Channel' : 'Channel Profiles' },
        { to: '/simulations', icon: <ListChecks className="w-5 h-5" />, label: lang === 'id' ? 'Riwayat Simulasi' : 'Simulation History' },
      ]
    },
    {
      label: lang === 'id' ? 'Bisnis & Laporan' : 'Business',
      items: [
        { to: '/reports', icon: <BarChart3 className="w-5 h-5" />, label: t('nav.reports') || 'Laporan' },
        { to: '/history', icon: <History className="w-5 h-5" />, label: t('nav.history') },
      ]
    },
    {
      label: lang === 'id' ? 'Alat & Sistem' : 'Tools & System',
      items: [
        { to: '/data-backup', icon: <Database className="w-5 h-5" />, label: t('nav.dataBackup') || 'Data & Backup' },
        { to: '/sync', icon: <Cloud className="w-5 h-5" />, label: t('sync.title', 'Sync Center') },
        { to: '/account', icon: <UserCircle className="w-5 h-5" />, label: lang === 'id' ? 'Akun Saya' : 'My Account' },
        { to: '/settings', icon: <Settings className="w-5 h-5" />, label: t('nav.settings') },
      ]
    }
  ];

  const getSyncDotColor = () => {
    switch (syncStatus) {
      case 'synced': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'syncing': return 'bg-orange-500 animate-pulse';
      case 'error': return 'bg-red-500 animate-ping';
      case 'offline':
      default: return 'bg-amber-500';
    }
  };

  const getSyncLabel = () => {
    switch (syncStatus) {
      case 'synced': return lang === 'id' ? 'Tersinkron' : 'Synced';
      case 'syncing': return lang === 'id' ? 'Sinkronisasi...' : 'Syncing...';
      case 'error': return lang === 'id' ? 'Gagal Sinkron' : 'Sync Error';
      case 'offline': return lang === 'id' ? 'Mode Offline' : 'Offline Mode';
      default: return lang === 'id' ? 'Lokal' : 'Local';
    }
  };

  return (
    <aside className="app-sidebar bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-r border-white/5">
      <div className="p-3">
        <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-xl p-3 flex items-center shadow-lg">
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-brand-primary opacity-20 blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg mr-3 shadow-glow-primary bg-gradient-to-br from-brand-primary to-accent-coral text-white shrink-0 relative z-10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="font-extrabold text-base tracking-tight text-white">{t('app.name')}</span>
            <span className="text-[9px] text-white/50 font-bold tracking-widest uppercase">F&B Business</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav-container">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-1.5 last:mb-0">
            <div className="sidebar-group-label text-white/40">{group.label}</div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn("relative flex items-center p-1.5 rounded-xl group transition-all duration-200 min-h-11", !isActive && "hover:bg-white/5")}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-white shadow-sm rounded-xl border border-black/5"
                          initial={false}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 shrink-0",
                          isActive ? "text-brand-primary" : "text-white/60 group-hover:text-white"
                        )}>
                          <span className={cn("transition-transform duration-300 group-hover:scale-105", isActive && "scale-110")}>
                            {item.icon}
                          </span>
                        </div>
                        <span className={cn("truncate text-sm font-semibold tracking-wide transition-colors duration-300", isActive ? "text-brand-primary font-bold" : "text-white/70 group-hover:text-white")}>{item.label}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 mt-auto border-t border-white/5">
        {isAuthenticated && user ? (
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary text-sm font-black relative shrink-0">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-zinc-900 ${getSyncDotColor()}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
              </p>
              <p className="text-[10px] text-white/40 truncate mt-0.5 font-semibold leading-tight">
                {getSyncLabel()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-white/20 transition-all duration-300">
            <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 text-brand-primary">
              <ShieldCheck className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="font-extrabold text-white text-[10px] tracking-wider uppercase">Local-first MVP</p>
            </div>
            <p className="text-white/60 text-[11px] leading-relaxed relative z-10 font-semibold">
              {lang === 'id' ? 'Data tersimpan aman di browser Anda.' : 'Your data is securely stored in this browser.'}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
