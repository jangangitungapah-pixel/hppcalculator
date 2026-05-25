import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const ReportTabs = ({ activeTab, onChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'overview', label: t('reports.overview') },
    { id: 'products', label: t('reports.products') },
    { id: 'recipes', label: t('reports.recipes') },
    { id: 'channels', label: t('reports.channels') },
    { id: 'simulations', label: t('reports.simulations') }
  ];

  return (
    <div className="w-full overflow-x-auto hide-scrollbar border-b border-border mb-6">
      <div className="flex px-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors relative
                ${isActive ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-secondary'}
              `}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
