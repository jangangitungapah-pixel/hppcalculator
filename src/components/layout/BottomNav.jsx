import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, BookOpen, Package, Apple, MoreHorizontal } from 'lucide-react';
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
    { to: '/settings', icon: <MoreHorizontal className="w-[22px] h-[22px]" />, label: 'More' },
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
