import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { ModuleExportRow } from './ModuleExportRow';
import { TableProperties } from 'lucide-react';

export const ExportCsvCenter = ({ modules, onExportModule }) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
          <TableProperties size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-text-primary">
            {t('csvExportCenter', 'CSV Export Center')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('csvExportCenterDesc', 'Export data mentah per modul untuk diolah di Excel.')}
          </p>
        </div>
      </div>

      <div className="border border-ui-border rounded-xl overflow-hidden">
        <ModuleExportRow 
          label={t('calculations', 'Kalkulasi')} 
          count={modules.calculations?.count || 0} 
          onExport={() => onExportModule('calculations')}
          disabled={(modules.calculations?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={t('ingredients', 'Bahan')} 
          count={modules.ingredients?.count || 0} 
          onExport={() => onExportModule('ingredients')}
          disabled={(modules.ingredients?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={t('recipes', 'Resep')} 
          count={modules.recipes?.count || 0} 
          onExport={() => onExportModule('recipes')}
          disabled={(modules.recipes?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={t('products', 'Produk')} 
          count={modules.products?.count || 0} 
          onExport={() => onExportModule('products')}
          disabled={(modules.products?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={t('channelProfiles', 'Profil Channel')} 
          count={modules.channelProfiles?.count || 0} 
          onExport={() => onExportModule('channelProfiles')}
          disabled={(modules.channelProfiles?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={t('pricingSimulations', 'Simulasi Harga')} 
          count={modules.pricingSimulations?.count || 0} 
          onExport={() => onExportModule('pricingSimulations')}
          disabled={(modules.pricingSimulations?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={t('bundleSimulations', 'Paket Bundle')} 
          count={modules.bundleSimulations?.count || 0} 
          onExport={() => onExportModule('bundleSimulations')}
          disabled={(modules.bundleSimulations?.count || 0) === 0}
        />
      </div>
    </Card>
  );
};
