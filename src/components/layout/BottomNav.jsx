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
    <nav className="app-bottom-nav hide-scrollbar overflow-x-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => 
            `bottom-nav-item flex-none w-[72px] min-h-[60px] ${isActive ? 'bottom-nav-item-active' : ''}`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
