import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { demoIngredients } from '../data/demoIngredients';

// Import new subcomponents
import { IngredientsHero } from '../components/ingredients/IngredientsHero';
import { IngredientStatsGrid } from '../components/ingredients/IngredientStatsGrid';
import { IngredientsToolbar } from '../components/ingredients/IngredientsToolbar';
import { IngredientCard } from '../components/ingredients/IngredientCard';
import { IngredientListView } from '../components/ingredients/IngredientListView';
import { IngredientEmptyState } from '../components/ingredients/IngredientEmptyState';
import { IngredientDemoBanner } from '../components/ingredients/IngredientDemoBanner';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';

export const IngredientsPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { ingredients, loadDemoIngredients, deleteIngredient } = useIngredients();
  const { settings } = useAppData();
  const { getSnapshotByIngredientId } = useInventory();
  const { addToast } = useToast();

  // Local toolbar states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Deletion modal state
  const [deleteId, setDeleteId] = useState(null);

  const handleLoadDemo = () => {
    loadDemoIngredients(demoIngredients);
    addToast({ type: 'success', title: 'Data demo bahan berhasil dimuat.' });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteIngredient(deleteId);
      addToast({ type: 'success', title: 'Bahan berhasil dihapus' });
      setDeleteId(null);
    }
  };

  // Get unique categories dynamically
  const uniqueCategories = Array.from(
    new Set(ingredients.map((ing) => ing.category).filter(Boolean))
  );

  // Filter logic
  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch =
      (ing.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ing.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ing.purchaseUnit || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ing.baseUnit || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || ing.category === selectedCategory;

    const matchesSource =
      selectedSource === 'all' ||
      (selectedSource === 'demo' && ing.source === 'demo') ||
      (selectedSource === 'user' && ing.source !== 'demo');

    return matchesSearch && matchesCategory && matchesSource;
  });

  // Sorting logic
  const sortedIngredients = [...filteredIngredients].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (sortBy === 'name_asc') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'name_desc') {
      return (b.name || '').localeCompare(a.name || '');
    }
    if (sortBy === 'price_desc') {
      return (b.costPerBaseUnit || 0) - (a.costPerBaseUnit || 0);
    }
    if (sortBy === 'price_asc') {
      return (a.costPerBaseUnit || 0) - (b.costPerBaseUnit || 0);
    }
    return 0;
  });

  const hasIngredients = ingredients.length > 0;
  const hasDemo = ingredients.some((ing) => ing.source === 'demo');

  return (
    <PageContainer>
      <div className="ingredients-shell">
        {/* Ingredients Header/Hero */}
        <IngredientsHero 
          hasIngredients={hasIngredients}
          onAddClick={() => navigate('/ingredients/new')}
          onLoadDemoClick={handleLoadDemo}
        />

        {hasIngredients ? (
          <>
            {/* Stats Grid */}
            <IngredientStatsGrid 
              ingredients={ingredients} 
              settings={settings} 
              lang={lang} 
            />

            {/* Show small banner if user has data but no demo data yet */}
            {!hasDemo && (
              <IngredientDemoBanner onLoadDemoClick={handleLoadDemo} />
            )}

            {/* Filter / Search Toolbar */}
            <IngredientsToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              uniqueCategories={uniqueCategories}
            />

            {/* Render List or Grid */}
            {sortedIngredients.length > 0 ? (
              viewMode === 'grid' ? (
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sortedIngredients.map((ing) => (
                    <FadeIn key={ing.id}>
                      <IngredientCard
                        ingredient={ing}
                        onClick={() => navigate(`/ingredients/${ing.id}`)}
                        onEdit={() => navigate(`/ingredients/${ing.id}/edit`)}
                        onDelete={() => setDeleteId(ing.id)}
                        inventorySnapshot={getSnapshotByIngredientId(ing.id)}
                        lang={lang}
                        currency={settings.currency}
                      />
                    </FadeIn>
                  ))}
                </StaggerContainer>
              ) : (
                <IngredientListView
                  ingredients={sortedIngredients}
                  onItemClick={(id) => navigate(`/ingredients/${id}`)}
                  onEdit={(id) => navigate(`/ingredients/${id}/edit`)}
                  onDelete={(id) => setDeleteId(id)}
                  lang={lang}
                  currency={settings.currency}
                />
              )
            ) : (
              <div className="py-12 text-center text-text-secondary bg-surface rounded-2xl border border-dashed border-border shadow-sm">
                <p className="font-bold text-text-primary text-base">Tidak ada bahan baku yang cocok.</p>
                <p className="text-xs text-text-secondary mt-1">Coba kata kunci pencarian atau filter yang lain.</p>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <IngredientEmptyState 
            onAddClick={() => navigate('/ingredients/new')}
            onLoadDemoClick={handleLoadDemo}
          />
        )}
      </div>

      {/* Standard Confirm Delete Modal */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus bahan ini?"
        description="Bahan yang dihapus tidak akan tersedia lagi untuk resep baru. Resep lama mungkin tetap menyimpan snapshot biaya."
        confirmLabel="Hapus Bahan"
        cancelLabel="Batal"
        variant="danger"
      />
    </PageContainer>
  );
};
