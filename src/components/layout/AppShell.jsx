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
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <Header />
        
        <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
