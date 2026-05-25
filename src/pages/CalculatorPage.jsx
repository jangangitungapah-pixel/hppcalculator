import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CostItemRow } from '../components/ui/CostItemRow';
import { ResultCard } from '../components/ui/ResultCard';
import { Badge } from '../components/ui/Badge';
import { calculateQuickHpp, validateQuickCalculationInput, formatCurrency, formatPercent } from '../lib/calculations';
import { createCalculationInputFromForm, createFormFromSavedCalculation } from '../lib/data/calculationMapper';
import { AlertTriangle, Plus, Calculator } from 'lucide-react';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';

const emptyCostItem = () => ({
  id: Math.random().toString(36).substring(7),
  name: '',
  category: 'Bahan',
  amount: ''
});

const defaultForm = {
  productName: '',
  costItems: [
    { id: '1', name: 'Biaya Bahan', category: 'Bahan', amount: '' },
    { id: '2', name: 'Biaya Kemasan', category: 'Kemasan', amount: '' },
    { id: '3', name: 'Biaya Tenaga Kerja', category: 'TenagaKerja', amount: '' },
    { id: '4', name: 'Biaya Operasional', category: 'Operasional', amount: '' },
  ],
  outputQuantity: '',
  failedQuantity: '',
  sellingUnit: 'pcs',
  sellingPrice: ''
};

