import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';
import { AnimatePresence } from 'framer-motion';

export const AppShell = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const isWelcome = location.pathname === '/welcome';

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
          <Header />
          
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
