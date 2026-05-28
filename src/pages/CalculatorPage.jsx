import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { AlertTriangle } from 'lucide-react';
import { StaggerContainer } from '../components/motion/StaggerContainer';

// Import subcomponents
import { CalculatorHero } from '../components/calculator/CalculatorHero';
import { CalculatorStepCard } from '../components/calculator/CalculatorStepCard';
import { ProductInfoSection } from '../components/calculator/ProductInfoSection';
import { CostItemsSection } from '../components/calculator/CostItemsSection';
import { ProductionOutputSection } from '../components/calculator/ProductionOutputSection';
import { SellingPriceSection } from '../components/calculator/SellingPriceSection';
import { CalculatorResultPreview } from '../components/calculator/CalculatorResultPreview';
import { CalculatorMobileCta } from '../components/calculator/CalculatorMobileCta';
import { CalculatorHelpCard } from '../components/calculator/CalculatorHelpCard';
import { CalculatorFormActions } from '../components/calculator/CalculatorFormActions';
import { CalculatorDraftBanner } from '../components/calculator/CalculatorDraftBanner';

import { calculateQuickHpp, validateQuickCalculationInput } from '../lib/calculations';
import { createCalculationInputFromForm, createFormFromSavedCalculation } from '../lib/data/calculationMapper';

const getValidationMessage = (error, lang) => {
  if (!error) return '';
  return lang === 'en'
    ? error.messageEn || error.messageId || error.message || ''
    : error.messageId || error.messageEn || error.message || '';
};

