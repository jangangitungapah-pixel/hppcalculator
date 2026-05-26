import React from 'react';
import { Store, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DashboardHero = ({ hasAnyData }) => {
  const { businessProfile } = useAuth();
  const businessName = businessProfile?.businessName || "F&B Owner";

  // Time-based greeting
  const hour = new Date().getHours();
  let greetingPrefix = 'Selamat Pagi';
  if (hour >= 11 && hour < 15) greetingPrefix = 'Selamat Siang';
  else if (hour >= 15 && hour < 18) greetingPrefix = 'Selamat Sore';
  else if (hour >= 18) greetingPrefix = 'Selamat Malam';

  return (
    <div className="dashboard-hero">
      <div className="dashboard-hero-content">
        <div className="dashboard-status-pill-container mb-3.5">
          <span className="dashboard-status-pill success">Local-First</span>
          <span className="dashboard-status-pill">Cloud Sync Opsional</span>
          <span className="dashboard-status-pill gold">Backup Tersedia</span>
        </div>
        <h1 className="dashboard-hero-title">
          {hasAnyData ? (
            <>
              {greetingPrefix}, <span>{businessName}!</span>
            </>
          ) : (
            'Selamat datang di Modalin'
          )}
        </h1>
        <p className="dashboard-hero-subtitle">
          {hasAnyData
            ? 'Pantau modal, margin, dan harga jual bisnismu dari satu tempat.'
            : 'Mulai hitung HPP, susun resep, dan jaga profit dari produk pertamamu.'}
        </p>
      </div>

      <div className="dashboard-hero-visual hidden md:flex">
        <div className="dashboard-hero-orb"></div>
        <div className="dashboard-hero-icon-wrapper">
          {hasAnyData ? (
            <Store className="w-8 h-8" />
          ) : (
            <Sparkles className="w-8 h-8" />
          )}
        </div>
      </div>
    </div>
  );
};