export const CalculatorPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const { settings, saveCalculation, calculatorDraft, saveDraft, clearDraft } = useAppData();
  const { addToast } = useToast();

  const [form, setForm] = useState(defaultForm);
  const [validationErrors, setValidationErrors] = useState(null);
  const [result, setResult] = useState(null);
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);
  
  const isInitialMount = useRef(true);
  const debounceTimer = useRef(null);

  // Initialize form from "Use Again" state or draft
  useEffect(() => {
    if (isInitialMount.current) {
      if (location.state?.useAgainForm) {
        // Hydrate from "Use Again"
        const restoredForm = createFormFromSavedCalculation({ input: location.state.useAgainForm });
        if (restoredForm) setForm(restoredForm);
      } else if (calculatorDraft && calculatorDraft.form) {
        // Hydrate from draft
        setForm(calculatorDraft.form);
        addToast({ type: 'info', title: t('toasts.draftRestoredTitle'), duration: 2000 });
      }
      isInitialMount.current = false;
    }
  }, [location.state, calculatorDraft, addToast, t]);

  // Autosave draft on form change (debounced)
  useEffect(() => {
    if (isInitialMount.current) return;
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveDraft(form);
    }, 1000);

    return () => clearTimeout(debounceTimer.current);
  }, [form, saveDraft]);

  // Auto-validate form when calculating or if has calculated once
  useEffect(() => {
    if (hasCalculatedOnce && isDesktop && !isInitialMount.current) {
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
    setForm(defaultForm);
    setResult(null);
    setValidationErrors(null);
    setHasCalculatedOnce(false);
    clearDraft();
    addToast({ type: 'info', title: t('toasts.draftClearedTitle'), duration: 2000 });
  };

  const getCleanInputPayload = () => {
    return createCalculationInputFromForm(form, settings);
  };

  const handleCalculate = (silent = false) => {
    const payload = getCleanInputPayload();
    const validation = validateQuickCalculationInput(payload);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors(null);
    
    try {
      const calcResult = calculateQuickHpp(payload);
      setResult(calcResult);
      setHasCalculatedOnce(true);

      if (!isDesktop && !silent) {
        navigate('/calculator/result', { state: { input: payload, result: calcResult } });
      }
    } catch (e) {
      console.error(e);
      if (!silent) {
        addToast({ type: 'error', title: t('toasts.errorTitle'), message: e.message });
      }
    }
  };

  const handleSaveCalculation = () => {
    if (!result) return;
    const payload = getCleanInputPayload();
    const saved = saveCalculation(payload, result);
    addToast({
      type: 'success',
      title: t('toasts.calculationSavedTitle'),
      message: t('toasts.calculationSavedMessage')
    });
    clearDraft(); // clear draft after saving
    navigate('/history/' + saved.id);
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
      <div className="page-header">
        <Badge variant="neutral" className="mb-3 bg-brand-soft text-brand-primary border-none">
          {lang === 'en' ? 'Quick HPP Calculator' : 'Kalkulator Cepat'}
        </Badge>
        <h1 className="page-title text-3xl md:text-4xl">{t('calculator.pageTitle')}</h1>
        <p className="page-subtitle text-lg">{t('calculator.pageSubtitle')}</p>
        
        <div className="mt-4 p-3 bg-surface border border-border rounded-xl inline-flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">1. Isi Biaya</span> → 
          <span className="font-medium text-text-primary">2. Hasil Produksi</span> → 
          <span className="font-medium text-text-primary">3. Harga Jual</span> → 
          <span className="font-medium text-brand-primary">Lihat Untung</span>
        </div>
      </div>

      <StaggerContainer className="split-layout items-start">
        {/* Left Column: Form */}
        <div className="content-stack w-full lg:max-w-3xl">
          
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
          <FadeIn>
            <Card className="p-6 lg:p-8 bg-white/90 rounded-3xl shadow-sm border border-brand-soft/50 transition-premium hover:shadow-floating">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-glow-primary">1</div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">{t('calculator.productInfo')}</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 ml-11 leading-relaxed">
                {lang === 'en' ? 'What product are you calculating?' : 'Produk apa yang ingin kamu hitung?'}
              </p>
              <div className="ml-11">
                <Input 
                  label={t('calculator.productName')}
                  placeholder={t('calculator.productNamePlaceholder')}
                  value={form.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  error={validationErrors?.productName}
                />
                <p className="text-xs text-text-secondary mt-2">
                  {lang === 'en' ? 'Example: Chocolate Donut, Iced Milk Coffee, Chicken Rice Bowl' : 'Contoh: Donat Coklat, Es Kopi Susu, Rice Bowl Ayam'}
                </p>
              </div>
            </Card>
          </FadeIn>

          {/* 2. Cost Items */}
          <FadeIn>
            <Card className="p-6 lg:p-8 bg-white/90 rounded-3xl shadow-sm border border-brand-soft/50 transition-premium hover:shadow-floating">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-glow-primary">2</div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">{t('calculator.costItems')}</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 ml-11 leading-relaxed">
                {lang === 'en' ? 'Enter all costs to produce one batch of this product.' : 'Masukkan semua biaya untuk membuat satu resep/batch produk ini.'}
              </p>
              
              <div className="space-y-4 ml-11">
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
                <p className="text-sm text-status-loss mt-3 ml-11">{validationErrors.costItems}</p>
              )}

              <Button 
                variant="ghost" 
                onClick={addCostItem} 
                className="w-full mt-6 border border-dashed border-border hover:bg-surface-muted ml-11"
                iconLeft={<Plus className="w-4 h-4" />}
              >
                {t('calculator.addCost')}
              </Button>
            </Card>
          </FadeIn>

          {/* 3. Production Output */}
          <FadeIn>
            <Card className="p-6 lg:p-8 bg-white/90 rounded-3xl shadow-sm border border-brand-soft/50 transition-premium hover:shadow-floating">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-glow-primary">3</div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">{t('calculator.productionOutput')}</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 ml-11 leading-relaxed">
                {lang === 'en' ? 'How many sellable units are produced from the costs above?' : 'Berapa banyak produk yang bisa dijual dari biaya di atas?'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-11">
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
                <div>
                  <Input 
                    type="number"
                    min="0"
                    label={t('calculator.failedQuantity')}
                    placeholder="0"
                    value={form.failedQuantity}
                    onChange={(e) => updateField('failedQuantity', e.target.value)}
                    error={validationErrors?.failedQuantity}
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    {lang === 'en' ? 'Rejected output reduces sellable quantity, so cost per unit can increase.' : 'Produk gagal mengurangi jumlah yang bisa dijual, sehingga HPP per produk bisa naik.'}
                  </p>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* 4. Selling Price */}
          <FadeIn>
            <Card className="p-6 lg:p-8 bg-white/90 rounded-3xl shadow-sm border border-brand-soft/50 transition-premium hover:shadow-floating">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-glow-primary">4</div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">{t('calculator.sellingPrice')}</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 ml-11 leading-relaxed">
                {lang === 'en' ? 'Enter the selling price you want to test.' : 'Masukkan harga jual yang ingin kamu tes.'}
              </p>
              <div className="ml-11">
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
              </div>
            </Card>
          </FadeIn>

          {/* Mobile Calculate Button */}
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
          <FadeIn className="sticky-panel hidden lg:block w-full">
            {result ? (
              <Card className="p-6 border-brand-primary/20 shadow-floating bg-surface">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold">{t('result.resultTitle')}</h3>
                  <Badge variant={result.profitStatus.key}>{t(`result.status.${result.profitStatus.key}`)}</Badge>
                </div>

                <div className="mb-6 bg-brand-soft p-4 rounded-xl text-center">
                  <div className="text-sm font-semibold opacity-80 mb-1">{t('result.hppPerUnit')}</div>
                  <AnimatedNumber 
                    value={result.hppPerUnit} 
                    isCurrency={true}
                    className="text-4xl font-bold text-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <ResultCard 
                    label={t('result.profitPerUnit')} 
                    value={<AnimatedNumber value={result.profitPerUnit} isCurrency={true} />}
                    tone={result.profitPerUnit > 0 ? 'good' : result.profitPerUnit < 0 ? 'loss' : 'neutral'}
                  />
                  <ResultCard 
                    label={t('result.margin')} 
                    value={<AnimatedNumber value={result.marginPercent} suffix="%" />}
                  />
                </div>
                
                {result.warnings && result.warnings.length > 0 && (
                  <div className="flex flex-col gap-2 mb-6">
                    {result.warnings.map((warn, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-status-low bg-status-lowBg p-2 rounded-md border border-status-low/20">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <p className="text-xs">{lang === 'en' ? warn.messageEn || warn.message : warn.messageId || warn.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t('result.totalProductionCost')}</span>
                    <AnimatedNumber value={result.totalProductionCost} isCurrency={true} className="font-semibold" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t('result.totalProfit')}</span>
                    <AnimatedNumber 
                      value={result.totalProfit} 
                      isCurrency={true} 
                      className={`font-semibold ${result.totalProfit < 0 ? 'text-status-loss' : 'text-status-good'}`} 
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-text-primary mb-3">{t('result.suggestedPrices')}</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-muted border border-border text-sm transition-premium hover:border-brand-soft">
                      <span className="text-text-secondary font-medium">{t('result.safePrice')} (15%)</span>
                      <AnimatedNumber value={result.suggestedPrices?.safe?.price || 0} isCurrency={true} className="font-bold" />
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-status-okayBg border border-status-okay/20 text-status-okay text-sm transition-premium hover:border-status-okay/40">
                      <span className="font-medium">{t('result.idealPrice')} (30%)</span>
                      <AnimatedNumber value={result.suggestedPrices?.ideal?.price || 0} isCurrency={true} className="font-bold" />
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-status-goodBg border border-status-good/20 text-status-good text-sm transition-premium hover:border-status-good/40">
                      <span className="font-medium">{t('result.premiumPrice')} (50%)</span>
                      <AnimatedNumber value={result.suggestedPrices?.premium?.price || 0} isCurrency={true} className="font-bold" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  <Button className="w-full" onClick={handleSaveCalculation}>
                    {t('result.saveCalculation')}
                  </Button>
                  <Button variant="secondary" className="w-full border-border bg-surface-muted text-text-primary hover:bg-border/30" onClick={resetForm}>
                    {t('calculator.resetButton')}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center bg-surface-muted/50 border border-dashed border-border h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl">
                <div className="w-20 h-20 bg-brand-soft rounded-full flex items-center justify-center mb-6 text-brand-primary shadow-sm shadow-glow-primary">
                  <Calculator className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('calculator.resultPlaceholderTitle')}</h3>
                <p className="text-text-secondary text-sm">{t('calculator.resultPlaceholderBody')}</p>
                <Button className="mt-6 w-full" onClick={() => handleCalculate(false)}>
                  {t('calculator.calculateButton')}
                </Button>
              </Card>
            )}
          </FadeIn>
        )}
      </StaggerContainer>
    </PageContainer>
  );
};
