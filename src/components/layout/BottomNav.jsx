import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, History, Settings, BookOpen, Package, Apple, TrendingUp, BarChart3 } from 'lucide-react';

export const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Don't show bottom nav on result screen or welcome screen to maximize space
  const hiddenRoutes = ['/welcome', '/calculator/result'];
  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-6 h-6" />, label: t('nav.dashboard') },
    { to: '/calculator', icon: <Calculator className="w-6 h-6" />, label: t('nav.calculate') },
    { to: '/ingredients', icon: <Apple className="w-6 h-6" />, label: t('nav.ingredients') },
    { to: '/recipes', icon: <BookOpen className="w-6 h-6" />, label: t('nav.recipes') },
    { to: '/products', icon: <Package className="w-6 h-6" />, label: t('nav.products') },
    { to: '/channel-pricing', icon: <TrendingUp className="w-6 h-6" />, label: "Simulasi" },
    { to: '/reports', icon: <BarChart3 className="w-6 h-6" />, label: t('nav.reports') },
    { to: '/history', icon: <History className="w-6 h-6" />, label: t('nav.history') },
    { to: '/settings', icon: <Settings className="w-6 h-6" />, label: t('nav.settings') },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border pb-safe z-nav flex overflow-x-auto hide-scrollbar">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `
            flex-none w-[72px] flex flex-col items-center justify-center py-2 min-h-[60px] gap-1
            ${isActive ? 'text-brand-primary' : 'text-text-secondary'}
          `}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
