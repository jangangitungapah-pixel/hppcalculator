import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, BookOpen, Package, Apple, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/ui/cn';

export const BottomNav = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();

  const hiddenRoutes = ['/welcome'];
  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-[22px] h-[22px]" />, label: lang === 'en' ? 'Home' : 'Home', ariaLabel: t('nav.dashboard') },
    { to: '/calculator', icon: <Calculator className="w-[22px] h-[22px]" />, label: t('nav.calculate'), ariaLabel: t('nav.calculate') },
    { to: '/ingredients', icon: <Apple className="w-[22px] h-[22px]" />, label: lang === 'en' ? 'Stock' : 'Bahan', ariaLabel: t('nav.ingredients') },
    { to: '/recipes', icon: <BookOpen className="w-[22px] h-[22px]" />, label: t('nav.recipes'), ariaLabel: t('nav.recipes') },
    { to: '/products', icon: <Package className="w-[22px] h-[22px]" />, label: lang === 'en' ? 'Items' : 'Produk', ariaLabel: t('nav.products') },
    { to: '/settings', icon: <MoreHorizontal className="w-[22px] h-[22px]" />, label: lang === 'en' ? 'More' : 'Lainnya', ariaLabel: lang === 'en' ? 'More' : 'Lainnya' },
  ];

  return (
    <>
      <nav className="app-bottom-nav" aria-label="Navigasi utama">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn("bottom-nav-item", isActive && "bottom-nav-item-active")}
            aria-label={item.ariaLabel}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