const normalizeValidationErrors = (errors = [], lang = 'id') => {
  const normalized = { _summary: [] };

  errors.forEach((error) => {
    const message = getValidationMessage(error, lang);
    const field = error.field || 'form';
    const baseField = field.split('[')[0];

    normalized._summary.push({ field, message });
    if (!normalized[field]) normalized[field] = message;
    if (!normalized[baseField]) normalized[baseField] = message;
  });

  return normalized;
};

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
    { id: '3', name: 'Biaya Tenaga Kerja', category: 'Tenaga Kerja', amount: '' },
    { id: '4', name: 'Biaya Operasional', category: 'Operasional', amount: '' },
  ],
  outputQuantity: '',
  failedQuantity: '',
  sellingUnit: 'pcs',
  customSellingUnit: '',
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
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  
  const isInitialMount = useRef(true);
  const debounceTimer = useRef(null);

  // Initialize form from "Use Again" state or draft
  useEffect(() => {
    if (isInitialMount.current) {
      if (location.state?.useAgainForm) {
        // Hydrate from "Use Again"
        const restoredForm = createFormFromSavedCalculation({ input: location.state.useAgainForm });
        if (restoredForm) setForm(restoredForm);
        isInitialMount.current = false;
      } else if (calculatorDraft && calculatorDraft.form) {
        // Show draft banner instead of auto-restoring silently
        setShowDraftBanner(true);
        isInitialMount.current = false;
      } else {
        isInitialMount.current = false;
      }
    }
  }, [location.state, calculatorDraft]);

  // Autosave draft on form change (debounced)
  useEffect(() => {
    if (isInitialMount.current || showDraftBanner) return;
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveDraft(form);
    }, 1000);

    return () => clearTimeout(debounceTimer.current);
  }, [form, saveDraft, showDraftBanner]);

  const dismissDraftBannerForNewWork = () => {
    if (showDraftBanner) {
      clearDraft();
      setShowDraftBanner(false);
    }
  };

  // Auto-validate form when calculating or if has calculated once
  useEffect(() => {
    if (hasCalculatedOnce && isDesktop && !isInitialMount.current) {
      handleCalculate(true); // silent calculate for desktop live updates
    }
  }, [form, hasCalculatedOnce, isDesktop]);

  const updateField = (field, value) => {
    dismissDraftBannerForNewWork();
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateCostItem = (index, field, value) => {
    dismissDraftBannerForNewWork();
    const newItems = [...form.costItems];
    newItems[index][field] = value;
    setForm(prev => ({ ...prev, costItems: newItems }));
  };

  const addCostItem = () => {
    dismissDraftBannerForNewWork();
    setForm(prev => ({ ...prev, costItems: [...prev.costItems, emptyCostItem()] }));
  };

  const addCostItemWithCategory = (category, defaultName) => {
    dismissDraftBannerForNewWork();
    const newItem = {
      id: Math.random().toString(36).substring(7),
      name: defaultName || '',
      category: category,
      amount: ''
    };
    setForm(prev => ({ ...prev, costItems: [...prev.costItems, newItem] }));
  };

  const removeCostItem = (index) => {
    dismissDraftBannerForNewWork();
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

  const handleRestoreDraft = () => {
    if (calculatorDraft && calculatorDraft.form) {
      setForm(calculatorDraft.form);
      addToast({ type: 'info', title: t('toasts.draftRestoredTitle'), duration: 2000 });
    }
    setShowDraftBanner(false);
  };

  const handleClearDraftBanner = () => {
    clearDraft();
    setShowDraftBanner(false);
    addToast({ type: 'info', title: t('toasts.draftClearedTitle'), duration: 2000 });
  };

  const getCleanInputPayload = () => {
    return createCalculationInputFromForm(form, settings);
  };

  const handleCalculate = (silent = false) => {
    const payload = getCleanInputPayload();
    const validation = validateQuickCalculationInput(payload);
    
    if (!validation.isValid) {
      setValidationErrors(normalizeValidationErrors(validation.errors, lang));
      setResult(null);
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

  return (
    <>
      <PageContainer maxWidth="max-w-[1280px]" className="py-4 sm:py-5 pb-48 lg:pb-6">
        <div className="calculator-shell pb-6 lg:pb-6">
        
        {/* Banner Hero */}
        <CalculatorHero />

        {/* Restore Unsaved Draft Banner */}
        {showDraftBanner && (
          <CalculatorDraftBanner 
            onRestore={handleRestoreDraft}
            onClear={handleClearDraftBanner}
            t={t}
          />
        )}

        <StaggerContainer className="calculator-grid">
          {/* Left Column: Form Blocks */}
          <div className="calculator-main">
            
            {/* Friendly Validation Errors summary */}
            {validationErrors?._summary?.length > 0 && (
              <div className="p-5 bg-red-500/[0.07] border border-red-500/20 rounded-3xl flex items-start gap-3.5 shadow-xs animate-fade-in mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-extrabold text-red-900 text-sm">{t('calculator.validationHelpTitle', 'Ada yang belum lengkap')}</h4>
                  <ul className="list-disc list-inside text-xs text-red-800 mt-2 space-y-2 font-semibold">
                    {validationErrors._summary.map((err, i) => (
                      <li key={`${err.field}-${i}`}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 1: Product Name */}
            <CalculatorStepCard
              stepNumber="1"
              title={t('calculator.productInfo', 'Info Produk')}
              helperText="Beri nama produk agar hasil hitung mudah dicari di riwayat."
            >
              <ProductInfoSection 
                productName={form.productName}
                onChange={updateField}
                error={validationErrors?.productName}
                t={t}
              />
            </CalculatorStepCard>

            {/* Step 2: Production Costs */}
            <CalculatorStepCard
              stepNumber="2"
              title={t('calculator.costItems', 'Biaya Produksi')}
              helperText="Masukkan semua biaya yang dipakai untuk satu batch produksi."
            >
              <CostItemsSection 
                costItems={form.costItems}
                onUpdate={updateCostItem}
                onRemove={removeCostItem}
                onAdd={addCostItem}
                onAddWithCategory={addCostItemWithCategory}
                error={validationErrors?.costItems}
                t={t}
              />
            </CalculatorStepCard>

            {/* Step 3: Production Output */}
            <CalculatorStepCard
              stepNumber="3"
              title={t('calculator.productionOutput', 'Hasil Produksi')}
              helperText="Berapa produk yang berhasil dijual setelah dikurangi produk gagal/rusak?"
            >
              <ProductionOutputSection 
                outputQuantity={form.outputQuantity}
                failedQuantity={form.failedQuantity}
                sellingUnit={form.sellingUnit}
                customSellingUnit={form.customSellingUnit}
                onFieldChange={updateField}
                errors={validationErrors}
                t={t}
              />
            </CalculatorStepCard>

            {/* Step 4: Selling Price */}
            <CalculatorStepCard
              stepNumber="4"
              title={t('calculator.sellingPrice', 'Harga Jual')}
              helperText="Masukkan harga jual yang kamu rencanakan untuk menghitung margin keuntungan."
            >
              <SellingPriceSection 
                sellingPrice={form.sellingPrice}
                onFieldChange={updateField}
                error={validationErrors?.sellingPrice}
                result={result}
                t={t}
              />
            </CalculatorStepCard>

            {/* Form Action buttons for desktop layout */}
            <CalculatorFormActions 
              result={result}
              onCalculate={() => handleCalculate(false)}
              onSave={handleSaveCalculation}
              onReset={resetForm}
              t={t}
            />

            {/* Beginner Quick Guide Accents */}
            <CalculatorHelpCard t={t} />

          </div>

          {/* Right Column: Desktop Sticky Result Preview */}
          <div className="calculator-side hidden lg:block">
            <CalculatorResultPreview 
              form={form}
              result={result}
              onCalculate={() => handleCalculate(false)}
              onSave={handleSaveCalculation}
              onReset={resetForm}
              t={t}
            />
          </div>
        </StaggerContainer>

        </div>
      </PageContainer>

      {/* Mobile Fixed Sticky Footer */}
      <CalculatorMobileCta
        form={form}
        result={result}
        onCalculate={() => handleCalculate(false)}
        onReset={resetForm}
        t={t}
      />
    </>
  );
};
