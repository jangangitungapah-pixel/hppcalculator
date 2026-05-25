import React from 'react';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';

export const ProfitabilityTable = ({ items }) => {
  const { lang, settings } = useLanguage();
  
  if (!items || items.length === 0) return null;

  const getStatusBadge = (margin) => {
    if (margin === null || margin === undefined) return <span className="text-gray-400">-</span>;
    if (margin < 0) return <span className="bg-status-lossBg text-status-loss px-2 py-0.5 rounded-md text-[10px] font-bold">Rugi</span>;
    if (margin < 15) return <span className="bg-status-warningBg text-status-warning px-2 py-0.5 rounded-md text-[10px] font-bold">Tipis</span>;
    if (margin < 25) return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold">Oke</span>;
    return <span className="bg-status-goodBg text-status-good px-2 py-0.5 rounded-md text-[10px] font-bold">Sehat</span>;
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-semibold rounded-tl-lg">Item</th>
              <th className="px-4 py-3 font-semibold text-right">HPP</th>
              <th className="px-4 py-3 font-semibold text-right">Harga Jual</th>
              <th className="px-4 py-3 font-semibold text-right">Profit</th>
              <th className="px-4 py-3 font-semibold text-right">Margin</th>
              <th className="px-4 py-3 font-semibold text-center rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-text-primary">{item.name}</div>
                  <div className="text-[10px] text-text-tertiary uppercase tracking-wider">{item.type}</div>
                </td>
                <td className="px-4 py-3 text-right text-text-secondary">
                  {formatCurrency(item.hppPerUnit, lang, settings.currency)}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {item.sellingPrice ? formatCurrency(item.sellingPrice, lang, settings.currency) : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={item.profitPerUnit < 0 ? 'text-status-loss' : 'text-status-good'}>
                    {item.profitPerUnit !== null ? formatCurrency(item.profitPerUnit, lang, settings.currency) : '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  <span className={item.marginPercent < 0 ? 'text-status-loss' : 'text-text-primary'}>
                    {item.marginPercent !== null ? formatPercent(item.marginPercent, lang) : '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {getStatusBadge(item.marginPercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.id} className="p-3 border-border">
            <div className="flex justify-between items-start mb-2 border-b border-border/50 pb-2">
              <div>
                <div className="font-semibold text-text-primary text-sm">{item.name}</div>
                <div className="text-[10px] text-text-tertiary uppercase">{item.type}</div>
              </div>
              <div>{getStatusBadge(item.marginPercent)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div className="text-text-secondary">HPP:</div>
              <div className="text-right">{formatCurrency(item.hppPerUnit, lang, settings.currency)}</div>
              
              <div className="text-text-secondary">Harga Jual:</div>
              <div className="text-right font-medium">{item.sellingPrice ? formatCurrency(item.sellingPrice, lang, settings.currency) : '-'}</div>
              
              <div className="text-text-secondary">Profit:</div>
              <div className={`text-right ${item.profitPerUnit < 0 ? 'text-status-loss' : 'text-status-good'}`}>
                {item.profitPerUnit !== null ? formatCurrency(item.profitPerUnit, lang, settings.currency) : '-'}
              </div>
              
              <div className="text-text-secondary">Margin:</div>
              <div className={`text-right font-bold ${item.marginPercent < 0 ? 'text-status-loss' : 'text-text-primary'}`}>
                {item.marginPercent !== null ? formatPercent(item.marginPercent, lang) : '-'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
