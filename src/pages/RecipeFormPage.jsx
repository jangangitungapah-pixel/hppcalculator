import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../hooks/useLanguage';
import { useRecipes } from '../hooks/useRecipes';
import { useIngredients } from '../hooks/useIngredients';
import { getLocalizedUnitOptions, convertBetweenUnits } from '../lib/units';
import { validateRecipeInput, calculateRecipeCost, calculateIngredientUsageCost } from '../lib/recipe';
import { formatCurrency } from '../lib/calculations';
import { useToast } from '../hooks/useToast';
import { useAppData } from '../hooks/useAppData';

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

  useEffect(() => {
    if (isEdit) {
      const existing = getRecipeById(id);
      if (existing) {
        setForm({
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
        });
      } else {
        navigate('/recipes');
      }
    }
  }, [id, isEdit, getRecipeById, navigate]);

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

    const result = calculateRecipeCost(recipeInput, settings);

    if (isEdit) {
      updateRecipe(id, { ...recipeInput, resultSnapshot: result });
    } else {
      saveRecipe(recipeInput, result);
    }
    
    addToast({ type: 'success', title: t('recipes.recipeSaved') });
    navigate('/recipes');
  };

  return (
    <PageContainer maxWidth="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/recipes')}
          aria-label={t('common.back', 'Kembali')}
          className="-ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </Button>
        <h1 className="text-2xl font-bold text-text-primary">
          {isEdit ? t('recipes.editRecipe') : t('recipes.createRecipe')}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-4">Informasi Dasar</h2>
          <div className="space-y-4">
            <Input 
              label={t('recipes.recipeName')}
              placeholder="Cth: Donat Coklat Lumer"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name && t('errors.recipeNameRequired')}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label={t('recipes.recipeCategory')}
                placeholder="Cth: Makanan, Minuman"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
              />
              <Input 
                label={t('recipes.description')}
                placeholder="Deskripsi singkat"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                type="number"
                min="0"
                label={t('recipes.outputQuantity')}
                placeholder="1"
                value={form.outputQuantity}
                onChange={(e) => updateField('outputQuantity', e.target.value)}
                error={errors.outputQuantity && t('errors.outputRequired')}
              />
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  {t('recipes.outputUnit')}
                </label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  value={form.outputUnit}
                  onChange={(e) => updateField('outputUnit', e.target.value)}
                >
                  <option value="pcs">Pcs / Buah</option>
                  <option value="porsi">Porsi</option>
                  <option value="cup">Cup</option>
                  <option value="loyang">Loyang</option>
                  <option value="toples">Toples</option>
                  <option value="box">Box / Kotak</option>
                </select>
              </div>
              <Input 
                type="number"
                min="0"
                label={t('recipes.failedQuantity')}
                placeholder="0"
                value={form.failedQuantity}
                onChange={(e) => updateField('failedQuantity', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">{t('recipes.ingredients')}</h2>
            <Button variant="secondary" size="sm" onClick={addIngredient}>
              <Plus className="w-4 h-4 mr-1" /> Tambah Bahan
            </Button>
          </div>

          {errors.ingredients && (
            <div className="text-status-loss text-sm mb-4 bg-status-loss/10 p-3 rounded-xl border border-status-loss/20">
              {t('errors.ingredientRequired')}
            </div>
          )}

          {form.ingredients.length === 0 ? (
            <div className="text-center py-8 text-text-secondary border border-dashed border-border rounded-xl bg-surface-muted/30">
              Belum ada bahan yang ditambahkan.
            </div>
          ) : (
            <div className="space-y-3">
              {form.ingredients.map((ing, index) => (
                <div key={ing.id} className="flex flex-col md:flex-row gap-3 p-3 border border-border rounded-xl bg-background items-start md:items-center">
                  <div className="flex-1 w-full">
                    <select 
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary"
                      value={ing.ingredientId}
                      onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                    >
                      {ingredients.map(i => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Jml"
                      className="w-24 bg-surface border border-border rounded-lg px-3 py-2 text-text-primary"
                      value={ing.usedQuantity}
                      onChange={(e) => updateIngredient(index, 'usedQuantity', e.target.value)}
                    />
                    <select 
                      className="w-28 bg-surface border border-border rounded-lg px-2 py-2 text-text-primary"
                      value={ing.usedUnit}
                      onChange={(e) => updateIngredient(index, 'usedUnit', e.target.value)}
                    >
                      {unitOptions.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeIngredient(index)}
                      aria-label="Hapus Bahan"
                      className="text-text-secondary hover:text-status-loss"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extra Costs */}
        <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">{t('recipes.extraCosts')}</h2>
            <Button variant="secondary" size="sm" onClick={addExtraCost}>
              <Plus className="w-4 h-4 mr-1" /> Tambah Biaya
            </Button>
          </div>

          {form.extraCosts.length === 0 ? (
            <div className="text-center py-6 text-text-secondary border border-dashed border-border rounded-xl bg-surface-muted/30">
              Belum ada biaya tambahan (kemasan, operasional, dll).
            </div>
          ) : (
            <div className="space-y-3">
              {form.extraCosts.map((cost, index) => (
                <div key={cost.id} className="flex flex-col md:flex-row gap-3 p-3 border border-border rounded-xl bg-background items-start md:items-center">
                  <div className="flex-1 w-full">
                    <input 
                      type="text"
                      placeholder="Nama Biaya (cth: Plastik, Gas)"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary"
                      value={cost.name}
                      onChange={(e) => updateExtraCost(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-40">
                      <span className="absolute left-3 top-2.5 text-text-secondary text-sm">Rp</span>
                      <input 
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-text-primary"
                        value={cost.amount}
                        onChange={(e) => updateExtraCost(index, 'amount', e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeExtraCost(index)}
                      aria-label="Hapus Biaya Tambahan"
                      className="text-text-secondary hover:text-status-loss"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button className="w-full py-4 text-lg" onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" />
          {t('common.save')}
        </Button>
      </div>
    </PageContainer>
  );
};
