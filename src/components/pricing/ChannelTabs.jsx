import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Store, Users, Tag, Package, ShoppingBag } from 'lucide-react';

export const ChannelTabs = ({ activeTab, onChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'marketplace', label: t('pricing.marketplace'), icon: Store },
    { id: 'reseller', label: t('pricing.reseller'), icon: Users },
    { id: 'promo', label: t('pricing.promo'), icon: Tag },
    { id: 'bundle', label: t('pricing.bundle'), icon: Package },
    { id: 'consignment', label: t('pricing.consignment'), icon: ShoppingBag }
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 bg-white sticky top-0 z-10 pt-2">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${isActive 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-gray-300'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
