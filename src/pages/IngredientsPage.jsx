import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArchiveRestore, PackageSearch } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { formatCurrency } from '../lib/calculations';
import { useAppData } from '../hooks/useAppData';
import { demoIngredients } from '../data/demoIngredients';
import { useToast } from '../hooks/useToast';

export const IngredientsPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { ingredients, loadDemoIngredients } = useIngredients();
  const { settings } = useAppData();
  const { addToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleLoadDemo = () => {
    loadDemoIngredients(demoIngredients);
    addToast({ type: 'success', title: t('toasts.demoIngredientsLoaded') });
  };

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ing.category && ing.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">{t('ingredients.title')}</h1>
          <p className="text-text-secondary font-medium">{t('ingredients.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {ingredients.length === 0 && (
            <Button variant="secondary" onClick={handleLoadDemo} className="flex-1 md:flex-none hover:shadow-md hover:scale-[1.02] transition-all">
              <ArchiveRestore className="w-4 h-4 mr-2" />
              {t('ingredients.loadDemoIngredients')}
            </Button>
          )}
          <Button variant="primary" onClick={() => navigate('/ingredients/new')} className="flex-1 md:flex-none shadow-glow-primary hover:scale-[1.02] transition-all">
            {t('ingredients.addIngredient')}
          </Button>
        </div>
      </div>

      {ingredients.length > 0 ? (
        <>
          <div className="mb-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-secondary" />
            </div>
            <Input 
              type="text" 
              placeholder="Cari nama bahan atau kategori..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIngredients.map(ing => (
              <FadeIn key={ing.id}>
                <Card 
                  variant="clickable"
                  onClick={() => navigate(`/ingredients/${ing.id}`)}
                  className="p-5 flex flex-col justify-between border-border/50 group bg-surface hover:border-brand-primary/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-text-primary line-clamp-1 group-hover:text-brand-primary transition-colors tracking-tight" title={ing.name}>{ing.name}</h3>
                    {ing.source === 'demo' && (
                      <span className="text-[10px] uppercase font-bold bg-brand-soft text-brand-primary px-2 py-1 rounded-md shrink-0">Demo</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-text-secondary font-medium">Harga Beli</span>
                    <span className="font-semibold text-text-primary tabular-nums">
                      {formatCurrency(ing.purchasePrice, lang, settings.currency)} <span className="text-text-muted text-xs font-normal">/ {ing.purchaseQuantity} {ing.purchaseUnit}</span>
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-brand-soft/20 group-hover:bg-brand-soft/40 transition-colors p-3 rounded-xl mt-4 border border-brand-primary/10">
                    <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Harga per {ing.baseUnit}</span>
                    <span className="font-extrabold text-brand-primary tabular-nums text-lg">
                      {formatCurrency(ing.costPerBaseUnit, lang, settings.currency)}
                    </span>
                  </div>
                </Card>
              </FadeIn>
            ))}
            
            {filteredIngredients.length === 0 && (
              <div className="col-span-full py-16 text-center text-text-secondary bg-surface rounded-3xl border border-dashed border-border">
                <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                  <Search className="w-8 h-8" />
                </div>
                <p className="font-medium text-text-primary">Tidak ada bahan baku yang cocok.</p>
                <p className="text-sm mt-1">Coba kata kunci pencarian yang lain.</p>
              </div>
            )}
          </StaggerContainer>
        </>
      ) : (
        <FadeIn className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-br from-surface to-brand-soft/20 rounded-3xl border border-dashed border-brand-primary/20 mt-8 shadow-sm">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-primary">
            <PackageSearch className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">{t('ingredients.emptyTitle')}</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8 leading-relaxed font-medium">
            {t('ingredients.emptyBody')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button variant="primary" size="lg" onClick={() => navigate('/ingredients/new')} className="shadow-glow-primary w-full sm:w-auto px-8">
              {t('ingredients.addIngredient')}
            </Button>
            <Button size="lg" variant="secondary" onClick={handleLoadDemo} className="w-full sm:w-auto px-8">
              <ArchiveRestore className="w-5 h-5 mr-2" />
              {t('ingredients.loadDemoIngredients')}
            </Button>
          </div>
        </FadeIn>
      )}
    </PageContainer>
  );
};
