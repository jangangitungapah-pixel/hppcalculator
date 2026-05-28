import React from 'react';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';

export const ProfitabilityTable = ({ items }) => {
  const { lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';
  
  if (!items || items.length === 0) return null;

  const getStatusBadge = (margin) => {
    if (margin === null || margin === undefined) return <span className="report-status-badge is-muted">-</span>;
    if (margin < 0) return <span className="report-status-badge is-danger">Rugi</span>;
    if (margin < 15) return <span className="report-status-badge is-warning">Tipis</span>;
    if (margin < 25) return <span className="report-status-badge is-info">Oke</span>;
    return <span className="report-status-badge is-good">Sehat</span>;
  };

  return (
    <div className="report-profitability">
      {/* Desktop Table */}
      <div className="report-table-scroll hidden md:block">
        <table className="report-table">
          <caption className="sr-only">Tabel profitabilitas item</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className="text-right">HPP</th>
              <th scope="col" className="text-right">Harga Jual</th>
              <th scope="col" className="text-right">Profit</th>
              <th scope="col" className="text-right">Margin</th>
              <th scope="col" className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="report-table-item-name">{item.name}</div>
                  <div className="report-table-item-type">{item.type}</div>
                </td>
                <td className="text-right text-text-secondary">
                  {formatCurrency(item.hppPerUnit, lang, currency)}
                </td>
                <td className="text-right font-medium">
                  {item.sellingPrice ? formatCurrency(item.sellingPrice, lang, currency) : '-'}
                </td>
                <td className="text-right">
                  <span className={item.profitPerUnit < 0 ? 'text-status-loss' : 'text-status-good'}>
                    {item.profitPerUnit !== null ? formatCurrency(item.profitPerUnit, lang, currency) : '-'}
                  </span>
                </td>
                <td className="text-right font-bold">
                  <span className={item.marginPercent < 0 ? 'text-status-loss' : 'text-text-primary'}>
                    {item.marginPercent !== null ? formatPercent(item.marginPercent, lang) : '-'}
                  </span>
                </td>
                <td className="text-center">
                  {getStatusBadge(item.marginPercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="report-mobile-list md:hidden">
        {items.map((item) => (
          <Card key={item.id} className="report-mobile-profit-card">
            <div className="report-mobile-profit-head">
              <div className="min-w-0">
                <div className="report-table-item-name">{item.name}</div>
                <div className="report-table-item-type">{item.type}</div>
              </div>
              <div>{getStatusBadge(item.marginPercent)}</div>
            </div>
            
            <div className="report-mobile-profit-grid">
              <div className="text-text-secondary">HPP:</div>
              <div className="text-right">{formatCurrency(item.hppPerUnit, lang, currency)}</div>
              
              <div className="text-text-secondary">Harga Jual:</div>
              <div className="text-right font-medium">{item.sellingPrice ? formatCurrency(item.sellingPrice, lang, currency) : '-'}</div>
              
              <div className="text-text-secondary">Profit:</div>
              <div className={`text-right ${item.profitPerUnit < 0 ? 'text-status-loss' : 'text-status-good'}`}>
                {item.profitPerUnit !== null ? formatCurrency(item.profitPerUnit, lang, currency) : '-'}
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
