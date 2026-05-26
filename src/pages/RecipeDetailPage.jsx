import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, PackageOpen, Calculator, Play, ChefHat } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import { useRecipes } from '../hooks/useRecipes';
import { useProducts } from '../hooks/useProducts';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/calculations';
import { createProductFromRecipe, createQuickCalculatorInputFromRecipe, scaleRecipeToTargetOutput } from '../lib/recipe';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings, saveDraft } = useAppData();
  const { getRecipeById, deleteRecipe, updateRecipe } = useRecipes();
  const { saveProduct } = useProducts();
  const { addToast } = useToast();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [targetScaleQty, setTargetScaleQty] = useState('');

  const recipe = getRecipeById(id);

  if (!recipe) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Resep Tidak Ditemukan</h2>
          <p className="text-text-secondary mb-6">Resep ini mungkin sudah dihapus.</p>
          <Button onClick={() => navigate('/recipes')}>Kembali ke Daftar Resep</Button>
        </div>
      </PageContainer>
    );
  }

  const handleDelete = () => {
    deleteRecipe(id);
    addToast({ type: 'success', title: t('recipes.recipeDeleted') });
    navigate('/recipes');
  };

  const handleSendToCalculator = () => {
    const input = createQuickCalculatorInputFromRecipe(
      recipe, 
      recipe.resultSnapshot.suggestedPrices.ideal.price,
      settings
    );
    saveDraft(input);
    addToast({ type: 'success', title: t('toasts.sentToCalculator') });
    navigate('/calculator');
  };

  const handleCreateProduct = () => {
    const idealPrice = recipe.resultSnapshot?.suggestedPrices?.ideal?.price || 0;
    const targetSellingPrice = Math.round(idealPrice / 1000) * 1000;
    
    saveProduct(createProductFromRecipe(recipe, { targetSellingPrice }));
    addToast({ type: 'success', title: t('toasts.productSaved') });
    navigate('/products');
  };

  const handleApplyScale = () => {
    const scaled = scaleRecipeToTargetOutput(recipe, targetScaleQty);
    if (scaled) {
      updateRecipe(recipe.id, scaled);
      addToast({ type: 'success', title: t('toasts.scaleApplied') });
    }
    setShowScaleModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const result = recipe.resultSnapshot || {};

  return (
    <PageContainer maxWidth="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/recipes')}
            className="p-2 rounded-full hover:bg-surface-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary line-clamp-1">Detail Resep</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/recipes/${id}/edit`)} className="px-3">
            <Edit2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t('recipes.editRecipe')}</span>
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="px-3">
            <Trash2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t('common.delete')}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-3xl font-bold text-text-primary">{recipe.name}</h2>
                {recipe.source === 'demo' && (
                  <span className="bg-brand-soft text-brand-primary px-2 py-1 rounded-md font-semibold uppercase text-xs">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-text-secondary mb-6">{recipe.description || 'Tidak ada deskripsi'}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-muted/50 p-4 rounded-2xl border border-border/50">
                  <p className="text-xs text-text-secondary font-medium uppercase mb-1">Target Hasil</p>
                  <p className="text-lg font-bold text-text-primary">{recipe.outputQuantity} <span className="text-sm font-medium">{recipe.outputUnit}</span></p>
                </div>
                <div className="bg-surface-muted/50 p-4 rounded-2xl border border-border/50">
                  <p className="text-xs text-text-secondary font-medium uppercase mb-1">Bisa Dijual</p>
                  <p className="text-lg font-bold text-text-primary">{result.sellableQuantity || 0} <span className="text-sm font-medium">{recipe.outputUnit}</span></p>
                </div>
                <div className="bg-surface-muted/50 p-4 rounded-2xl border border-border/50">
                  <p className="text-xs text-status-loss font-medium uppercase mb-1">Gagal/Reject</p>
                  <p className="text-lg font-bold text-text-primary">{recipe.failedQuantity || 0} <span className="text-sm font-medium">{recipe.outputUnit}</span></p>
                </div>
                <div className="bg-surface-muted/50 p-4 rounded-2xl border border-border/50">
                  <p className="text-xs text-status-loss font-medium uppercase mb-1">Penyusutan</p>
                  <p className="text-lg font-bold text-text-primary">{recipe.wastePercent || 0} <span className="text-sm font-medium">%</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-muted px-6 py-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Dibuat: {formatDate(recipe.createdAt)}</span>
              </div>
              <span>Kategori: {recipe.category || '-'}</span>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">{t('recipes.ingredients')}</h3>
              <span className="text-sm font-bold text-text-primary bg-surface-muted px-3 py-1 rounded-lg">
                {formatCurrency(result.totalIngredientCost || 0, lang, settings.currency)}
              </span>
            </div>
            
            <div className="space-y-3">
              {recipe.ingredients?.map((ing, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-surface-muted/50 transition-colors">
                  <div>
                    <p className="font-semibold text-text-primary">{ing.ingredientNameSnapshot}</p>
                    <p className="text-sm text-text-secondary">{ing.usedQuantity} {ing.usedUnit}</p>
                  </div>
                  <p className="font-medium text-text-primary">
                    {formatCurrency(ing.totalCost, lang, settings.currency)}
                  </p>
                </div>
              ))}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <p className="text-text-secondary text-sm italic">Tidak ada bahan</p>
              )}
            </div>
          </div>

          {(recipe.extraCosts && recipe.extraCosts.length > 0) && (
            <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">{t('recipes.extraCosts')}</h3>
                <span className="text-sm font-bold text-text-primary bg-surface-muted px-3 py-1 rounded-lg">
                  {formatCurrency(result.totalExtraCost || 0, lang, settings.currency)}
                </span>
              </div>
              
              <div className="space-y-3">
                {recipe.extraCosts.map((cost, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-surface-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-text-primary">{cost.name}</p>
                    </div>
                    <p className="font-medium text-text-primary">
                      {formatCurrency(cost.amount, lang, settings.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Results */}
        <div className="space-y-6">
          <div className="bg-surface border border-brand-soft p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-soft/20 rounded-bl-[100px] -z-0"></div>
            
            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-2 relative z-10">Ringkasan Biaya</h3>
            
            <div className="mb-4 relative z-10">
              <p className="text-xs text-text-secondary mb-1">Total Modal (Bahan + Ekstra)</p>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(result.totalRecipeCost || 0, lang, settings.currency)}
              </p>
            </div>
            
            <div className="bg-brand-primary text-white p-4 rounded-2xl relative z-10">
              <p className="text-xs text-white/80 font-medium mb-1">HPP per {recipe.outputUnit}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(result.hppPerUnit || 0, lang, settings.currency)}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-brand-primary" />
              Tindakan Cepat
            </h3>
            
            <div className="space-y-3">
              <Button className="w-full" onClick={handleCreateProduct}>
                <PackageOpen className="w-4 h-4 mr-2" />
                {t('recipes.createProduct')}
              </Button>
              
              <Button variant="secondary" className="w-full" onClick={handleSendToCalculator}>
                <Calculator className="w-4 h-4 mr-2" />
                Kirim ke Hitung Cepat
              </Button>
              
              <Button variant="secondary" className="w-full" onClick={() => setShowScaleModal(true)}>
                <Play className="w-4 h-4 mr-2" />
                Ubah Skala Resep (Batch)
              </Button>
            </div>
          </div>

          {result.suggestedPrices && (
            <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-text-primary mb-4">Rekomendasi Harga Jual</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-status-win/10 border border-status-win/20">
                  <div>
                    <p className="font-semibold text-status-win text-sm">Aman (15%)</p>
                  </div>
                  <p className="font-bold text-text-primary">
                    {formatCurrency(result.suggestedPrices.safe?.price, lang, settings.currency)}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-brand-soft/50 border border-brand-soft">
                  <div>
                    <p className="font-semibold text-brand-primary text-sm">Ideal (30%)</p>
                  </div>
                  <p className="font-bold text-text-primary">
                    {formatCurrency(result.suggestedPrices.ideal?.price, lang, settings.currency)}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
                  <div>
                    <p className="font-semibold text-[#8b5cf6] text-sm">Premium (50%)</p>
                  </div>
                  <p className="font-bold text-text-primary">
                    {formatCurrency(result.suggestedPrices.premium?.price, lang, settings.currency)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('recipes.deleteConfirmTitle')}
        description={t('recipes.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
      />

      {/* Scale Modal */}
      {showScaleModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl w-full max-w-md overflow-hidden shadow-modal animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">Ubah Skala Resep</h3>
              <p className="text-text-secondary text-sm mb-6">
                Masukkan target hasil baru. Semua kuantitas bahan akan disesuaikan secara otomatis.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">Target Hasil Baru ({recipe.outputUnit})</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-brand-primary focus:outline-none text-lg font-bold"
                  value={targetScaleQty}
                  onChange={(e) => setTargetScaleQty(e.target.value)}
                  placeholder={`Saat ini: ${recipe.outputQuantity}`}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowScaleModal(false)}>
                  Batal
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleApplyScale}
                  disabled={!targetScaleQty || Number(targetScaleQty) <= 0 || Number(targetScaleQty) === recipe.outputQuantity}
                >
                  Terapkan Skala
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
