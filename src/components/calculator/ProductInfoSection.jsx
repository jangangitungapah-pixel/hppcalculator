import React from 'react';
import { Input } from '../ui/Input';
import { Package } from 'lucide-react';

export const ProductInfoSection = ({ productName, onChange, error, t }) => {
  return (
    <div className="calculator-field">
      <Input 
        label={t('calculator.productName')}
        placeholder={t('calculator.productNamePlaceholder', 'Cth: Donat Coklat Lumer')}
        value={productName}
        onChange={(e) => onChange('productName', e.target.value)}
        error={error}
        prefix={<Package className="w-5 h-5 text-text-soft group-focus-within:text-brand-primary transition-colors" />}
        className="text-[15px] font-semibold h-12"
      />
    </div>
  );
};

