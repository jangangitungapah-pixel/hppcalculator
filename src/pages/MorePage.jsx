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
      description: lang === 'id' ? 'Hitung harga jual per channel' : 'Calculate channel prices',
      color: 'bg-orange-500/10'
    },
    {
      to: '/channel-profiles',
      icon: <Store className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-emerald-600" />,
      title: lang === 'id' ? 'Profil' : 'Channels',
      description: lang === 'id' ? 'Kelola biaya marketplace' : 'Manage channel fees',
      color: 'bg-emerald-500/10'
    },
    {
      to: '/simulations',
      icon: <ListChecks className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-blue-600" />,
      title: lang === 'id' ? 'Riwayat Sim' : 'Sim History',
      description: lang === 'id' ? 'Lihat simulasi tersimpan' : 'View saved simulations',
      color: 'bg-blue-500/10'
    },
    {
      to: '/reports',
      icon: <BarChart3 className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-purple-600" />,
      title: t('nav.reports', 'Laporan'),
      description: lang === 'id' ? 'Ringkasan margin dan performa' : 'Margin and performance summary',
      color: 'bg-purple-500/10'
    },
    {
      to: '/history',
      icon: <History className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-600" />,
      title: t('nav.history', 'Riwayat HPP'),
      description: lang === 'id' ? 'Audit kalkulasi HPP lama' : 'Review previous HPP runs',
      color: 'bg-indigo-500/10'
    },
    {
      to: '/account',
      icon: <UserCircle className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-rose-600" />,
      title: lang === 'id' ? 'Akun Saya' : 'My Account',
      description: lang === 'id' ? 'Profil dan status akun' : 'Profile and account status',
      color: 'bg-rose-500/10'
    },
    {
      to: '/sync',
      icon: <Cloud className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-sky-600" />,
      title: lang === 'id' ? 'Sync' : 'Sync',
      description: lang === 'id' ? 'Sinkronisasi data cloud' : 'Cloud data sync',
      color: 'bg-sky-500/10'
    },
    {
      to: '/data-backup',
      icon: <Database className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-amber-600" />,
      title: lang === 'id' ? 'Backup' : 'Backup',
      description: lang === 'id' ? 'Export, import, dan reset data' : 'Export, import, and reset data',
      color: 'bg-amber-500/10'
    },
    {
      to: '/settings',
      icon: <Settings className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-zinc-650" />,
      title: t('nav.settings', 'Pengaturan'),
      description: lang === 'id' ? 'Preferensi aplikasi' : 'Application preferences',
      color: 'bg-zinc-500/10'
    }
  ];

  return (
    <PageContainer maxWidth="max-w-5xl" className="more-page">
      <section className="app-page-hero more-hero">
        <div className="app-page-hero-main">
          <div className="app-page-eyebrow">
            <Settings className="w-4 h-4" aria-hidden="true" />
            Toolbox
          </div>
          <h2 className="app-page-title">
          {lang === 'id' ? 'Menu Lainnya' : 'More Menu'}
          </h2>
          <p className="app-page-subtitle">
          {lang === 'id' ? 'Jelajahi fitur pelengkap & pengaturan' : 'Explore supplementary features & settings'}
          </p>
        </div>
      </section>

      <StaggerContainer className="more-grid">
        {menuItems.map((item, idx) => (
          <FadeIn key={idx}>
            <button
              onClick={() => navigate(item.to)}
              className="more-tool-card"
            >
              <div className={`more-tool-icon ${item.color}`}>
                {item.icon}
              </div>
              <div className="min-w-0 text-left">
                <span className="more-tool-title">{item.title}</span>
                <span className="more-tool-description">{item.description}</span>
              </div>
            </button>
          </FadeIn>
        ))}
      </StaggerContainer>
    </PageContainer>
  );
};
