import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { ModuleExportRow } from './ModuleExportRow';
import { TableProperties } from 'lucide-react';

export const ExportCsvCenter = ({ modules, onExportModule }) => {
  const { t, lang } = useLanguage();

  const labels = {
    id: {
      calculations: "Kalkulasi",
      ingredients: "Bahan Baku",
      recipes: "Resep",
      products: "Produk/Menu",
      channelProfiles: "Profil Channel",
      pricingSimulations: "Simulasi Harga",
      bundleSimulations: "Paket Bundle"
    },
    en: {
      calculations: "Calculations",
      ingredients: "Ingredients",
      recipes: "Recipes",
      products: "Products/Menu",
      channelProfiles: "Channel Profiles",
      pricingSimulations: "Pricing Simulations",
      bundleSimulations: "Bundle Simulations"
    }
  };

  const getLabel = (key) => labels[lang]?.[key] || labels['id'][key];

  return (
    <Card className="p-5 sm:p-6 border-border/80 rounded-3xl shadow-xs">
      <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-border-soft">
        <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0 flex items-center justify-center">
          <TableProperties className="w-5.5 h-5.5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-text-primary">
            {t('dataBackup.csvExportCenter', 'CSV Export Center')}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-0.5 leading-relaxed">
            {t('dataBackup.csvExportCenterDesc', 'Export data mentah per modul untuk diolah di Excel.')}
          </p>
        </div>
      </div>

      <div className="border border-border-soft rounded-2xl overflow-hidden">
        <ModuleExportRow 
          label={getLabel('calculations')} 
          count={modules.calculations?.count || 0} 
          onExport={() => onExportModule('calculations')}
          disabled={(modules.calculations?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={getLabel('ingredients')} 
          count={modules.ingredients?.count || 0} 
          onExport={() => onExportModule('ingredients')}
          disabled={(modules.ingredients?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={getLabel('recipes')} 
          count={modules.recipes?.count || 0} 
          onExport={() => onExportModule('recipes')}
          disabled={(modules.recipes?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={getLabel('products')} 
          count={modules.products?.count || 0} 
          onExport={() => onExportModule('products')}
          disabled={(modules.products?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={getLabel('channelProfiles')} 
          count={modules.channelProfiles?.count || 0} 
          onExport={() => onExportModule('channelProfiles')}
          disabled={(modules.channelProfiles?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={getLabel('pricingSimulations')} 
          count={modules.pricingSimulations?.count || 0} 
          onExport={() => onExportModule('pricingSimulations')}
          disabled={(modules.pricingSimulations?.count || 0) === 0}
        />
        <ModuleExportRow 
          label={getLabel('bundleSimulations')} 
          count={modules.bundleSimulations?.count || 0} 
          onExport={() => onExportModule('bundleSimulations')}
          disabled={(modules.bundleSimulations?.count || 0) === 0}
        />
      </div>
    </Card>
  );
};
