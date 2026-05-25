import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, History, Settings, Sparkles, BookOpen, Package, Apple, TrendingUp, BarChart3, Database } from 'lucide-react';

export const SidebarNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav.dashboard') },
    { to: '/calculator', icon: <Calculator className="w-5 h-5" />, label: t('nav.calculate') },
    { to: '/ingredients', icon: <Apple className="w-5 h-5" />, label: t('nav.ingredients') },
    { to: '/recipes', icon: <BookOpen className="w-5 h-5" />, label: t('nav.recipes') },
    { to: '/products', icon: <Package className="w-5 h-5" />, label: t('nav.products') },
    { to: '/channel-pricing', icon: <TrendingUp className="w-5 h-5" />, label: "Simulasi Harga" },
    { to: '/reports', icon: <BarChart3 className="w-5 h-5" />, label: t('nav.reports') || 'Reports' },
    { to: '/data-backup', icon: <Database className="w-5 h-5" />, label: t('nav.dataBackup') || 'Data & Backup' },
    { to: '/history', icon: <History className="w-5 h-5" />, label: t('nav.history') },
    { to: '/settings', icon: <Settings className="w-5 h-5" />, label: t('nav.settings') },
  ];

  return (
    <aside className="app-sidebar">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 text-brand-primary">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold text-xl">{t('app.name')}</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="p-4 bg-brand-soft rounded-lg text-sm">
          <p className="font-semibold text-brand-primary mb-1">Modalin MVP</p>
          <p className="text-text-secondary text-xs">{t('app.shortDescription')}</p>
        </div>
      </div>
    </aside>
  );
};
