import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { PageContainer } from '../components/layout/PageContainer';
import { 
  TrendingUp, 
  Store, 
  ListChecks, 
  BarChart3, 
  History, 
  UserCircle, 
  Cloud, 
  Database, 
  Settings
} from 'lucide-react';
import { FadeIn } from '../components/motion/FadeIn';
import { StaggerContainer } from '../components/motion/StaggerContainer';

export const MorePage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const menuItems = [
    {
      to: '/channel-pricing',
      icon: <TrendingUp className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-brand-primary" />,
      title: lang === 'id' ? 'Simulasi' : 'Pricing',
      color: 'bg-orange-500/10'
    },
    {
      to: '/channel-profiles',
      icon: <Store className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-emerald-600" />,
      title: lang === 'id' ? 'Profil' : 'Channels',
      color: 'bg-emerald-500/10'
    },
    {
      to: '/simulations',
      icon: <ListChecks className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-blue-600" />,
      title: lang === 'id' ? 'Riwayat Sim' : 'Sim History',
      color: 'bg-blue-500/10'
    },
    {
      to: '/reports',
      icon: <BarChart3 className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-purple-600" />,
      title: t('nav.reports', 'Laporan'),
      color: 'bg-purple-500/10'
    },
    {
      to: '/history',
      icon: <History className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-600" />,
      title: t('nav.history', 'Riwayat HPP'),
      color: 'bg-indigo-500/10'
    },
    {
      to: '/account',
      icon: <UserCircle className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-rose-600" />,
      title: lang === 'id' ? 'Akun Saya' : 'My Account',
      color: 'bg-rose-500/10'
    },
    {
      to: '/sync',
      icon: <Cloud className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-sky-600" />,
      title: lang === 'id' ? 'Sync' : 'Sync',
      color: 'bg-sky-500/10'
    },
    {
      to: '/data-backup',
      icon: <Database className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-amber-600" />,
      title: lang === 'id' ? 'Backup' : 'Backup',
      color: 'bg-amber-500/10'
    },
    {
      to: '/settings',
      icon: <Settings className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-zinc-650" />,
      title: t('nav.settings', 'Pengaturan'),
      color: 'bg-zinc-500/10'
    }
  ];

  return (
    <PageContainer maxWidth="max-w-md" className="py-2 sm:py-4 pb-12 sm:pb-24">
      <div className="mb-3 sm:mb-5 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-black text-text-primary mb-0.5 tracking-tight">
          {lang === 'id' ? 'Menu Lainnya' : 'More Menu'}
        </h2>
        <p className="text-[10px] sm:text-xs font-semibold text-text-secondary">
          {lang === 'id' ? 'Jelajahi fitur pelengkap & pengaturan' : 'Explore supplementary features & settings'}
        </p>
      </div>

      <StaggerContainer className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {menuItems.map((item, idx) => (
          <FadeIn key={idx}>
            <button
              onClick={() => navigate(item.to)}
              className="w-full h-18 sm:h-24 flex flex-col items-center justify-center p-1.5 sm:p-2.5 border border-border-soft hover:border-brand-primary/30 bg-surface rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer group"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform duration-300`}>
                {item.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight leading-tight text-center mt-1.5 sm:mt-2 text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1 max-w-full px-0.5">
                {item.title}
              </span>
            </button>
          </FadeIn>
        ))}
      </StaggerContainer>
    </PageContainer>
  );
};
