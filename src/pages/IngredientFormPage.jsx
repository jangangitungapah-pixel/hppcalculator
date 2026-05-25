import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { getLocalizedUnitOptions, calculateCostPerBaseUnit, getBaseUnit, formatQuantityWithUnit } from '../lib/units';
import { validateIngredientInput, calculateIngredientBaseData } from '../lib/recipe';
import { formatCurrency } from '../lib/calculations';
import { useToast } from '../hooks/useToast';

export const IngredientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { settings } = useAppData();
  const { getIngredientById, saveIngredient, updateIngredient } = useIngredients();
  const { addToast } = useToast();
  
  const isEdit = Boolean(id && id !== 'new');
  const unitOptions = getLocalizedUnitOptions(language);

  const [form, setForm] = useState({
    name: '',
    category: 'ingredient',
    purchasePrice: '',
    purchaseQuantity: '1',
    purchaseUnit: 'kg',
    supplier: '',
    notes: ''
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
          notes: existing.notes || ''
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
      purchaseQuantity: Number(form.purchaseQuantity)
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
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate('/ingredients')}
          className="p-2 rounded-full hover:bg-surface-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">
          {isEdit ? t('ingredients.editIngredient') : t('ingredients.addIngredient')}
        </h1>
      </div>

      <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm mb-6 space-y-5">
        <Input 
          label={t('ingredients.ingredientName')}
          placeholder="Cth: Tepung Terigu Segitiga Biru"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name && t('errors.requiredProductName')}
        />

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            {t('ingredients.category')}
          </label>
          <select 
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            <option value="ingredient">Bahan Utama</option>
            <option value="spice">Bumbu / Rempah</option>
            <option value="topping">Topping</option>
            <option value="packaging">Kemasan</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

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
                error={errors.purchaseQuantity && 'Wajib diisi'}
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                {t('ingredients.purchaseUnit')}
              </label>
              <select 
                className={`w-full bg-background border ${errors.purchaseUnit ? 'border-status-loss' : 'border-border'} rounded-xl px-2 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary`}
                value={form.purchaseUnit}
                onChange={(e) => updateField('purchaseUnit', e.target.value)}
              >
                {unitOptions.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-brand-soft/30 p-4 rounded-2xl flex justify-between items-center border border-brand-soft">
          <div className="text-sm">
            <p className="text-text-secondary font-medium">{t('ingredients.costPerBaseUnit')}</p>
            <p className="font-bold text-brand-primary text-lg">
              {formatCurrency(previewCost, language, settings.currency)} 
              <span className="text-sm font-medium text-text-secondary"> / {previewBaseUnit}</span>
            </p>
          </div>
          <div className="text-xs text-text-secondary text-right max-w-[150px]">
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

      <div className="flex gap-3">
        <Button className="flex-[2]" onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" />
          {t('common.save')}
        </Button>
      </div>
    </PageContainer>
  );
};
