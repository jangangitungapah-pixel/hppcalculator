import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { PageContainer } from '../components/layout/PageContainer';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CostItemRow } from '../components/ui/CostItemRow';
import { ResultCard } from '../components/ui/ResultCard';
import { Badge } from '../components/ui/Badge';
import { calculateQuickHpp, validateQuickCalculationInput, formatCurrency, formatPercent } from '../lib/calculations';
import { AlertTriangle, Plus } from 'lucide-react';

const emptyCostItem = () => ({
  id: Math.random().toString(36).substring(7),
  name: '',
  category: 'Bahan',
  amount: ''
});

export const CalculatorPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [form, setForm] = useState({
    productName: '',
    costItems: [
      { id: '1', name: '', category: 'Bahan', amount: '' },
      { id: '2', name: '', category: 'Kemasan', amount: '' },
      { id: '3', name: '', category: 'Operasional', amount: '' },
    ],
    outputQuantity: '',
    failedQuantity: '',
    sellingUnit: 'pcs',
    sellingPrice: ''
  });

  const [validationErrors, setValidationErrors] = useState(null);
  const [result, setResult] = useState(null);
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);

  // Auto-validate form when calculating or if has calculated once
  useEffect(() => {
    if (hasCalculatedOnce && isDesktop) {
      handleCalculate(true); // silent calculate for desktop live updates
    }
  }, [form, hasCalculatedOnce, isDesktop]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateCostItem = (index, field, value) => {
    const newItems = [...form.costItems];
    newItems[index][field] = value;
    setForm(prev => ({ ...prev, costItems: newItems }));
  };

  const addCostItem = () => {
    setForm(prev => ({ ...prev, costItems: [...prev.costItems, emptyCostItem()] }));
  };

  const removeCostItem = (index) => {
    if (form.costItems.length > 1) {
      const newItems = [...form.costItems];
      newItems.splice(index, 1);
      setForm(prev => ({ ...prev, costItems: newItems }));
    }
  };

  const resetForm = () => {
    setForm({
      productName: '',
      costItems: [
        { id: '1', name: '', category: 'Bahan', amount: '' },
        { id: '2', name: '', category: 'Kemasan', amount: '' },
        { id: '3', name: '', category: 'Operasional', amount: '' },
      ],
      outputQuantity: '',
      failedQuantity: '',
      sellingUnit: 'pcs',
      sellingPrice: ''
    });
    setResult(null);
    setValidationErrors(null);
    setHasCalculatedOnce(false);
  };

  const parseNumber = (val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleCalculate = (silent = false) => {
    const payload = {
      productName: form.productName,
      costItems: form.costItems.map(item => ({
        ...item,
        amount: parseNumber(item.amount)
      })),
      outputQuantity: parseNumber(form.outputQuantity),
      failedQuantity: parseNumber(form.failedQuantity),
      sellingUnit: form.sellingUnit,
      sellingPrice: parseNumber(form.sellingPrice)
    };

    const validation = validateQuickCalculationInput(payload);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      if (!silent) {
        // Optionally scroll to top or show toast if not silent
      }
      return;
    }

    setValidationErrors(null);
    
    try {
      // Hardcoded rounding step to 500 for MVP since settings aren't persisted
      const calcResult = calculateQuickHpp(payload, 500);
      setResult(calcResult);
      setHasCalculatedOnce(true);

      if (!isDesktop && !silent) {
        navigate('/calculator/result', { state: calcResult });
      }
    } catch (e) {
      console.error(e);
      // Fallback error handling
    }
  };

  const unitOptions = [
    { value: 'pcs', label: 'Pcs' },
    { value: 'porsi', label: 'Porsi' },
    { value: 'cup', label: 'Cup' },
    { value: 'box', label: 'Box' },
    { value: 'custom', label: 'Lainnya' },
  ];

  return (
    <PageContainer maxWidth="max-w-[1280px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">{t('calculator.pageTitle')}</h1>
        <p className="text-text-secondary">{t('calculator.pageSubtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Form */}
        <div className="flex-1 w-full space-y-6 lg:max-w-3xl">
          
          {/* Validation Help Alert */}
          {validationErrors && Object.keys(validationErrors).length > 0 && !hasCalculatedOnce && (
            <div className="p-4 bg-status-lossBg border border-status-loss/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-loss shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-status-loss text-sm">{t('calculator.validationHelpTitle')}</h4>
                <ul className="list-disc list-inside text-sm text-status-loss mt-1">
                  {Object.values(validationErrors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 1. Product Info */}
          <Card className="p-5 lg:p-6">
            <h2 className="text-lg font-bold mb-4">{t('calculator.productInfo')}</h2>
            <Input 
              label={t('calculator.productName')}
              placeholder={t('calculator.productNamePlaceholder')}
              value={form.productName}
              onChange={(e) => updateField('productName', e.target.value)}
              error={validationErrors?.productName}
            />
          </Card>

          {/* 2. Cost Items */}
          <Card className="p-5 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{t('calculator.costItems')}</h2>
            </div>
            
            <div className="space-y-4">
              {form.costItems.map((item, i) => (
                <CostItemRow 
                  key={item.id}
                  item={item}
                  index={i}
                  onChange={updateCostItem}
                  onRemove={removeCostItem}
                  canRemove={form.costItems.length > 1}
                  t={t}
                />
              ))}
            </div>
            
            {validationErrors?.costItems && (
              <p className="text-sm text-status-loss mt-3">{validationErrors.costItems}</p>
            )}

            <Button 
              variant="ghost" 
              onClick={addCostItem} 
              className="w-full mt-4 border border-dashed border-border"
              iconLeft={<Plus className="w-4 h-4" />}
            >
              {t('calculator.addCost')}
            </Button>
          </Card>

          {/* 3. Production Output */}
          <Card className="p-5 lg:p-6">
            <h2 className="text-lg font-bold mb-4">{t('calculator.productionOutput')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start">
                <Input 
                  type="number"
                  min="1"
                  label={t('calculator.outputQuantity')}
                  placeholder="0"
                  value={form.outputQuantity}
                  onChange={(e) => updateField('outputQuantity', e.target.value)}
                  containerClassName="flex-1"
                  error={validationErrors?.outputQuantity}
                />
                <Select 
                  label={t('calculator.sellingUnit')}
                  options={unitOptions}
                  value={form.sellingUnit}
                  onChange={(e) => updateField('sellingUnit', e.target.value)}
                  containerClassName="w-[100px] shrink-0"
                />
              </div>
              <Input 
                type="number"
                min="0"
                label={t('calculator.failedQuantity')}
                placeholder="0"
                value={form.failedQuantity}
                onChange={(e) => updateField('failedQuantity', e.target.value)}
                error={validationErrors?.failedQuantity}
              />
            </div>
          </Card>

          {/* 4. Selling Price */}
          <Card className="p-5 lg:p-6">
            <h2 className="text-lg font-bold mb-4">{t('calculator.sellingPrice')}</h2>
            <Input 
              type="number"
              min="0"
              prefix="Rp"
              label={t('calculator.sellingPrice')}
              placeholder="0"
              value={form.sellingPrice}
              onChange={(e) => updateField('sellingPrice', e.target.value)}
              error={validationErrors?.sellingPrice}
            />
          </Card>

          {/* Mobile Calculate Button (Sticky Bottom or Inline) */}
          <div className="lg:hidden mt-8 mb-4 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={resetForm}>
              {t('calculator.resetButton')}
            </Button>
            <Button className="flex-[2]" onClick={() => handleCalculate(false)}>
              {t('calculator.calculateButton')}
            </Button>
          </div>
        </div>

        {/* Right Column: Desktop Result Panel */}
        {isDesktop && (
          <div className="hidden lg:block w-[400px] shrink-0 sticky top-24">
            {result ? (
              <Card className="p-6 border-brand-primary/20 shadow-floating bg-surface">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold">{t('result.resultTitle')}</h3>
                  <Badge variant={result.profitStatus.key}>{t(`result.status.${result.profitStatus.key}`)}</Badge>
                </div>

                <div className="mb-6 bg-brand-soft p-4 rounded-xl text-center">
                  <div className="text-sm font-semibold opacity-80 mb-1">{t('result.hppPerUnit')}</div>
                  <div className="text-4xl font-bold text-brand-primary">
                    {formatCurrency(result.hppPerUnit, 'IDR', 'id-ID')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <ResultCard 
                    label={t('result.profitPerUnit')} 
                    value={formatCurrency(result.profitPerUnit, 'IDR', 'id-ID')}
                    tone={result.profitPerUnit > 0 ? 'good' : result.profitPerUnit < 0 ? 'loss' : 'neutral'}
                  />
                  <ResultCard 
                    label={t('result.margin')} 
                    value={formatPercent(result.marginPercent, 'id-ID')}
                  />
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t('result.totalProductionCost')}</span>
                    <span className="font-semibold">{formatCurrency(result.totalProductionCost, 'IDR', 'id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t('result.totalProfit')}</span>
                    <span className={`font-semibold ${result.totalProfit < 0 ? 'text-status-loss' : 'text-status-good'}`}>
                      {formatCurrency(result.totalProfit, 'IDR', 'id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button variant="secondary" className="flex-1" onClick={resetForm}>
                    {t('calculator.resetButton')}
                  </Button>
                  <Button className="flex-1">
                    {t('result.saveCalculation')}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center bg-surface-muted border-dashed h-full min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-brand-primary">
                  <AlertTriangle className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('calculator.resultPlaceholderTitle')}</h3>
                <p className="text-text-secondary text-sm">{t('calculator.resultPlaceholderBody')}</p>
                <Button className="mt-6 w-full" onClick={() => handleCalculate(false)}>
                  {t('calculator.calculateButton')}
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
