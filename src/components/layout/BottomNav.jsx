import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, History, Settings, BookOpen, Package, Apple, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/ui/cn';

export const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const hiddenRoutes = ['/welcome', '/calculator/result'];
  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-[22px] h-[22px]" />, label: t('nav.dashboard') },
    { to: '/calculator', icon: <Calculator className="w-[22px] h-[22px]" />, label: t('nav.calculate') },
    { to: '/ingredients', icon: <Apple className="w-[22px] h-[22px]" />, label: t('nav.ingredients') },
    { to: '/recipes', icon: <BookOpen className="w-[22px] h-[22px]" />, label: t('nav.recipes') },
    { to: '/products', icon: <Package className="w-[22px] h-[22px]" />, label: t('nav.products') },
    { to: '/channel-pricing', icon: <TrendingUp className="w-[22px] h-[22px]" />, label: "Simulasi" },
    { to: '/reports', icon: <BarChart3 className="w-[22px] h-[22px]" />, label: t('nav.reports') },
    { to: '/history', icon: <History className="w-[22px] h-[22px]" />, label: t('nav.history') },
    { to: '/settings', icon: <Settings className="w-[22px] h-[22px]" />, label: t('nav.settings') },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <nav className="app-bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn("bottom-nav-item", isActive && "bottom-nav-item-active")}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
