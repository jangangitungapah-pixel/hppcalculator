import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useReports } from '../hooks/useReports';
import { useToast } from '../hooks/useToast';
import { useDataBackup } from '../hooks/useDataBackup';
import { useInventory } from '../hooks/useInventory';
import { Button } from '../components/ui/Button';
import { BackupReminderBanner } from '../components/backup/BackupReminderBanner';
import { InstallAppBanner } from '../components/pwa/InstallAppBanner';
import { PageContainer } from '../components/layout/PageContainer';

// Dashboard Subcomponents
import { DashboardHero } from '../components/dashboard/DashboardHero';
import { DashboardMetricGrid } from '../components/dashboard/DashboardMetricGrid';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DashboardQuickActions } from '../components/dashboard/DashboardQuickActions';
import { DashboardRecentCalculations } from '../components/dashboard/DashboardRecentCalculations';
import { DashboardRecommendations } from '../components/dashboard/DashboardRecommendations';
import { DashboardTipsCard } from '../components/dashboard/DashboardTipsCard';
import { DashboardBusinessPulse } from '../components/dashboard/DashboardBusinessPulse';
import { DashboardNewProductCta } from '../components/dashboard/DashboardNewProductCta';
import { DemoDataBanner } from '../components/dashboard/DemoDataBanner';

export const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loadCompleteDemoWorkspace } = useAppData();
  const { 
    summary,
    recommendations,
    hasAnyData 
  } = useReports();
  const { storageHealth } = useDataBackup();
  const { lowStockIngredients } = useInventory();
  const { addToast } = useToast();

  const handleLoadDemo = () => {
    loadCompleteDemoWorkspace();
    addToast({
      type: 'success',
      title: t('toasts.demoLoadedTitle'),
      message: t('toasts.demoLoadedMessage')
    });
  };

  return (
    <PageContainer>
      <div className="dashboard-shell-container">
        {storageHealth?.backupReminder?.shouldShow && (
          <BackupReminderBanner 
            reminder={storageHealth.backupReminder}
            onExport={() => navigate('/data-backup')}
          />
        )}
        
        <InstallAppBanner />

        <DemoDataBanner />

        {/* Hero Banner Component */}
        <DashboardHero hasAnyData={hasAnyData} />

        {!hasAnyData ? (
          <div className="space-y-6">
            <DashboardEmptyState onLoadDemo={handleLoadDemo} />
            <DashboardQuickActions />
          </div>
        ) : (
          <div className="space-y-6">
            <DashboardMetricGrid summary={summary} />
            <DashboardBusinessPulse summary={summary} />
            {lowStockIngredients.length > 0 && (
              <div className="inventory-dashboard-alert">
                <div>
                  <strong>Ada {lowStockIngredients.length} bahan stok rendah</strong>
                  <span>Cek Inventory untuk melihat bahan yang perlu restock.</span>
                </div>
                <Button size="sm" onClick={() => navigate('/inventory')}>Buka Inventory</Button>
              </div>
            )}
            <DashboardNewProductCta />
            <DashboardRecentCalculations />
            <DashboardQuickActions />
            <DashboardRecommendations recommendations={recommendations} />
          </div>
        )}

        {/* Tips Component */}
        <DashboardTipsCard hasAnyData={hasAnyData} />
      </div>
    </PageContainer>
  );
};
