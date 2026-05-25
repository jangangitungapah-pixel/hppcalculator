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
      label: "Main",
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
      label: "System",
      items: [
        { to: '/data-backup', icon: <Database className="w-5 h-5" />, label: t('nav.dataBackup') || 'Data & Backup' },
        { to: '/settings', icon: <Settings className="w-5 h-5" />, label: t('nav.settings') },
      ]
    }
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-header">
        <div className="sidebar-logo-container relative z-10">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col relative z-10">
          <span className="sidebar-brand-title">{t('app.name')}</span>
          <span className="text-[10px] text-white/50 font-medium tracking-wide">F&B BUSINESS ASSISTANT</span>
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
                  className={({ isActive }) => cn("nav-link", isActive && "nav-link-active")}
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <span className={cn("transition-transform duration-300", isActive && "scale-110")}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
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
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-sm relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ShieldCheck className="w-16 h-16" />
          </div>
          <p className="font-bold text-white mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-good animate-pulse"></span>
            Local-first MVP
          </p>
          <p className="text-white/60 text-[11px] leading-relaxed relative z-10">
            Data tersimpan aman di dalam browser Anda. Tidak ada data yang dikirim ke server.
          </p>
        </div>
      </div>
    </aside>
  );
};
