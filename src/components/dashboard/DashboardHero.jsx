import React from 'react';
import { Store, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DashboardHero = ({ hasAnyData }) => {
  const { businessProfile } = useAuth();
  const businessName = businessProfile?.businessName || 'Pebisnis';

  const hour = new Date().getHours();
  const greeting =
    hour < 11 ? 'Selamat Pagi' :
    hour < 15 ? 'Selamat Siang' :
    hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const emoji = hour < 11 ? '☀️' : hour < 15 ? '🌤️' : hour < 18 ? '🌅' : '🌙';

  return (
    <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 shadow-xl">
      {/* Decorative orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl" />

      <div className="relative px-6 pt-6 pb-5 sm:px-8 sm:pt-7 sm:pb-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1">
          {/* Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20">
              <Zap className="w-3 h-3" /> Local-First
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20">
              ☁️ Cloud Sync Opsional
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {hasAnyData ? (
              <>{greeting} {emoji}, <span className="opacity-90">{businessName}!</span></>
            ) : (
              <>Selamat Datang di <span className="underline decoration-white/50 underline-offset-4">Modalin</span> ✨</>
            )}
          </h2>
          <p className="text-white/80 text-sm mt-2 max-w-md font-medium">
            {hasAnyData
              ? 'Pantau modal, margin, dan harga jual bisnismu dari satu tempat.'
              : 'Mulai hitung HPP, susun resep, dan jaga profit produkmu.'}
          </p>
        </div>

        {/* Visual badge */}
        <div className="shrink-0 hidden sm:flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm shadow-inner">
          {hasAnyData ? (
            <Store className="w-10 h-10 text-white" />
          ) : (
            <Sparkles className="w-10 h-10 text-white" />
          )}
          {hasAnyData && (
            <span className="text-[10px] font-bold text-white/80 mt-1">Bisnis Aktif</span>
          )}
        </div>
      </div>
    </div>
  );
};
