import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Store, Users, Tag, Package, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/ui/cn';

export const ChannelTabs = ({ activeTab, onChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'marketplace', label: t('pricing.marketplace', 'Marketplace'), icon: Store },
    { id: 'reseller', label: t('pricing.reseller', 'Reseller / Grosir'), icon: Users },
    { id: 'promo', label: t('pricing.promo', 'Promo / Diskon'), icon: Tag },
    { id: 'bundle', label: t('pricing.bundle', 'Paket Bundling'), icon: Package },
    { id: 'consignment', label: t('pricing.consignment', 'Titip Jual / Konsinyasi'), icon: ShoppingBag }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-zinc-200 mb-6 bg-white pt-1 pb-px sticky top-0 z-10" role="tablist" aria-label="Channel Tabs">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-200 outline-none",
              isActive 
                ? "border-brand-primary text-brand-primary" 
                : "border-transparent text-text-muted hover:text-text-primary hover:border-zinc-300"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
