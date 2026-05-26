import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPercent, formatCurrency } from '../../lib/calculations';
import { Store, Tag, Users, Package, ShoppingBag, Trash2, ChevronRight, Activity } from 'lucide-react';

export const SimulationCard = ({ simulation, onClick, onDelete }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  const isBundle = simulation.type === 'bundle';
  
  const getIcon = (type) => {
    switch (type) {
      case 'marketplace': return <Store className="w-5 h-5 text-brand-primary" />;
      case 'reseller': return <Users className="w-5 h-5 text-blue-500" />;
      case 'consignment': return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'promo': return <Tag className="w-5 h-5 text-pink-500" />;
      case 'bundle': return <Package className="w-5 h-5 text-amber-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'marketplace': return 'primary';
      case 'reseller': return 'secondary';
      case 'consignment': return 'default';
      case 'promo': return 'outline';
      case 'bundle': return 'warning';
      default: return 'outline';
    }
  };

  const renderResultSnippet = () => {
    if (isBundle) {
      return (
        <>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-text-tertiary">Total HPP:</span>
            <span className="font-medium text-text-secondary">{formatCurrency(simulation.baseTotalHpp, lang, currency)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-text-tertiary">Harga Paket:</span>
            <span className="font-medium text-text-primary">{formatCurrency(simulation.finalSellingPrice, lang, currency)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-tertiary">Profit:</span>
            <span className={`font-semibold ${simulation.profit >= 0 ? 'text-status-good' : 'text-status-loss'}`}>
              {formatCurrency(simulation.profit, lang, currency)}
            </span>
          </div>
        </>
      );
    }

    const { result } = simulation;
    if (!result) return null;

    if (simulation.type === 'reseller') {
      return (
        <>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-text-tertiary">{t('pricing.wholesalePrice')}:</span>
            <span className="font-medium text-brand-primary">{formatCurrency(result.wholesalePrice, lang, currency)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-text-tertiary">{t('pricing.resellerSuggestedPrice')}:</span>
            <span className="font-medium text-text-primary">{formatCurrency(result.resellerSuggestedPrice, lang, currency)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-tertiary">{t('pricing.ownerProfit')}:</span>
            <span className="font-semibold text-status-good">{formatCurrency(result.ownerProfitPerUnit, lang, currency)}</span>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-text-tertiary">HPP:</span>
          <span className="font-medium text-text-secondary">{formatCurrency(simulation.baseHpp, lang, currency)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-text-tertiary">Harga Jual:</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(result.finalPrice || simulation.baseSellingPrice, lang, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-tertiary">Profit:</span>
          <div className="flex gap-2 items-center">
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {formatPercent(result.marginPercent || 0, lang)}
            </span>
            <span className={`font-semibold ${result.profit >= 0 ? 'text-status-good' : 'text-status-loss'}`}>
              {formatCurrency(result.profit, lang, currency)}
            </span>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card 
      className="p-4 flex flex-col h-full bg-white border-gray-200 hover:border-brand-primary/50 transition-colors cursor-pointer group"
      onClick={() => onClick && onClick(simulation)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-brand-soft transition-colors">
            {getIcon(simulation.type)}
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-sm line-clamp-1">{simulation.name}</h3>
            <div className="flex gap-2 items-center mt-1">
              <Badge variant={getBadgeVariant(simulation.type)} className="text-[10px]">
                {t(`pricing.${simulation.type}`)}
              </Badge>
              {!isBundle && simulation.sourceNameSnapshot && (
                <span className="text-xs text-text-tertiary line-clamp-1 flex-1">
                  {simulation.sourceNameSnapshot}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {onDelete && (
          <Button 
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(simulation.id, isBundle);
            }} 
            className="w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-grow space-y-1 bg-gray-50/50 p-3 rounded-lg">
        {renderResultSnippet()}
      </div>

      <div className="mt-3 flex justify-end items-center text-xs font-medium text-brand-primary group-hover:text-brand-hover transition-colors">
        Lihat Detail <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </Card>
  );
};
