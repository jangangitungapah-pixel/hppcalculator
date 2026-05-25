import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';

export const AppShell = () => {
  const location = useLocation();
  const isWelcome = location.pathname === '/welcome';

  if (isWelcome) {
    return <Outlet />;
  }

  return (
    <div className="app-root">
      <div className="app-shell">
        <SidebarNav />
        
        <div className="app-main">
          <Header />
          
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  );
};
