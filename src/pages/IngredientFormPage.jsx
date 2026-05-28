import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { getLocalizedUnitOptions, calculateCostPerBaseUnit, getBaseUnit, formatQuantityWithUnit, getUnitType, UNIT_TYPES } from '../lib/units';
import { validateIngredientInput, calculateIngredientBaseData } from '../lib/recipe';
import { formatCurrency } from '../lib/calculations';
import { useToast } from '../hooks/useToast';

export const IngredientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings } = useAppData();
  const { getIngredientById, saveIngredient, updateIngredient } = useIngredients();
  const { addToast } = useToast();
  
  const isEdit = Boolean(id && id !== 'new');
  const unitOptions = getLocalizedUnitOptions(lang);

  const [form, setForm] = useState({
    name: '',
    category: 'ingredient',
    purchasePrice: '',
    purchaseQuantity: '1',
    purchaseUnit: 'kg',
    supplier: '',
    notes: '',
    density: '1.0'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const existing = getIngredientById(id);
      if (existing) {
        setForm({
          name: existing.name,
          category: existing.category || 'ingredient',
          purchasePrice: existing.purchasePrice.toString(),
          purchaseQuantity: existing.purchaseQuantity.toString(),
          purchaseUnit: existing.purchaseUnit,
          supplier: existing.supplier || '',
          notes: existing.notes || '',
          density: (existing.density || 1.0).toString()
        });
      } else {
        navigate('/ingredients');
      }
    }
  }, [id, isEdit, getIngredientById, navigate]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = () => {
    const { isValid, errors: validationErrors } = validateIngredientInput(form);
    
    if (!isValid) {
      setErrors(validationErrors);
      addToast({ type: 'error', title: t('errors.validationHelpTitle') });
      return;
    }

    const ingredientData = calculateIngredientBaseData({
      ...form,
      purchasePrice: Number(form.purchasePrice),
      purchaseQuantity: Number(form.purchaseQuantity),
      density: form.density !== undefined && form.density !== '' ? Number(form.density) : 1.0
    });

    if (isEdit) {
      updateIngredient(id, ingredientData);
    } else {
      saveIngredient(ingredientData);
    }
    
    addToast({ type: 'success', title: t('ingredients.savedToastTitle') });
    navigate('/ingredients');
  };

  // Live preview calculations
  const previewCost = calculateCostPerBaseUnit({
    purchasePrice: form.purchasePrice,
    purchaseQuantity: form.purchaseQuantity,
    purchaseUnit: form.purchaseUnit
  });
  const previewBaseUnit = getBaseUnit(form.purchaseUnit);

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-5 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/ingredients')}
          aria-label={t('common.back', 'Kembali')}
          className="-ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </Button>
        <h1 className="text-2xl font-bold text-text-primary">
          {isEdit ? t('ingredients.editIngredient') : t('ingredients.addIngredient')}
        </h1>
      </div>

      <div className="bg-surface border border-border p-4 sm:p-6 rounded-2xl shadow-sm mb-5 space-y-4">
        <Input 
          label={t('ingredients.ingredientName')}
          placeholder="Cth: Tepung Terigu Segitiga Biru"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name && t('errors.requiredProductName')}
        />

        <Select
          label={t('ingredients.category')}
          value={form.category}
          onChange={(e) => updateField('category', e.target.value)}
          options={[
            { value: 'ingredient', label: 'Bahan Pokok' },
            { value: 'protein', label: 'Protein' },
            { value: 'sayur_buah', label: 'Sayur / Buah' },
            { value: 'spice', label: 'Bumbu' },
            { value: 'dairy', label: 'Dairy' },
            { value: 'packaging', label: 'Kemasan' },
            { value: 'topping', label: 'Topping' },
            { value: 'operasional', label: 'Operasional' },
            { value: 'other', label: 'Lainnya' }
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            type="number"
            min="0"
            label={t('ingredients.purchasePrice')}
            prefix="Rp"
            placeholder="0"
            value={form.purchasePrice}
            onChange={(e) => updateField('purchasePrice', e.target.value)}
            error={errors.purchasePrice && t('errors.requiredCost')}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                type="number"
                min="0"
                label={t('ingredients.purchaseQuantity')}
                placeholder="1"
                value={form.purchaseQuantity}
                onChange={(e) => updateField('purchaseQuantity', e.target.value)}
                error={errors.purchaseQuantity && t('errors.requiredQuantity')}
              />
            </div>
            <div className="w-40">
              <Select 
                label={t('ingredients.purchaseUnit')}
                value={form.purchaseUnit}
                onChange={(e) => updateField('purchaseUnit', e.target.value)}
                options={unitOptions}
                error={errors.purchaseUnit && t('errors.requiredUnit')}
              />
            </div>
          </div>
        </div>

        {(getUnitType(form.purchaseUnit) === UNIT_TYPES.WEIGHT || getUnitType(form.purchaseUnit) === UNIT_TYPES.VOLUME) && (
          <div className="bg-background border border-border p-4 rounded-xl space-y-2">
            <Input 
              type="number"
              step="0.01"
              min="0.01"
              label={t('ingredients.density')}
              placeholder="1.0"
              value={form.density}
              onChange={(e) => updateField('density', e.target.value)}
              error={errors.density && t('errors.invalidDensity')}
              helperText={t('ingredients.densityHelp')}
            />
          </div>
        )}

        {/* Live Preview Panel */}
        <div className="bg-brand-soft/30 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border border-brand-soft">
          <div className="text-sm">
            <p className="text-text-secondary font-medium">{t('ingredients.costPerBaseUnit')}</p>
            <p className="font-bold text-brand-primary text-lg">
              {formatCurrency(previewCost, lang, settings.currency)} 
              <span className="text-sm font-medium text-text-secondary"> / {previewBaseUnit}</span>
            </p>
          </div>
          <div className="text-xs text-text-secondary text-left sm:text-right max-w-none sm:max-w-[180px]">
            Satuan dasar ({previewBaseUnit}) digunakan otomatis saat menghitung resep.
          </div>
        </div>

        <Input 
          label={t('ingredients.supplier')}
          placeholder="Cth: Toko Plastik Jaya (opsional)"
          value={form.supplier}
          onChange={(e) => updateField('supplier', e.target.value)}
        />

        <Input 
          label={t('ingredients.notes')}
          placeholder="Catatan tambahan (opsional)"
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button className="w-full sm:w-auto sm:px-8 font-bold" onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" />
          {t('common.save')}
        </Button>
      </div>
    </PageContainer>
  );
};
