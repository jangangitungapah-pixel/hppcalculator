import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Calculator } from 'lucide-react';
import { FadeIn } from '../motion/FadeIn';

export const DashboardNewProductCta = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <FadeIn>
      <div className="dashboard-new-product-cta">
        <div className="dashboard-new-product-visual">
          <Calculator className="w-full h-full text-white" />
        </div>
        
        <div className="dashboard-new-product-content">
          <h2 className="dashboard-new-product-title">Punya produk baru?</h2>
          <p className="dashboard-new-product-body">
            Hitung HPP dan temukan harga jual yang tepat agar bisnismu tetap untung.
          </p>
          <button 
            className="dashboard-new-product-button" 
            onClick={() => navigate('/calculator')}
          >
            {t('dashboard.mainCta')}
          </button>
        </div>
      </div>
    </FadeIn>
  );
};
