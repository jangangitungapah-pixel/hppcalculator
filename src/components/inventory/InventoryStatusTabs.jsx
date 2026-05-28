import React from 'react';
import { formatStockStatus } from '../../lib/inventory';

const TAB_ITEMS = [
  { value: 'all', label: 'Semua' },
  { value: 'ok', label: formatStockStatus('ok') },
  { value: 'low', label: formatStockStatus('low') },
  { value: 'out', label: formatStockStatus('out') },
  { value: 'not_tracked', label: formatStockStatus('not_tracked') }
];

export const InventoryStatusTabs = ({ activeStatus, onStatusChange, counts = {} }) => (
  <div className="inventory-status-tabs" role="tablist" aria-label="Filter status inventory">
    {TAB_ITEMS.map((tab) => {
      const active = activeStatus === tab.value;
      return (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active}
          className={`inventory-status-tab ${active ? 'is-active' : ''}`}
          onClick={() => onStatusChange(tab.value)}
        >
          <span>{tab.label}</span>
          <strong>{counts[tab.value] || 0}</strong>
        </button>
      );
    })}
  </div>
);
