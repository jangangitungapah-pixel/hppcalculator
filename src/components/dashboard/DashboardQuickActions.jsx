import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardActionCard } from './DashboardActionCard';
import { Calculator, BookOpen, Box, ShoppingBag, Store, BarChart3, Database, RefreshCw } from 'lucide-react';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';

const ACTIONS = [
  { title: 'Hitung HPP',       description: 'Hitung modal & harga jual',    icon: Calculator, color: 'orange', route: '/calculator' },
  { title: 'Resep Makanan',    description: 'Kelola resep rahasia',           icon: BookOpen,   color: 'green',  route: '/recipes' },
  { title: 'Bahan Baku',       description: 'Pantau harga bahan mentah',      icon: Box,        color: 'blue',   route: '/ingredients' },
  { title: 'Simulasi Harga',   description: 'Atur harga dine-in & ojol',     icon: ShoppingBag,color: 'gold',   route: '/channel-pricing' },
  { title: 'Profil Channel',   description: 'Atur komisi & diskon ojol',      icon: Store,      color: 'blue',   route: '/channel-profiles' },
  { title: 'Laporan Bisnis',   description: 'Analisis performa & untung',     icon: BarChart3,  color: 'green',  route: '/reports' },
  { title: 'Ekspor & Backup',  description: 'Cadangkan data lokal Anda',      icon: Database,   color: 'orange', route: '/data-backup' },
  { title: 'Sync Center',      description: 'Kelola sinkronisasi cloud',      icon: RefreshCw,  color: 'gold',   route: '/sync' },
];

export const DashboardQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">Akses Cepat</h2>
        <div className="flex-1 h-px bg-border/40" />
      </div>
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ACTIONS.map((act, i) => (
          <FadeIn key={i}>
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
