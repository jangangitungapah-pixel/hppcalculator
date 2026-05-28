import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArchiveRestore, Package, Calculator, Trash2 } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useLanguage } from '../hooks/useLanguage';
import { useProducts } from '../hooks/useProducts';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/calculations';
import { useToast } from '../hooks/useToast';

export const ProductsPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();
  const { settings, saveDraft, recipes, loadDemoBusinessLibrary } = useAppData();
  const { addToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDependencyDialog, setShowDependencyDialog] = useState(false);

  const handleLoadDemo = () => {
    if (recipes.length === 0) {
      setShowDependencyDialog(true);
    } else {
      loadDemoBusinessLibrary();
      addToast({ type: 'success', title: 'Data demo produk, resep, dan bahan berhasil dimuat.' });
    }
  };

  const handleConfirmLoadBusinessLibrary = () => {
    loadDemoBusinessLibrary();
    addToast({ type: 'success', title: 'Data demo produk, resep, dan bahan berhasil dimuat.' });
    setShowDependencyDialog(false);
  };

  const handleSendToCalculator = (e, product) => {
    e.stopPropagation();
    
    const calculatorForm = {
      productName: product.name,
      costItems: [
        {
          id: crypto.randomUUID(),
          name: 'HPP (Dari Resep)',
          amount: product.hppPerUnitSnapshot,
          category: 'ingredients'
        }
      ],
      outputQuantity: 1,
      failedQuantity: 0,
      sellingUnit: product.sellingUnit,
      sellingPrice: product.targetSellingPrice || 0
    };
    
    addToast({ type: 'success', title: 'Produk dikirim ke halaman Hitung.' });
    navigate('/calculator', {
      state: {
        useAgainForm: calculatorForm
      }
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      addToast({ type: 'success', title: t('products.deleteConfirmTitle') });
      setDeleteId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">{t('products.title')}</h2>
          <p className="text-text-secondary">{t('products.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {products.length === 0 && (
            <Button variant="secondary" onClick={handleLoadDemo} className="flex-1 md:flex-none">
              <ArchiveRestore className="w-4 h-4 mr-2" />
              Load Demo
            </Button>
          )}
          <Button onClick={() => navigate('/recipes')} className="flex-1 md:flex-none">
            <Package className="w-4 h-4 mr-2" />
            {t('products.createFromRecipe')}
          </Button>
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="mb-6 max-w-md">
            <Input 
              type="text" 
              placeholder="Cari nama produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const hpp = product.hppPerUnitSnapshot || 0;
              const targetPrice = product.targetSellingPrice || 0;
              const profit = targetPrice - hpp;
              const margin = targetPrice > 0 ? (profit / targetPrice) * 100 : 0;
              
              return (
                <Card 
                  key={product.id} 
                  variant="clickable"
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="p-5 relative group"
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); setDeleteId(product.id); }}
                    aria-label="Hapus Produk"
                    className="absolute top-3 right-3 text-text-secondary opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity hover:text-status-loss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex justify-between items-start mb-3 pr-8">
                    <h3 className="font-bold text-lg text-text-primary line-clamp-1" title={product.name}>{product.name}</h3>
                  </div>
                  
                  <p className="text-xs text-text-secondary mb-4 line-clamp-1">
                    Sumber Resep: {product.recipeNameSnapshot}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-surface-muted/50 p-2 rounded-lg">
                      <p className="text-text-secondary text-[10px] uppercase font-bold">HPP /{product.sellingUnit}</p>
                      <p className="font-semibold text-text-primary mt-0.5">{formatCurrency(hpp, lang, settings.currency)}</p>
                    </div>
                    <div className="bg-brand-soft/30 p-2 rounded-lg border border-brand-soft/50">
                      <p className="text-brand-primary text-[10px] uppercase font-bold">Harga Jual Target</p>
                      <p className="font-bold text-brand-primary mt-0.5">{formatCurrency(targetPrice, lang, settings.currency)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-xs font-semibold">
                    <span className="text-text-secondary">Estimasi Profit:</span>
                    <span className={profit > 0 ? 'text-status-good' : 'text-status-loss'}>
                      {formatCurrency(profit, lang, settings.currency)} ({margin.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs py-2"
                    onClick={(e) => handleSendToCalculator(e, product)}
                  >
                    <Calculator className="w-3.5 h-3.5 mr-2" />
                    {t('products.sendToCalculator')}
                  </Button>
                </Card>
              );
            })}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-text-secondary bg-surface rounded-2xl border border-dashed">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Tidak ada produk yang cocok dengan pencarian.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface rounded-2xl border border-dashed border-border mt-8">
          <div className="w-20 h-20 bg-brand-soft rounded-full flex items-center justify-center mb-6 text-brand-primary">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">{t('products.emptyTitle')}</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            {t('products.emptyBody')}
          </p>
          
          {recipes.length === 0 && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm max-w-md text-left mx-auto">
              <span className="font-semibold">{t('products.dependencyWarningTitle')}:</span> {t('products.dependencyWarningBody')}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/recipes')}>
              <Package className="w-4 h-4 mr-2" />
              {t('products.createFromRecipe')}
            </Button>
            <Button variant="secondary" onClick={handleLoadDemo}>
              <ArchiveRestore className="w-4 h-4 mr-2" />
              Load Demo
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('products.deleteConfirmTitle')}
        description={t('products.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
      />

      <ConfirmDialog
        open={showDependencyDialog}
        onCancel={() => setShowDependencyDialog(false)}
        onConfirm={handleConfirmLoadBusinessLibrary}
        title={t('products.dependencyWarningTitle')}
        description={t('products.dependencyWarningBody')}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
      />
    </PageContainer>
  );
};
