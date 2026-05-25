import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArchiveRestore, BookOpen } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../hooks/useLanguage';
import { useRecipes } from '../hooks/useRecipes';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/calculations';
import { demoRecipes } from '../data/demoRecipes';
import { demoIngredients } from '../data/demoIngredients';
import { useToast } from '../hooks/useToast';

export const RecipesPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { recipes, loadDemoRecipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { settings } = useAppData();
  const { addToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleLoadDemo = () => {
    loadDemoRecipes(demoRecipes, demoIngredients);
    addToast({ type: 'success', title: t('toasts.demoRecipesLoaded') });
  };

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">{t('recipes.title')}</h1>
          <p className="text-text-secondary">{t('recipes.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {recipes.length === 0 && (
            <Button variant="secondary" onClick={handleLoadDemo} className="flex-1 md:flex-none">
              <ArchiveRestore className="w-4 h-4 mr-2" />
              {t('recipes.loadDemoRecipes')}
            </Button>
          )}
          <Button onClick={() => navigate('/recipes/new')} className="flex-1 md:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            {t('recipes.createRecipe')}
          </Button>
        </div>
      </div>

      {recipes.length > 0 ? (
        <>
          <div className="mb-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-secondary" />
            </div>
            <Input 
              type="text" 
              placeholder="Cari nama resep atau kategori..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map(recipe => (
              <div 
                key={recipe.id} 
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="bg-surface border border-border p-5 rounded-2xl cursor-pointer hover:shadow-floating hover:border-brand-soft transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-text-primary line-clamp-1" title={recipe.name}>{recipe.name}</h3>
                  {recipe.source === 'demo' && (
                    <span className="text-[10px] uppercase font-bold bg-brand-soft text-brand-primary px-2 py-1 rounded-md shrink-0">Demo</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-text-secondary">Hasil Produksi</span>
                  <span className="font-medium text-text-primary">
                    {recipe.outputQuantity} {recipe.outputUnit}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-text-secondary">Total Modal</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(recipe.resultSnapshot?.totalRecipeCost || 0, language, settings.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-brand-soft/30 p-2 rounded-lg mt-3">
                  <span className="text-xs text-text-secondary font-medium">HPP per {recipe.outputUnit}</span>
                  <span className="font-bold text-brand-primary">
                    {formatCurrency(recipe.resultSnapshot?.hppPerUnit || 0, language, settings.currency)}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredRecipes.length === 0 && (
              <div className="col-span-full py-12 text-center text-text-secondary bg-surface rounded-2xl border border-dashed">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Tidak ada resep yang cocok dengan pencarian.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface rounded-3xl border border-dashed border-border mt-8">
          <div className="w-20 h-20 bg-brand-soft rounded-full flex items-center justify-center mb-6 text-brand-primary">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">{t('recipes.emptyTitle')}</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            {t('recipes.emptyBody')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => {
              if (ingredients.length === 0) {
                addToast({ type: 'error', title: t('errors.noIngredientsAvailable') });
                navigate('/ingredients');
              } else {
                navigate('/recipes/new');
              }
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('recipes.createRecipe')}
            </Button>
            <Button variant="secondary" onClick={handleLoadDemo}>
              <ArchiveRestore className="w-4 h-4 mr-2" />
              {t('recipes.loadDemoRecipes')}
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
