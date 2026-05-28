import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPercent, formatCurrency } from '../../lib/calculations';
import { Store, Tag, Users, Package, ShoppingBag, Edit2, Trash2 } from 'lucide-react';

export const ChannelProfileCard = ({ profile, onEdit, onDelete }) => {
  const { t, lang } = useLanguage();

  const getIcon = (type) => {
    switch (type) {
      case 'marketplace': return <Store className="w-5 h-5 text-brand-primary" />;
      case 'reseller': return <Users className="w-5 h-5 text-blue-500" />;
      case 'consignment': return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'offline': return <Tag className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'marketplace': return 'primary';
      case 'reseller': return 'secondary';
      case 'consignment': return 'default';
      case 'offline': return 'success';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-4 flex flex-col h-full bg-white border-border hover:border-brand-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-surface-muted/50 rounded-lg">
            {getIcon(profile.type)}
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-sm line-clamp-1">{profile.name}</h3>
            <Badge variant={getBadgeVariant(profile.type)} className="mt-1">
              {t(`pricing.${profile.type}`)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1">
          {!profile.isPreset && onEdit && (
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => onEdit(profile)} 
              className="w-8 h-8 text-text-muted hover:text-brand-primary hover:bg-brand-soft rounded-lg transition-colors"
              aria-label="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {!profile.isPreset && onDelete && (
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => onDelete(profile.id)} 
              className="w-8 h-8 text-text-muted hover:text-status-loss hover:bg-status-lossBg rounded-lg transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1 mb-4 flex-grow">
        {profile.commissionPercent > 0 && (
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{t('pricing.commissionPercent')}</span>
            <span className="font-medium">{formatPercent(profile.commissionPercent, lang)}</span>
          </div>
        )}
        {profile.paymentFeePercent > 0 && (
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{t('pricing.paymentFeePercent')}</span>
            <span className="font-medium">{formatPercent(profile.paymentFeePercent, lang)}</span>
          </div>
        )}
        {profile.paymentFeeFixed > 0 && (
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{t('pricing.fixedDiscount')} / Transaksi</span>
            <span className="font-medium">{formatCurrency(profile.paymentFeeFixed, lang, 'IDR')}</span>
          </div>
        )}
        {profile.sellerPromoPercent > 0 && (
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{t('pricing.sellerPromoPercent')}</span>
            <span className="font-medium">{formatPercent(profile.sellerPromoPercent, lang)}</span>
          </div>
        )}
        {profile.consignmentFeePercent > 0 && (
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{t('pricing.storeFee')}</span>
            <span className="font-medium">{formatPercent(profile.consignmentFeePercent, lang)}</span>
          </div>
        )}
      </div>

      {profile.isPreset && (
        <div className="pt-3 border-t border-border-soft flex justify-between items-center text-xs">
          <span className="text-text-muted">Preset Sistem</span>
          {profile.notes && <span className="text-brand-primary truncate max-w-[150px] ml-2" title={profile.notes}>Info tambahan tersedia</span>}
        </div>
      )}
    </Card>
  );
};
