import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArchiveRestore, BookOpen, Tag, ChefHat, Folder } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useLanguage } from '../hooks/useLanguage';
import { useRecipes } from '../hooks/useRecipes';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/calculations';
import { useToast } from '../hooks/useToast';

export const RecipesPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { settings, loadDemoBusinessLibrary } = useAppData();
  const { addToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDependencyDialog, setShowDependencyDialog] = useState(false);

  const handleLoadDemo = () => {
    if (ingredients.length === 0) {
      setShowDependencyDialog(true);
    } else {
      loadDemoBusinessLibrary();
      addToast({ type: 'success', title: 'Data demo resep dan bahan berhasil dimuat.' });
    }
  };

  const handleConfirmLoadBusinessLibrary = () => {
    loadDemoBusinessLibrary();
    addToast({ type: 'success', title: 'Data demo resep dan bahan berhasil dimuat.' });
    setShowDependencyDialog(false);
  };

  // Get unique categories for filter pills
  const uniqueCategories = Array.from(
    new Set(recipes.map(r => r.category).filter(Boolean))
  );

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalRecipes = recipes.length;
  const totalCategories = uniqueCategories.length;
  const demoRecipesCount = recipes.filter(r => r.source === 'demo').length;

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary mb-1 tracking-tight">{t('recipes.title')}</h2>
          <p className="text-sm font-semibold text-text-secondary">{t('recipes.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          {recipes.length === 0 && (
            <Button 
              variant="secondary" 
              onClick={handleLoadDemo} 
              className="flex-1 md:flex-none border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl text-xs sm:text-sm font-bold h-11"
              leftIcon={<ArchiveRestore className="w-4 h-4 mr-1.5" />}
            >
              {t('recipes.loadDemoRecipes')}
            </Button>
          )}
          <Button 
            onClick={() => navigate('/recipes/new')} 
            className="flex-1 md:flex-none h-11 text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/10"
            leftIcon={<Plus className="w-4 h-4 mr-1.5" />}
          >
            {t('recipes.createRecipe')}
          </Button>
        </div>
      </div>

      {recipes.length > 0 ? (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface border border-border/80 p-4.5 rounded-2xl shadow-xs">
              <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">Total Resep</p>
              <p className="text-lg sm:text-xl font-black text-text-primary">{totalRecipes}</p>
            </div>
            <div className="bg-surface border border-border/80 p-4.5 rounded-2xl shadow-xs">
              <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">Kategori</p>
              <p className="text-lg sm:text-xl font-black text-text-primary">{totalCategories}</p>
            </div>
            <div className="bg-surface border border-border/80 p-4.5 rounded-2xl shadow-xs">
              <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">Resep Demo</p>
              <p className="text-lg sm:text-xl font-black text-brand-primary">{demoRecipesCount}</p>
            </div>
          </div>

          {/* Search and Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center justify-between">
            <div className="w-full md:max-w-md">
              <Input 
                type="text" 
                placeholder="Cari nama resep atau kategori..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="h-4.5 w-4.5 text-text-secondary" />}
                className="w-full bg-surface-cream border-border/80 rounded-xl"
              />
            </div>
            
            {/* Category horizontal scrolling pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 shrink-0 -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-orange-500/10 text-orange-700 border-orange-500/20'
                    : 'bg-surface border-border-soft text-text-secondary hover:border-border hover:text-text-primary'
                }`}
              >
                Semua Kategori
              </button>
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-orange-500/10 text-orange-700 border-orange-500/20'
                      : 'bg-surface border-border-soft text-text-secondary hover:border-border hover:text-text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredRecipes.map(recipe => {
              const numIngredients = recipe.ingredients?.length || 0;
              const hasExtraCosts = (recipe.extraCosts?.length || 0) > 0;

              return (
                <Card 
                  key={recipe.id} 
                  variant="clickable"
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  className="p-5 flex flex-col justify-between border-border/80 shadow-xs hover:border-brand-primary/30 relative overflow-hidden group"
                >
                  <div>
                    {/* Header: Name and Demo indicator */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-extrabold text-base text-text-primary line-clamp-1 group-hover:text-brand-primary transition-colors" title={recipe.name}>
                        {recipe.name}
                      </h3>
                      {recipe.source === 'demo' && (
                        <span className="text-[9px] uppercase font-black bg-orange-500/10 text-orange-700 border border-orange-500/10 px-2 py-0.5 rounded-md shrink-0 tracking-wider">
                          Demo
                        </span>
                      )}
                    </div>

                    {/* Category Label */}
                    <div className="flex items-center gap-1 text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-4">
                      <Folder className="w-3.5 h-3.5 text-text-soft" />
                      <span>{recipe.category || 'Tanpa Kategori'}</span>
                    </div>
                    
                    {/* Metrics */}
                    <div className="space-y-2 mb-4 border-t border-border-soft pt-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary font-semibold">Hasil Produksi</span>
                        <span className="font-bold text-text-primary">
                          {recipe.outputQuantity} <span className="text-[10px] font-semibold text-text-secondary">{recipe.outputUnit}</span>
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary font-semibold">Bahan & Biaya</span>
                        <span className="font-semibold text-text-primary text-[11px] bg-surface-cream px-2 py-0.5 rounded-md border border-border-soft">
                          {numIngredients} Bahan{hasExtraCosts ? ' + Ekstra' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Footer Widget (HPP info) */}
                  <div className="flex justify-between items-center bg-orange-500/5 p-3 rounded-xl mt-2 border border-orange-500/10 text-xs">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">HPP per {recipe.outputUnit}</span>
                    <span className="font-black text-brand-primary text-sm sm:text-base">
                      {formatCurrency(recipe.resultSnapshot?.hppPerUnit || 0, lang, settings.currency)}
                    </span>
                  </div>
                </Card>
              );
            })}
            
            {filteredRecipes.length === 0 && (
              <div className="col-span-full py-16 text-center text-text-secondary bg-surface rounded-3xl border border-dashed border-border/80 shadow-xs">
                <Search className="w-10 h-10 mx-auto mb-3 text-text-soft opacity-40 animate-pulse" />
                <p className="font-bold text-text-primary text-sm">Tidak ada resep yang cocok.</p>
                <p className="text-xs text-text-secondary mt-1">Coba sesuaikan pencarian atau pilih kategori lain.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-surface border border-dashed border-border/85 rounded-3xl mt-6 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mb-6 text-brand-primary">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-text-primary mb-2 tracking-tight">{t('recipes.emptyTitle')}</h2>
          <p className="text-xs font-semibold text-text-secondary max-w-sm mx-auto mb-6 leading-relaxed">
            {t('recipes.emptyBody')}
          </p>
          
          {ingredients.length === 0 && (
            <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/15 text-amber-800 rounded-2xl text-xs max-w-md text-left mx-auto leading-relaxed">
              <span className="font-extrabold">{t('recipes.dependencyWarningTitle')}:</span> {t('recipes.dependencyWarningBody')}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              onClick={() => {
                if (ingredients.length === 0) {
                  addToast({ type: 'error', title: t('errors.noIngredientsAvailable') });
                  navigate('/ingredients');
                } else {
                  navigate('/recipes/new');
                }
              }}
              className="h-11 px-6 font-bold rounded-xl text-xs sm:text-sm w-full sm:w-auto shadow-md shadow-orange-500/10"
              leftIcon={<Plus className="w-4 h-4 mr-1.5" />}
            >
              {t('recipes.createRecipe')}
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleLoadDemo}
              className="h-11 px-6 font-bold border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl text-xs sm:text-sm w-full sm:w-auto"
              leftIcon={<ArchiveRestore className="w-4 h-4 mr-1.5" />}
            >
              {t('recipes.loadDemoRecipes')}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDependencyDialog}
        onCancel={() => setShowDependencyDialog(false)}
        onConfirm={handleConfirmLoadBusinessLibrary}
        title={t('recipes.dependencyWarningTitle')}
        description={t('recipes.dependencyWarningBody')}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
      />
    </PageContainer>
  );
};

