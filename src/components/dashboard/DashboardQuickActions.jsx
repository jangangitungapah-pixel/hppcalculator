import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardActionCard } from './DashboardActionCard';
import { Calculator, BookOpen, Box, ShoppingBag, Store, BarChart3, Database, RefreshCw } from 'lucide-react';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';

export const DashboardQuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Hitung HPP',
      description: 'Hitung modal & harga jual',
      icon: Calculator,
      color: 'orange',
      route: '/calculator'
    },
    {
      title: 'Resep Makanan',
      description: 'Kelola resep rahasia',
      icon: BookOpen,
      color: 'green',
      route: '/recipes'
    },
    {
      title: 'Bahan Baku',
      description: 'Pantau harga bahan mentah',
      icon: Box,
      color: 'blue',
      route: '/ingredients'
    },
    {
      title: 'Simulasi Harga',
      description: 'Atur harga dine-in & ojol',
      icon: ShoppingBag,
      color: 'gold',
      route: '/channel-pricing'
    },
    {
      title: 'Profil Channel',
      description: 'Atur komisi & diskon ojol',
      icon: Store,
      color: 'blue',
      route: '/channel-profiles'
    },
    {
      title: 'Laporan Bisnis',
      description: 'Analisis performa & untung',
      icon: BarChart3,
      color: 'green',
      route: '/reports'
    },
    {
      title: 'Ekspor & Backup',
      description: 'Cadangkan data lokal Anda',
      icon: Database,
      color: 'orange',
      route: '/data-backup'
    },
    {
      title: 'Sync Center',
      description: 'Kelola sinkronisasi cloud',
      icon: RefreshCw,
      color: 'gold',
      route: '/sync'
    }
  ];

  return (
    <div className="dashboard-actions-section">
      <div className="dashboard-section-header">
        <div>
          <h2 className="dashboard-section-header-title">Akses Cepat</h2>
          <p className="dashboard-section-header-subtitle">Pintasan navigasi fitur utama Modalin</p>
        </div>
      </div>
      
      <StaggerContainer className="dashboard-actions-grid">
        {actions.map((act, index) => (
          <FadeIn key={index}>
            <DashboardActionCard 
              title={act.title}
              description={act.description}
              icon={act.icon}
              color={act.color}
              onClick={() => navigate(act.route)}
            />
          </FadeIn>
        ))}
      </StaggerContainer>
    </div>
  );
};
