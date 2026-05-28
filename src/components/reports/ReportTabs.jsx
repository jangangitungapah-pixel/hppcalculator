import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { BarChart3, Boxes, BookOpen, Store, LineChart } from 'lucide-react';

export const ReportTabs = ({ activeTab, onChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'overview', label: t('reports.overview'), icon: BarChart3 },
    { id: 'products', label: t('reports.products'), icon: Boxes },
    { id: 'recipes', label: t('reports.recipes'), icon: BookOpen },
    { id: 'channels', label: t('reports.channels'), icon: Store },
    { id: 'simulations', label: t('reports.simulations'), icon: LineChart }
  ];

  const handleKeyDown = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    onChange(tabs[nextIndex].id);
    requestAnimationFrame(() => {
      document.getElementById(`report-tab-${tabs[nextIndex].id}`)?.focus();
    });
  };

  return (
    <div className="report-tabs-wrap">
      <div className="report-tabs" role="tablist" aria-label={t('reports.tabsLabel')}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`report-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`report-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`report-tab ${isActive ? 'is-active' : ''}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
