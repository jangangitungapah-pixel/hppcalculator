import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Tag, Calculator, ChefHat } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useLanguage } from '../hooks/useLanguage';
import { useRecipes } from '../hooks/useRecipes';
import { useIngredients } from '../hooks/useIngredients';
import { getLocalizedUnitOptions, convertBetweenUnits } from '../lib/units';
import { validateRecipeInput, calculateRecipeCost, calculateIngredientUsageCost } from '../lib/recipe';
import { formatCurrency } from '../lib/calculations';
import { useToast } from '../hooks/useToast';
import { useAppData } from '../hooks/useAppData';
import { getRecipeDraft, saveRecipeDraft, clearRecipeDraft } from '../lib/storage';
import { createPortal } from 'react-dom';

export const RecipeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings } = useAppData();
  const { getRecipeById, saveRecipe, updateRecipe } = useRecipes();
  const { ingredients } = useIngredients();
  const { addToast } = useToast();
  
  const isEdit = Boolean(id && id !== 'new');
  const unitOptions = getLocalizedUnitOptions(lang);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    outputQuantity: '1',
    outputUnit: 'pcs',
    failedQuantity: '0',
    wastePercent: '0',
    ingredients: [],
    extraCosts: []
  });
  
  const [errors, setErrors] = useState({});
  const [baseForm, setBaseForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState(null);

  const isFormDirty = baseForm ? JSON.stringify(form) !== JSON.stringify(baseForm) : false;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isFormDirty && !isSaving && currentLocation.pathname !== nextLocation.pathname
  );

  // Initialize baseForm for comparison (isDirty check)
  useEffect(() => {
    if (!isEdit) {
      const initialForm = {
        name: '',
        description: '',
        category: '',
        outputQuantity: '1',
        outputUnit: 'pcs',
        failedQuantity: '0',
        wastePercent: '0',
        ingredients: [],
        extraCosts: []
      };
      setBaseForm(initialForm);
    }
  }, [isEdit]);

  // Check for unsaved draft on mount/id change
  useEffect(() => {
    const draft = getRecipeDraft();
    if (draft && draft.recipeId === (id || 'new') && draft.form) {
      setDraftToRestore(draft);
    }
  }, [id]);

  // Intercept window unload/refresh for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty && !isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormDirty, isSaving]);

  useEffect(() => {
    if (isEdit) {
      const existing = getRecipeById(id);
      if (existing) {
        const loadedForm = {
          ...existing,
          outputQuantity: existing.outputQuantity.toString(),
          failedQuantity: (existing.failedQuantity || 0).toString(),
          wastePercent: (existing.wastePercent || 0).toString(),
          ingredients: existing.ingredients.map(ing => ({
            ...ing,
            usedQuantity: ing.usedQuantity.toString()
          })),
          extraCosts: (existing.extraCosts || []).map(cost => ({
            ...cost,
            amount: cost.amount.toString()
          }))
        };
        setForm(loadedForm);
        setBaseForm(loadedForm);
      } else {
        navigate('/recipes');
      }
    }
  }, [id, isEdit, getRecipeById, navigate]);

  // Live calculation of recipe cost based on form state
  const liveStats = useMemo(() => {
    let totalIngredientCost = 0;
    form.ingredients.forEach(ing => {
      const selectedIng = ingredients.find(i => i.id === ing.ingredientId);
      if (selectedIng) {
        totalIngredientCost += calculateIngredientUsageCost(
          selectedIng, 
          Number(ing.usedQuantity) || 0, 
          ing.usedUnit
        );
      }
    });

    let totalExtraCost = 0;
    form.extraCosts.forEach(cost => {
      totalExtraCost += Number(cost.amount) || 0;
    });

    const totalCost = totalIngredientCost + totalExtraCost;
    const outQty = Number(form.outputQuantity) || 1;
    const failedQty = Number(form.failedQuantity) || 0;
    const sellableQty = Math.max(0, outQty - failedQty);
    const hppPerUnit = sellableQty > 0 ? totalCost / sellableQty : 0;

    return {
      totalIngredientCost,
      totalExtraCost,
      totalCost,
      hppPerUnit,
      sellableQty
    };
  }, [form.ingredients, form.extraCosts, form.outputQuantity, form.failedQuantity, ingredients]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addIngredient = () => {
    if (ingredients.length === 0) {
      addToast({ type: 'error', title: t('errors.noIngredientsAvailable') });
      return;
    }
    const firstIng = ingredients[0];
    setForm(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: crypto.randomUUID(),
          ingredientId: firstIng.id,
          usedQuantity: '1',
          usedUnit: firstIng.purchaseUnit
        }
      ]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setForm(prev => {
      const newIngs = [...prev.ingredients];
      newIngs[index] = { ...newIngs[index], [field]: value };
      
      // Auto update unit when ingredient changes
      if (field === 'ingredientId') {
        const selectedIng = ingredients.find(i => i.id === value);
        if (selectedIng) {
          newIngs[index].usedUnit = selectedIng.purchaseUnit;
        }
      }
      
      return { ...prev, ingredients: newIngs };
    });
  };

  const removeIngredient = (index) => {
    setForm(prev => {
      const newIngs = [...prev.ingredients];
      newIngs.splice(index, 1);
      return { ...prev, ingredients: newIngs };
    });
  };

  const addExtraCost = () => {
    setForm(prev => ({
      ...prev,
      extraCosts: [
        ...prev.extraCosts,
        { id: crypto.randomUUID(), name: '', amount: '', category: 'other' }
      ]
    }));
  };

  const updateExtraCost = (index, field, value) => {
    setForm(prev => {
      const newCosts = [...prev.extraCosts];
      newCosts[index] = { ...newCosts[index], [field]: value };
      return { ...prev, extraCosts: newCosts };
    });
  };

  const removeExtraCost = (index) => {
    setForm(prev => {
      const newCosts = [...prev.extraCosts];
      newCosts.splice(index, 1);
      return { ...prev, extraCosts: newCosts };
    });
  };

  const getIngredientCost = (ing) => {
    const selectedIng = ingredients.find(i => i.id === ing.ingredientId);
    if (!selectedIng) return 0;
    return calculateIngredientUsageCost(selectedIng, Number(ing.usedQuantity), ing.usedUnit);
  };

  const handleSave = () => {
    // Populate costs before saving
    const populatedIngredients = form.ingredients.map(ing => {
      const selectedIng = ingredients.find(i => i.id === ing.ingredientId);
      
      const totalCost = getIngredientCost(ing);
      let baseQuantity = Number(ing.usedQuantity);
      if (selectedIng) {
        try {
          baseQuantity = convertBetweenUnits(Number(ing.usedQuantity), ing.usedUnit, selectedIng.baseUnit, selectedIng.density);
        } catch (e) {
          console.warn('[RecipeFormPage] Could not convert units:', e);
        }
      }
      return {
        ...ing,
        usedQuantity: Number(ing.usedQuantity),
        baseQuantity,
        baseUnit: selectedIng?.baseUnit || ing.usedUnit,
        ingredientNameSnapshot: selectedIng?.name || 'Unknown',
        costPerBaseUnitSnapshot: selectedIng?.costPerBaseUnit || 0,
        totalCost
      };
    });

    const populatedExtraCosts = form.extraCosts.map(cost => ({
      ...cost,
      amount: Number(cost.amount)
    }));

    const recipeInput = {
      ...form,
      outputQuantity: Number(form.outputQuantity),
      failedQuantity: Number(form.failedQuantity),
      wastePercent: Number(form.wastePercent),
      ingredients: populatedIngredients,
      extraCosts: populatedExtraCosts
    };

    const { isValid, errors: validationErrors } = validateRecipeInput(recipeInput);
    
    if (!isValid) {
      setErrors(validationErrors);
      addToast({ type: 'error', title: t('errors.validationHelpTitle') });
      return;
    }

    setIsSaving(true);

    const result = calculateRecipeCost(recipeInput, settings);

    if (isEdit) {
      updateRecipe(id, { ...recipeInput, resultSnapshot: result });
    } else {
      saveRecipe(recipeInput, result);
    }
    
    clearRecipeDraft();
    
    addToast({ type: 'success', title: t('recipes.recipeSaved') });
    navigate('/recipes');
  };

  return (
    <PageContainer maxWidth="max-w-5xl" className="py-4 sm:py-5">
      {/* Top Header */}
      <div className="mb-6 flex items-center gap-3">
        <button 
          onClick={() => navigate('/recipes')}
          aria-label={t('common.back', 'Kembali')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-cream border border-border-soft hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
          {isEdit ? t('recipes.editRecipe') : t('recipes.createRecipe')}
        </h2>
      </div>

      {draftToRestore && (
        <div className="mb-5 p-4 bg-amber-500/5 border border-amber-500/15 text-amber-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3 items-start">
            <ChefHat className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-amber-950 block mb-0.5">
                {lang === 'id' ? 'Draf Belum Disimpan Ditemukan' : 'Unsaved Draft Found'}
              </strong>
              <span className="text-xs font-semibold text-amber-900/80">
                {lang === 'id'
                  ? `Kami menemukan draf dari tanggal ${new Date(draftToRestore.updatedAt).toLocaleString('id-ID')}.`
                  : `We found a draft from ${new Date(draftToRestore.updatedAt).toLocaleString('en-US')}.`}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end mt-2 sm:mt-0">
            <button
              onClick={() => {
                clearRecipeDraft();
                setDraftToRestore(null);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-850 hover:bg-amber-500/10 rounded-xl border border-amber-500/10 transition-all cursor-pointer"
            >
              {lang === 'id' ? 'Abaikan' : 'Ignore'}
            </button>
            <button
              onClick={() => {
                setForm(draftToRestore.form);
                setBaseForm(draftToRestore.form);
                setDraftToRestore(null);
                addToast({
                  type: 'success',
                  title: lang === 'id' ? 'Draf resep dipulihkan' : 'Recipe draft restored'
                });
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {lang === 'id' ? 'Pulihkan' : 'Restore'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs">
            <h2 className="text-sm font-extrabold text-text-primary uppercase tracking-wider mb-4 pb-2 border-b border-border-soft">
              Informasi Dasar
            </h2>
            <div className="space-y-4">
              <Input 
                label={t('recipes.recipeName')}
                placeholder="Cth: Donat Coklat Lumer"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                error={errors.name && t('errors.recipeNameRequired')}
                className="bg-surface-cream border-border/80 rounded-xl"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label={t('recipes.recipeCategory')}
                  placeholder="Cth: Makanan, Roti, Minuman"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="bg-surface-cream border-border/80 rounded-xl"
                />
                <Input 
                  label={t('recipes.description')}
                  placeholder="Deskripsi singkat resep"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="bg-surface-cream border-border/80 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input 
                  type="number"
                  min="0"
                  label={t('recipes.outputQuantity')}
                  placeholder="1"
                  value={form.outputQuantity}
                  onChange={(e) => updateField('outputQuantity', e.target.value)}
                  error={errors.outputQuantity && t('errors.outputRequired')}
                  className="bg-surface-cream border-border/80 rounded-xl font-bold text-center"
                />
                <Select 
                  label={t('recipes.outputUnit')}
                  value={form.outputUnit}
                  onChange={(e) => updateField('outputUnit', e.target.value)}
                  options={[
                    { value: 'pcs', label: 'Pcs / Buah' },
                    { value: 'porsi', label: 'Porsi' },
                    { value: 'cup', label: 'Cup' },
                    { value: 'loyang', label: 'Loyang' },
                    { value: 'toples', label: 'Toples' },
                    { value: 'box', label: 'Box / Kotak' }
                  ]}
                  className="bg-surface-cream border-border/80 rounded-xl"
                />
                <Input 
                  type="number"
                  min="0"
                  label={t('recipes.failedQuantity')}
                  placeholder="0"
                  value={form.failedQuantity}
                  onChange={(e) => updateField('failedQuantity', e.target.value)}
                  className="bg-surface-cream border-border/80 rounded-xl font-bold text-center"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border-soft mb-4">
              <h2 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                {t('recipes.ingredients')}
              </h2>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={addIngredient}
                className="h-8 text-xs font-bold border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-lg px-3"
              >
                Tambah Bahan
              </Button>
            </div>

            {errors.ingredients && (
              <div className="text-status-loss text-xs mb-4 bg-status-loss/5 p-3 rounded-xl border border-status-loss/15 font-semibold">
                {t('errors.ingredientRequired')}
              </div>
            )}

            {form.ingredients.length === 0 ? (
              <div className="text-center py-10 text-text-secondary border border-dashed border-border/80 rounded-2xl bg-surface-cream/50 text-xs font-semibold leading-relaxed">
                Belum ada bahan baku yang dimasukkan.<br/>Klik tombol "Tambah Bahan" di atas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {form.ingredients.map((ing, index) => {
                  const selectedIng = ingredients.find(i => i.id === ing.ingredientId);
                  const ingCost = getIngredientCost(ing);

                  return (
                    <div key={ing.id} className="flex flex-col sm:flex-row gap-3 p-3.5 border border-border-soft rounded-2xl bg-surface-cream/40 items-stretch sm:items-center relative group transition-all hover:border-border">
                      {/* Ingredient Selector */}
                      <div className="flex-1 min-w-0 relative flex items-center">
                        <select 
                          className="w-full bg-surface border border-border-soft rounded-xl pl-3.5 pr-9 py-2 text-xs font-bold text-text-primary appearance-none focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                          value={ing.ingredientId}
                          onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                          aria-label="Pilih Bahan Baku"
                        >
                          {ingredients.map(i => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 pointer-events-none text-text-secondary">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          min="0"
                          step="any"
                          placeholder="Jml"
                          className="w-full sm:w-20 bg-surface border border-border-soft rounded-xl px-3 py-2 text-xs font-bold text-text-primary text-center focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                          value={ing.usedQuantity}
                          onChange={(e) => updateIngredient(index, 'usedQuantity', e.target.value)}
                          aria-label="Jumlah Bahan"
                        />

                        {/* Unit Selector */}
                        <div className="relative w-full sm:w-32 flex items-center">
                          <select 
                            className="w-full bg-surface border border-border-soft rounded-xl pl-3.5 pr-8 py-2 text-xs font-bold text-text-primary appearance-none focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            value={ing.usedUnit}
                            onChange={(e) => updateIngredient(index, 'usedUnit', e.target.value)}
                            aria-label="Satuan Bahan"
                          >
                            {unitOptions.map(u => (
                              <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                          </select>
                          <div className="absolute right-2.5 pointer-events-none text-text-secondary">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>

                        {/* Price Badge Preview */}
                        <div className="hidden sm:flex items-center justify-end w-24 shrink-0 text-right pr-2">
                          <span className="text-xs font-extrabold text-text-primary">
                            {formatCurrency(ingCost, lang, settings.currency)}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeIngredient(index)}
                          aria-label="Hapus Bahan"
                          className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-700 text-text-secondary border border-transparent hover:border-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Extra Costs */}
          <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border-soft mb-4">
              <h2 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                {t('recipes.extraCosts')}
              </h2>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={addExtraCost}
                className="h-8 text-xs font-bold border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-lg px-3"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Biaya
              </Button>
            </div>

            {form.extraCosts.length === 0 ? (
              <div className="text-center py-8 text-text-secondary border border-dashed border-border/80 rounded-2xl bg-surface-cream/50 text-xs font-semibold leading-relaxed">
                Belum ada biaya operasional / kemasan tambahan.<br/>Klik tombol "Tambah Biaya" di atas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {form.extraCosts.map((cost, index) => (
                  <div key={cost.id} className="flex flex-col sm:flex-row gap-3 p-3.5 border border-border-soft rounded-2xl bg-surface-cream/40 items-stretch sm:items-center relative transition-all hover:border-border">
                    <div className="flex-1">
                      <input 
                        type="text"
                        placeholder="Nama Biaya (cth: Kemasan Box, Tabung Gas)"
                        className="w-full bg-surface border border-border-soft rounded-xl px-3.5 py-2 text-xs font-bold text-text-primary focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        value={cost.name}
                        onChange={(e) => updateExtraCost(index, 'name', e.target.value)}
                        aria-label="Nama Biaya Tambahan"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1 sm:w-36">
                        <span className="absolute left-3.5 top-2.5 text-text-secondary text-xs font-bold">Rp</span>
                        <input 
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full bg-surface border border-border-soft rounded-xl pl-9 pr-3.5 py-2 text-xs font-bold text-text-primary focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                          value={cost.amount}
                          onChange={(e) => updateExtraCost(index, 'amount', e.target.value)}
                          aria-label="Jumlah Biaya Tambahan"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeExtraCost(index)}
                        aria-label="Hapus Biaya Tambahan"
                        className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-700 text-text-secondary border border-transparent hover:border-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Live Estimator Card */}
        <div className="space-y-6">
          <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs lg:sticky lg:top-6 space-y-5">
            <h3 className="font-extrabold text-sm text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-primary" />
              Live HPP Preview
            </h3>
            
            <div className="space-y-3.5">
              <div className="bg-surface-cream border border-border-soft rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Biaya Bahan Baku</p>
                  <p className="text-sm font-black text-text-primary">
                    {formatCurrency(liveStats.totalIngredientCost, lang, settings.currency)}
                  </p>
                </div>
              </div>

              <div className="bg-surface-cream border border-border-soft rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Biaya Tambahan</p>
                  <p className="text-sm font-black text-text-primary">
                    {formatCurrency(liveStats.totalExtraCost, lang, settings.currency)}
                  </p>
                </div>
              </div>

              <div className="bg-surface-cream border border-border-soft rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Total Modal Resep</p>
                  <p className="text-sm font-black text-text-primary">
                    {formatCurrency(liveStats.totalCost, lang, settings.currency)}
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden p-5 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 shadow-md border border-orange-400/10 text-white text-center">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
                <p className="text-[10px] font-black uppercase tracking-wider text-yellow-100 mb-1">Estimasi HPP per {form.outputUnit}</p>
                <p className="text-2xl font-black">
                  {formatCurrency(liveStats.hppPerUnit, lang, settings.currency)}
                </p>
                <p className="text-[10px] text-white/80 font-bold mt-2">
                  Bisa Dijual: {liveStats.sellableQty} {form.outputUnit}
                </p>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-sm font-black rounded-xl shadow-lg shadow-orange-500/10 transition-all" 
              onClick={handleSave}
            >
              <Save className="w-4.5 h-4.5 mr-2" />
              {t('common.save')}
            </Button>
          </div>
        </div>
      </div>
      {/* Blocker Modal */}
      {blocker.state === 'blocked' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface border border-border-soft rounded-3xl p-6 max-w-md w-full shadow-floating animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <ChefHat className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-extrabold text-text-primary tracking-tight mb-1.5">
                  {lang === 'id' ? 'Simpan Resep sebagai Draft?' : 'Save Recipe as Draft?'}
                </h3>
                <p className="text-xs text-text-secondary font-semibold leading-relaxed mb-5">
                  {lang === 'id' 
                    ? 'Perubahan Anda belum disimpan. Apakah Anda ingin menyimpannya sebagai draft untuk dilanjutkan nanti, atau membuang semua perubahan?' 
                    : 'Your changes have not been saved. Would you like to save them as a draft to continue later, or discard all changes?'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <button
                    onClick={() => {
                      blocker.reset();
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-text-secondary border border-border-soft hover:bg-surface-cream rounded-xl transition-all cursor-pointer text-center"
                  >
                    {lang === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => {
                      clearRecipeDraft();
                      blocker.proceed();
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-red-650 hover:bg-red-500/5 border border-red-500/10 rounded-xl transition-all cursor-pointer text-center"
                  >
                    {lang === 'id' ? 'Buang' : 'Discard'}
                  </button>
                  <button
                    onClick={() => {
                      saveRecipeDraft(id || 'new', form);
                      addToast({
                        type: 'success',
                        title: lang === 'id' ? 'Draft resep disimpan' : 'Recipe draft saved'
                      });
                      blocker.proceed();
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-md hover:shadow-orange-500/10 rounded-xl transition-all cursor-pointer text-center"
                  >
                    {lang === 'id' ? 'Simpan Draft' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </PageContainer>
  );
};

