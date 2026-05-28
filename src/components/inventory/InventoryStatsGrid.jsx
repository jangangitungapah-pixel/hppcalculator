import React from 'react';
import { AlertTriangle, Boxes, ClipboardList, PackageX } from 'lucide-react';

export const InventoryStatsGrid = ({ trackedCount = 0, lowCount = 0, outCount = 0, monthlyMovementCount = 0 }) => {
  const stats = [
    { label: 'Total bahan dipantau', value: trackedCount, icon: Boxes, tone: 'neutral' },
    { label: 'Stok rendah', value: lowCount, icon: AlertTriangle, tone: 'low' },
    { label: 'Stok habis', value: outCount, icon: PackageX, tone: 'out' },
    { label: 'Movement bulan ini', value: monthlyMovementCount, icon: ClipboardList, tone: 'brand' }
  ];

  return (
    <section className="inventory-stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
        <article key={stat.label} className={`inventory-stat-card inventory-stat-card--${stat.tone}`}>
          <div className="inventory-stat-card-head">
            <span>{stat.label}</span>
            <span className="inventory-stat-icon" aria-hidden="true"><Icon className="w-4 h-4" /></span>
          </div>
          <strong>{stat.value}</strong>
        </article>
        );
      })}
    </section>
  );
};
