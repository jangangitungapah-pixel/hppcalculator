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
    const formDraft = createQuickCalculatorInputFromRecipe(
      recipe, 
      recipe.resultSnapshot.suggestedPrices.ideal.price,
      settings
    );
    saveDraft(formDraft);
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
    <PageContainer maxWidth="max-w-5xl" className="py-4 sm:py-5">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/recipes')}
            aria-label="Kembali ke Daftar Resep"
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-cream border border-border-soft hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight line-clamp-1">Detail Resep</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/recipes/${id}/edit`)} 
            className="h-10 px-4 border border-border/80 bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <Edit2 className="w-4 h-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">{t('recipes.editRecipe')}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowDeleteConfirm(true)} 
            className="h-10 px-4 bg-red-500/10 hover:bg-red-500/15 text-red-700 border border-red-500/10 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <Trash2 className="w-4 h-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">{t('common.delete')}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-surface border border-border/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight leading-tight">{recipe.name}</h2>
                {recipe.source === 'demo' && (
                  <span className="bg-orange-500/10 text-orange-700 px-3 py-1 rounded-full font-extrabold uppercase text-[10px] tracking-wider border border-orange-500/10">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-text-secondary leading-relaxed max-w-2xl">{recipe.description || 'Tidak ada deskripsi'}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-surface-cream p-4 rounded-2xl border border-border-soft">
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">Target Hasil</p>
                  <p className="text-base sm:text-lg font-black text-text-primary">
                    {recipe.outputQuantity} <span className="text-xs font-semibold text-text-secondary ml-0.5">{recipe.outputUnit}</span>
                  </p>
                </div>
                
                <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-emerald-800">
                  <p className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider mb-1">Bisa Dijual</p>
                  <p className="text-base sm:text-lg font-black">
                    {result.sellableQuantity || 0} <span className="text-xs font-semibold text-emerald-700/80 ml-0.5">{recipe.outputUnit}</span>
                  </p>
                </div>
                
                <div className={`p-4 rounded-2xl border transition-all ${
                  (recipe.failedQuantity || 0) > 0 
                    ? 'bg-red-500/5 border-red-500/10 text-red-800' 
                    : 'bg-surface-cream border-border-soft text-text-primary'
                }`}>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">Gagal/Reject</p>
                  <p className="text-base sm:text-lg font-black">
                    {recipe.failedQuantity || 0} <span className="text-xs font-semibold text-text-secondary/80 ml-0.5">{recipe.outputUnit}</span>
                  </p>
                </div>
                
                <div className={`p-4 rounded-2xl border transition-all ${
                  (recipe.wastePercent || 0) > 0 
                    ? 'bg-amber-500/5 border-amber-500/10 text-amber-800' 
                    : 'bg-surface-cream border-border-soft text-text-primary'
                }`}>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">Penyusutan</p>
                  <p className="text-base sm:text-lg font-black">
                    {recipe.wastePercent || 0}<span className="text-xs font-semibold ml-0.5">%</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-cream px-6 py-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-text-soft" />
                <span>Dibuat: {formatDate(recipe.createdAt)}</span>
              </div>
              <span className="px-2.5 py-0.5 bg-surface rounded-md border border-border-soft">Kategori: {recipe.category || '-'}</span>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/60 mb-4">
              <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">{t('recipes.ingredients')}</h3>
              <span className="text-xs font-black text-emerald-800 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
                {formatCurrency(result.totalIngredientCost || 0, lang, settings.currency)}
              </span>
            </div>
            
            <div className="divide-y divide-border/60">
              {recipe.ingredients?.map((ing, i) => (
                <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 hover:bg-surface-cream rounded-xl px-2 -mx-2 transition-colors group">
                  <div>
                    <p className="font-bold text-sm text-text-primary transition-colors group-hover:text-brand-primary">{ing.ingredientNameSnapshot}</p>
                    <p className="text-xs font-semibold text-text-secondary mt-0.5">{ing.usedQuantity} {ing.usedUnit}</p>
                  </div>
                  <p className="font-extrabold text-sm text-text-primary">
                    {formatCurrency(ing.totalCost, lang, settings.currency)}
                  </p>
                </div>
              ))}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <p className="text-text-secondary text-sm italic py-2">Tidak ada bahan</p>
              )}
            </div>
          </div>

          {/* Extra Costs List */}
          {(recipe.extraCosts && recipe.extraCosts.length > 0) && (
            <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-border/60 mb-4">
                <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">{t('recipes.extraCosts')}</h3>
                <span className="text-xs font-black text-brand-primary bg-brand-soft px-3 py-1 rounded-full border border-brand-primary/10">
                  {formatCurrency(result.totalExtraCost || 0, lang, settings.currency)}
                </span>
              </div>
              
              <div className="divide-y divide-border/60">
                {recipe.extraCosts.map((cost, i) => (
                  <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 hover:bg-surface-cream rounded-xl px-2 -mx-2 transition-colors group">
                    <div>
                      <p className="font-bold text-sm text-text-primary transition-colors group-hover:text-brand-primary">{cost.name}</p>
                    </div>
                    <p className="font-extrabold text-sm text-text-primary">
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
          
          {/* Ringkasan Biaya Hero */}
          <div className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 shadow-md border border-orange-400/10 text-white">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
            
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-2 relative z-10">Ringkasan Biaya</h3>
            
            <div className="mb-4 relative z-10">
              <p className="text-xs text-white/80 font-bold mb-1">Total Modal (Bahan + Ekstra)</p>
              <p className="text-2xl font-black">
                {formatCurrency(result.totalRecipeCost || 0, lang, settings.currency)}
              </p>
            </div>
            
            <div className="bg-white/20 border border-white/25 rounded-2xl p-4.5 text-center shadow-inner relative z-10 backdrop-blur-xs">
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-100 mb-0.5">HPP per {recipe.outputUnit}</p>
              <p className="text-2xl sm:text-3xl font-black">
                {formatCurrency(result.hppPerUnit || 0, lang, settings.currency)}
              </p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs">
            <h3 className="font-extrabold text-sm text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-brand-primary" />
              Tindakan Cepat
            </h3>
            
            <div className="flex flex-col gap-2">
              <Button className="w-full h-11 text-xs font-extrabold rounded-xl shadow-sm shadow-orange-500/10" onClick={handleCreateProduct}>
                <PackageOpen className="w-4.5 h-4.5 mr-2 shrink-0" />
                {t('recipes.createProduct')}
              </Button>
              
              <Button variant="secondary" className="w-full h-11 text-xs font-bold border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl" onClick={handleSendToCalculator}>
                <Calculator className="w-4.5 h-4.5 mr-2 shrink-0" />
                Kirim ke Hitung Cepat
              </Button>
              
              <Button variant="secondary" className="w-full h-11 text-xs font-bold border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl" onClick={() => setShowScaleModal(true)}>
                <Play className="w-4.5 h-4.5 mr-2 shrink-0" />
                Ubah Skala Resep (Batch)
              </Button>
            </div>
          </div>

          {/* Recommended Price Cards */}
          {result.suggestedPrices && (
            <div className="bg-surface border border-border/80 p-5 sm:p-6 rounded-3xl shadow-xs space-y-3">
              <h3 className="font-extrabold text-[10px] text-text-secondary uppercase tracking-wider">Rekomendasi Harga Jual</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center p-3 rounded-xl border border-border-soft bg-surface-cream text-xs font-semibold hover:border-orange-500/20 transition-all duration-200">
                  <span className="text-text-secondary">Aman (15%)</span>
                  <p className="font-bold text-text-primary">
                    {formatCurrency(result.suggestedPrices.safe?.price, lang, settings.currency)}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-800 transition-all duration-200 shadow-xs relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-black uppercase tracking-wider">
                    Rekomendasi
                  </div>
                  <span>Ideal (30%)</span>
                  <p className="font-extrabold text-sm text-emerald-900">
                    {formatCurrency(result.suggestedPrices.ideal?.price, lang, settings.currency)}
                  </p>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs font-bold text-purple-800 transition-all duration-200">
                  <span>Premium (50%)</span>
                  <p className="font-bold text-purple-900">
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
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface border border-border/80 rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-scale-in p-6">
            <div>
              <h3 className="text-lg font-black text-text-primary mb-1">Ubah Skala Resep</h3>
              <p className="text-text-secondary text-xs leading-relaxed font-semibold mb-5">
                Masukkan target hasil baru. Semua kuantitas bahan akan disesuaikan secara otomatis.
              </p>
              
              <div className="mb-5">
                <label className="block text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-2">Target Hasil Baru ({recipe.outputUnit})</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full bg-surface-cream border border-border-soft focus:border-brand-primary rounded-xl px-4 py-3 text-text-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none text-xl font-black text-center transition-all"
                  value={targetScaleQty}
                  onChange={(e) => setTargetScaleQty(e.target.value)}
                  placeholder={`Saat ini: ${recipe.outputQuantity}`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button 
                  variant="ghost" 
                  className="w-full sm:flex-1 order-2 sm:order-1 h-11 text-xs font-bold border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl" 
                  onClick={() => setShowScaleModal(false)}
                >
                  Batal
                </Button>
                <Button 
                  variant="primary"
                  className="w-full sm:flex-1 order-1 sm:order-2 h-11 text-xs font-bold rounded-xl shadow-md shadow-orange-500/10" 
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

