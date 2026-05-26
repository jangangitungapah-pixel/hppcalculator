import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
            
            <div className="dashboard-empty-actions">
              <Button 
                onClick={() => navigate('/calculator')} 
                className="w-full sm:w-auto"
              >
                Hitung HPP Sekarang
              </Button>
              <Button 
                variant="secondary" 
                onClick={onLoadDemo} 
                className="w-full sm:w-auto"
              >
                Coba Data Demo
              </Button>
            </div>
            
            <p className="text-xs text-text-muted mt-4 font-medium">
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
