import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Store, Users, Tag, Package, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/ui/cn';

export const ChannelTabs = ({ activeTab, onChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'marketplace', label: t('pricing.marketplace', 'Marketplace'), icon: Store },
    { id: 'reseller', label: t('pricing.reseller', 'Reseller & Grosir'), icon: Users },
    { id: 'promo', label: t('pricing.promo', 'Promo & Diskon'), icon: Tag },
    { id: 'bundle', label: t('pricing.bundle', 'Paket Bundling'), icon: Package },
    { id: 'consignment', label: t('pricing.consignment', 'Titip Jual (Konsinyasi)'), icon: ShoppingBag }
  ];

  return (
    <div 
      className="w-full pricing-channel-tabs bg-surface-muted border border-border-soft p-2 rounded-full flex flex-nowrap justify-start sm:justify-center gap-2 overflow-x-auto hide-scrollbar mb-5 shadow-sm scroll-smooth" 
      role="tablist" 
      aria-label="Channel Tabs"
    >
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
              "flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 outline-none select-none shrink-0 sm:shrink sm:flex-1",
              isActive 
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10 transform scale-[1.02] active:scale-[0.98]" 
                : "text-text-muted hover:text-text-primary hover:bg-white/40 active:bg-white/60"
            )}
          >
            <Icon className={cn(
              "w-4 h-4 transition-transform duration-300 shrink-0", 
              isActive ? "text-white scale-110" : "text-text-muted"
            )} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
