import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, History, Settings, Sparkles, BookOpen, Package, Apple, TrendingUp, BarChart3, Database, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/ui/cn';
import { motion } from 'framer-motion';

export const SidebarNav = () => {
  const { t } = useLanguage();

  const navGroups = [
    {
      label: "Main Menu",
      items: [
        { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav.dashboard') },
        { to: '/calculator', icon: <Calculator className="w-5 h-5" />, label: t('nav.calculate') },
      ]
    },
    {
      label: "Costing",
      items: [
        { to: '/ingredients', icon: <Apple className="w-5 h-5" />, label: t('nav.ingredients') },
        { to: '/recipes', icon: <BookOpen className="w-5 h-5" />, label: t('nav.recipes') },
        { to: '/products', icon: <Package className="w-5 h-5" />, label: t('nav.products') },
      ]
    },
    {
      label: "Pricing",
      items: [
        { to: '/channel-pricing', icon: <TrendingUp className="w-5 h-5" />, label: "Simulasi Harga" },
      ]
    },
    {
      label: "Business",
      items: [
        { to: '/reports', icon: <BarChart3 className="w-5 h-5" />, label: t('nav.reports') || 'Reports' },
        { to: '/history', icon: <History className="w-5 h-5" />, label: t('nav.history') },
      ]
    },
    {
      label: "Tools & System",
      items: [
        { to: '/data-backup', icon: <Database className="w-5 h-5" />, label: t('nav.dataBackup') || 'Data & Backup' },
        { to: '/settings', icon: <Settings className="w-5 h-5" />, label: t('nav.settings') },
      ]
    }
  ];

  return (
    <aside className="app-sidebar">
      <div className="p-4">
        <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center shadow-lg">
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-brand-primary opacity-20 blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-3 shadow-glow-primary bg-gradient-to-br from-brand-primary to-accent-coral text-white shrink-0 relative z-10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="font-extrabold text-lg tracking-tight text-white">{t('app.name')}</span>
            <span className="text-[9px] text-white/50 font-bold tracking-widest uppercase">F&B Business</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav-container">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-2 last:mb-0">
            <div className="sidebar-group-label">{group.label}</div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn("relative flex items-center p-2 rounded-xl group transition-colors", !isActive && "hover:bg-white/5")}
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
                          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                          isActive ? "text-brand-primary" : "text-white/60 group-hover:text-white"
                        )}>
                          <span className={cn("transition-transform duration-300", isActive && "scale-110")}>
                            {item.icon}
                          </span>
                        </div>
                        <span className={cn("truncate font-semibold tracking-wide transition-colors duration-300", isActive ? "text-brand-primary" : "text-white/70 group-hover:text-white")}>{item.label}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-white/20 transition-all duration-300">
          <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 text-brand-primary">
            <ShieldCheck className="w-20 h-20" />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-good opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-good"></span>
            </span>
            <p className="font-bold text-white text-xs tracking-wider uppercase">Local-first MVP</p>
          </div>
          <p className="text-white/60 text-[11px] leading-relaxed relative z-10 font-medium">
            Data aman tersimpan di browser Anda. Tidak ada data yang dikirim ke server.
          </p>
        </div>
      </div>
    </aside>
  );
};
