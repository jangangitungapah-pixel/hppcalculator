import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calculator } from 'lucide-react';
import { Button } from '../ui/Button';
import { FadeIn } from '../motion/FadeIn';

export const DashboardEmptyState = ({ onLoadDemo }) => {
  const navigate = useNavigate();

  return (
    <FadeIn>
      <div className="dashboard-empty-card">
        <div className="dashboard-empty-grid">
          {/* Left: Content */}
          <div className="dashboard-empty-content">
            <div className="dashboard-empty-icon">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="dashboard-empty-title">Mulai dari produk pertamamu</h2>
            <p className="dashboard-empty-body">
              Hitung modal, tentukan harga jual, lalu simpan hasilnya untuk dipantau.
            </p>
            
            <div className="dashboard-empty-actions flex items-center gap-4 mt-6">
              <Button 
                onClick={() => navigate('/calculator')} 
                variant="primary"
                className="dashboard-empty-action-button primary"
              >
                <Calculator className="w-6 h-6" />
                <span>Hitung HPP</span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={onLoadDemo} 
                className="dashboard-empty-action-button secondary"
              >
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <span>Coba Data Demo</span>
              </Button>
            </div>
            
            <p className="text-xs text-text-muted mt-6 font-medium">
              Bisa dipakai tanpa login. Cloud sync opsional.
            </p>
          </div>

          {/* Right: Floating Stats Preview */}
          <div className="dashboard-empty-preview hidden lg:flex">
            <div className="dashboard-floating-stat first">
              <span className="dashboard-floating-label">HPP / Unit</span>
              <span className="dashboard-floating-val primary">Rp 4.500</span>
            </div>
            
            <div className="dashboard-floating-stat second">
              <span className="dashboard-floating-label">Margin Keuntungan</span>
              <span className="dashboard-floating-val success">35%</span>
            </div>
            
            <div className="dashboard-floating-stat third">
              <span className="dashboard-floating-label">Harga Ideal</span>
              <span className="dashboard-floating-val gold">Rp 8.000</span>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};
