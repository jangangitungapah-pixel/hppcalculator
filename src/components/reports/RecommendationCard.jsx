import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { AlertCircle, ArrowUpCircle, Tag, Store, Settings, ArrowRight } from 'lucide-react';

export const RecommendationCard = ({ recommendation }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  
  if (!recommendation) return null;

  const { severity, type, titleId, titleEn, messageId, messageEn, itemName, actionLabelId, actionLabelEn, actionRoute } = recommendation;

  const title = lang === 'en' ? titleEn : titleId;
  const message = lang === 'en' ? messageEn : messageId;
  const actionLabel = lang === 'en' ? actionLabelEn : actionLabelId;

  const getIcon = () => {
    switch (type) {
      case 'price_increase': return <ArrowUpCircle className="w-5 h-5" />;
      case 'promo_warning': return <Tag className="w-5 h-5" />;
      case 'reseller_opportunity': return <Store className="w-5 h-5" />;
      case 'marketplace_opportunity': return <Store className="w-5 h-5" />;
      case 'cost_review': return <Settings className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (severity) {
      case 'danger': return { bg: 'bg-status-lossBg border-status-loss/20', icon: 'text-status-loss', btn: 'text-status-loss hover:bg-status-loss/10' };
      case 'warning': return { bg: 'bg-status-warningBg border-status-warning/20', icon: 'text-status-warning', btn: 'text-status-warning hover:bg-status-warning/10' };
      case 'success': return { bg: 'bg-status-goodBg border-status-good/20', icon: 'text-status-good', btn: 'text-status-good hover:bg-status-good/10' };
      default: return { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-500', btn: 'text-blue-600 hover:bg-blue-100' };
    }
  };

  const styles = getStyles();

  return (
    <Card className={`p-4 flex flex-col sm:flex-row gap-4 items-start ${styles.bg}`}>
      <div className={`p-2 bg-white rounded-full shrink-0 shadow-sm ${styles.icon}`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-text-primary text-sm mb-1">{title}</h4>
        {itemName && (
          <div className="text-xs font-medium text-text-secondary mb-1 bg-white/50 inline-block px-2 py-0.5 rounded">
            Item: {itemName}
          </div>
        )}
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
      
      {actionRoute && (
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => navigate(actionRoute)}
          className={`shrink-0 w-full sm:w-auto mt-2 sm:mt-0 font-bold ${styles.btn}`}
          rightIcon={<ArrowRight className="w-3 h-3" />}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
