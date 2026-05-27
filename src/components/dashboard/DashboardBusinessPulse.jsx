import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';
import { FadeIn } from '../motion/FadeIn';
import { Button } from '../ui/Button';

export const DashboardBusinessPulse = ({ summary }) => {
  const navigate = useNavigate();

  if (!summary) return null;

  const total = (summary.healthyCount || 0) + (summary.lowCount || 0) + (summary.lossCount || 0);
  const healthyPercent = total > 0 ? ((summary.healthyCount || 0) / total) * 100 : 0;
  const lowPercent = total > 0 ? ((summary.lowCount || 0) / total) * 100 : 0;
  const lossPercent = total > 0 ? ((summary.lossCount || 0) / total) * 100 : 0;
  const formatPercent = (value) => `${Math.round(value)}%`;

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

        <div
          className="business-pulse-bar"
          role="img"
          aria-label={`Komposisi margin: ${summary.healthyCount || 0} margin sehat (${formatPercent(healthyPercent)}), ${summary.lowCount || 0} margin tipis (${formatPercent(lowPercent)}), ${summary.lossCount || 0} rugi (${formatPercent(lossPercent)}).`}
        >
          {healthyPercent > 0 && (
            <div 
              className="business-pulse-segment healthy" 
              style={{ width: `${healthyPercent}%` }} 
              title={`Healthy: ${summary.healthyCount} items`}
              aria-hidden="true"
            />
          )}
          {lowPercent > 0 && (
            <div 
              className="business-pulse-segment low" 
              style={{ width: `${lowPercent}%` }} 
              title={`Low Margin: ${summary.lowCount} items`}
              aria-hidden="true"
            />
          )}
          {lossPercent > 0 && (
            <div 
              className="business-pulse-segment loss" 
              style={{ width: `${lossPercent}%` }} 
              title={`Loss: ${summary.lossCount} items`}
              aria-hidden="true"
            />
          )}
          {total === 0 && (
            <div 
              className="w-full h-full bg-border-soft" 
              title="Belum ada data produk"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="business-pulse-footer">
          <div className="business-pulse-legends">
            <div className="business-pulse-legend">
              <span className="business-pulse-legend-dot healthy"></span>
              <span>Margin Sehat ({summary.healthyCount || 0}, {formatPercent(healthyPercent)})</span>
            </div>
            <div className="business-pulse-legend">
              <span className="business-pulse-legend-dot low"></span>
              <span>Margin Tipis ({summary.lowCount || 0}, {formatPercent(lowPercent)})</span>
            </div>
            <div className="business-pulse-legend">
              <span className="business-pulse-legend-dot loss"></span>
              <span>Rugi ({summary.lossCount || 0}, {formatPercent(lossPercent)})</span>
            </div>
          </div>
          <Button 
            variant="link"
            size="sm"
            className="text-xs font-bold"
            onClick={() => navigate('/reports')}
            iconRight={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Laporan Detail
          </Button>
        </div>
      </div>
    </FadeIn>
  );
};
