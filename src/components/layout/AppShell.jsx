import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';
import { AnimatePresence } from 'framer-motion';

export const AppShell = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const { t, lang } = useLanguage();
  const isWelcome = location.pathname === '/welcome';

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return t('nav.dashboard') || 'Dashboard';
    if (pathname.startsWith('/calculator')) return t('nav.calculate') || 'Hitung HPP';
    if (pathname.startsWith('/ingredients')) return t('nav.ingredients') || 'Bahan Baku';
    if (pathname.startsWith('/recipes')) return t('nav.recipes') || 'Resep';
    if (pathname.startsWith('/products')) return t('nav.products') || 'Produk/Menu';
    if (pathname.startsWith('/channel-pricing')) return 'Simulasi Harga';
    if (pathname.startsWith('/reports')) return t('nav.reports') || 'Laporan';
    if (pathname.startsWith('/data-backup')) return t('nav.dataBackup') || 'Data & Backup';
    if (pathname.startsWith('/history')) return t('nav.history') || 'Riwayat';
    if (pathname.startsWith('/settings')) return t('nav.settings') || 'Pengaturan';
    return '';
  };

  const pageTitle = getPageTitle(location.pathname);

  if (isWelcome) {
    return (
      <AnimatePresence mode="wait">
        {outlet && React.cloneElement(outlet, { key: location.pathname })}
      </AnimatePresence>
    );
  }

  return (
    <div className="app-root">
      <div className="app-shell">
        <SidebarNav />
        
        <div className="app-main">
          <Header title={pageTitle} />
          
          <main className="flex-1 overflow-x-hidden relative">
            <AnimatePresence mode="wait">
              {outlet && React.cloneElement(outlet, { key: location.pathname })}
            </AnimatePresence>
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  );
};
