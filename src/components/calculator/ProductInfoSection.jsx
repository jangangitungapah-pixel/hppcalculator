import React from 'react';
import { Input } from '../ui/Input';

export const ProductInfoSection = ({ productName, onChange, error, t }) => {
  return (
    <div className="calculator-field">
      <Input 
        label={t('calculator.productName')}
        placeholder={t('calculator.productNamePlaceholder', 'Cth: Donat Coklat Lumer')}
        value={productName}
        onChange={(e) => onChange('productName', e.target.value)}
        error={error}
        className="text-lg font-semibold h-12"
      />
    </div>
  );
};
