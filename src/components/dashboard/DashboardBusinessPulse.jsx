import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';
import { FadeIn } from '../motion/FadeIn';

export const DashboardBusinessPulse = ({ summary }) => {
  const navigate = useNavigate();

  if (!summary) return null;

  const total = (summary.healthyCount || 0) + (summary.lowCount || 0) + (summary.lossCount || 0);
  const healthyPercent = total > 0 ? ((summary.healthyCount || 0) / total) * 100 : 0;
  const lowPercent = total > 0 ? ((summary.lowCount || 0) / total) * 100 : 0;
  const lossPercent = total > 0 ? ((summary.lossCount || 0) / total) * 100 : 0;

  // Resolve status text
  let statusText = "Menu Anda memiliki profit margin yang baik.";
  if (total <= 2) {
    statusText = "Data masih sedikit, lanjutkan input produk";
  } else if (summary.lossCount > 0) {
    statusText = "Ada item yang perlu dicek (mengalami kerugian)";
  } else if (summary.averageMargin >= 25) {
    statusText = "Margin rata-rata sehat (di atas target minimum)";
  }

  return (
    <FadeIn>
      <div className="business-pulse-card">
        <div className="business-pulse-header">
          <h3 className="business-pulse-title">Business Pulse</h3>
          <span className="business-pulse-status">{statusText}</span>
        </div>

        <div className="business-pulse-bar">
          {healthyPercent > 0 && (
            <div 
              className="business-pulse-segment healthy" 
              style={{ width: `${healthyPercent}%` }} 
              title={`Healthy: ${summary.healthyCount} items`}
            />
          )}
          {lowPercent > 0 && (
            <div 
              className="business-pulse-segment low" 
              style={{ width: `${lowPercent}%` }} 
              title={`Low Margin: ${summary.lowCount} items`}
            />
          )}
          {lossPercent > 0 && (
            <div 
              className="business-pulse-segment loss" 
              style={{ width: `${lossPercent}%` }} 
              title={`Loss: ${summary.lossCount} items`}
            />
          )}
          {total === 0 && (
            <div 
              className="w-full h-full bg-border-soft" 
              title="Belum ada data produk"
            />
          )}
        </div>

        <div className="business-pulse-footer">
          <div className="business-pulse-legends">
            <div className="business-pulse-legend">
              <span className="business-pulse-legend-dot healthy"></span>
              <span>Margin Sehat ({summary.healthyCount || 0})</span>
            </div>
            <div className="business-pulse-legend">
              <span className="business-pulse-legend-dot low"></span>
              <span>Margin Tipis ({summary.lowCount || 0})</span>
            </div>
            <div className="business-pulse-legend">
              <span className="business-pulse-legend-dot loss"></span>
              <span>Rugi ({summary.lossCount || 0})</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/reports')} 
            className="text-xs text-brand-primary font-bold hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
          >
            Laporan Detail <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </FadeIn>
  );
};
