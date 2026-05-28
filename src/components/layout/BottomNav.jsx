import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { LayoutDashboard, Calculator, BookOpen, Package, Apple, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/ui/cn';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();

  const hiddenRoutes = ['/welcome'];
  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-[20px] h-[20px]" />, label: t('nav.dashboard'), ariaLabel: t('nav.dashboard') },
    { to: '/calculator', icon: <Calculator className="w-[20px] h-[20px]" />, label: t('nav.calculate'), ariaLabel: t('nav.calculate') },
    { to: '/ingredients', icon: <Apple className="w-[20px] h-[20px]" />, label: lang === 'id' ? 'Bahan' : 'Stock', ariaLabel: t('nav.ingredients') },
    { to: '/recipes', icon: <BookOpen className="w-[20px] h-[20px]" />, label: t('nav.recipes'), ariaLabel: t('nav.recipes') },
    { to: '/products', icon: <Package className="w-[20px] h-[20px]" />, label: lang === 'id' ? 'Produk' : 'Items', ariaLabel: t('nav.products') },
    { to: '/more', icon: <MoreHorizontal className="w-[20px] h-[20px]" />, label: lang === 'id' ? 'Lainnya' : 'More', ariaLabel: lang === 'id' ? 'Lainnya' : 'More' },
  ];

  return (
    <nav className="app-bottom-nav bg-white/90 backdrop-blur-xl border border-border-soft rounded-3xl shadow-floating" aria-label="Navigasi utama">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              "bottom-nav-item flex flex-col items-center justify-center relative py-1 rounded-xl transition-all duration-300", 
              isActive ? "text-brand-primary font-bold" : "text-text-muted hover:text-text-secondary"
            )}
            aria-label={item.ariaLabel}
          >
            {isActive && (
              <motion.div 
                layoutId="bottom-nav-active"
                className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-r from-orange-500/[0.06] to-amber-500/[0.06] border border-orange-500/10 rounded-2xl z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <motion.span 
              className="bottom-nav-icon relative z-10 block"
              animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {item.icon}
            </motion.span>
            <span className="bottom-nav-label relative z-10 mt-1 text-[9px] font-extrabold uppercase tracking-wide truncate max-w-full">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
