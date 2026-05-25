import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Calculator, Save, ChefHat } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../hooks/useLanguage';
import { useProducts } from '../hooks/useProducts';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/calculations';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { settings, saveDraft } = useAppData();
  const { getProductById, deleteProduct, updateProduct } = useProducts();
  const { addToast } = useToast();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetSellingPrice, setTargetSellingPrice] = useState('');
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const product = getProductById(id);

  React.useEffect(() => {
    if (product) {
      setTargetSellingPrice(product.targetSellingPrice.toString());
    }
  }, [product]);

  if (!product) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-text-secondary mb-6">Produk ini mungkin sudah dihapus.</p>
          <Button onClick={() => navigate('/products')}>Kembali ke Daftar Produk</Button>
        </div>
      </PageContainer>
    );
  }

  const handleDelete = () => {
    deleteProduct(id);
    addToast({ type: 'success', title: t('products.deleteConfirmTitle') });
    navigate('/products');
  };

  const handleSendToCalculator = () => {
    const costItems = [
      { id: crypto.randomUUID(), name: 'HPP (Dari Resep)', amount: product.hppPerUnitSnapshot, category: 'ingredients' }
    ];
    
    saveDraft({
      productName: product.name,
      costItems,
      outputQuantity: 1,
      failedQuantity: 0,
      sellingUnit: product.sellingUnit,
      sellingPrice: product.targetSellingPrice || 0
    });
    
    addToast({ type: 'success', title: t('toasts.sentToCalculator') });
    navigate('/calculator');
  };

  const handleSavePrice = () => {
    updateProduct(id, { targetSellingPrice: Number(targetSellingPrice) });
    setIsEditingPrice(false);
    addToast({ type: 'success', title: 'Harga Jual berhasil diperbarui' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const hpp = product.hppPerUnitSnapshot || 0;
  const currentPrice = Number(targetSellingPrice) || 0;
  const profit = currentPrice - hpp;
  const margin = currentPrice > 0 ? (profit / currentPrice) * 100 : 0;
  const markup = hpp > 0 ? (profit / hpp) * 100 : 0;

  return (
    <PageContainer maxWidth="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/products')}
            className="p-2 rounded-full hover:bg-surface-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary line-clamp-1">Detail Produk</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="px-3">
            <Trash2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t('common.delete')}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-bold text-text-primary">{product.name}</h2>
              {product.source === 'demo' && (
                <span className="bg-brand-soft text-brand-primary px-2 py-1 rounded-md font-semibold uppercase text-xs">
                  Demo
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-8 bg-surface-muted/50 p-3 rounded-xl max-w-sm border border-border/50">
              <ChefHat className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">Dibuat dari Resep:</span>
              <span className="text-sm font-semibold text-text-primary underline decoration-border underline-offset-4 cursor-pointer hover:text-brand-primary" onClick={() => navigate(`/recipes/${product.recipeId}`)}>
                {product.recipeNameSnapshot}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-muted/30 p-6 rounded-2xl border border-border/50 flex flex-col justify-center">
                <p className="text-sm text-text-secondary font-medium mb-1">HPP per {product.sellingUnit}</p>
                <p className="text-3xl font-bold text-text-primary">
                  {formatCurrency(hpp, language, settings.currency)}
                </p>
                <p className="text-xs text-text-secondary mt-2 border-t border-border/50 pt-2">
                  Harga Pokok Produksi ini didapatkan secara otomatis dari resep.
                </p>
              </div>
              
              <div className="bg-brand-soft/20 p-6 rounded-2xl border border-brand-soft flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-brand-primary font-bold uppercase tracking-wider">Harga Jual Target</p>
                  {!isEditingPrice && (
                    <button 
                      onClick={() => setIsEditingPrice(true)}
                      className="text-xs text-brand-primary underline hover:text-brand-primary/80"
                    >
                      Ubah
                    </button>
                  )}
                </div>
                
                {isEditingPrice ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      type="number"
                      min="0"
                      value={targetSellingPrice}
                      onChange={(e) => setTargetSellingPrice(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSavePrice} size="sm" className="px-3">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-brand-primary mt-1">
                    {formatCurrency(currentPrice, language, settings.currency)}
                  </p>
                )}
                
                <p className="text-xs text-brand-primary/70 mt-auto pt-4 border-t border-brand-soft/50">
                  Kamu dapat mengubah harga jual ini kapan saja untuk melihat estimasi profit.
                </p>
              </div>
            </div>

            {/* Profit Analysis */}
            <h3 className="font-bold text-text-primary mb-4 text-lg">Analisis Profitabilitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-muted/30 p-4 rounded-xl border border-border/50 text-center">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Profit Kotor</p>
                <p className={`text-xl font-bold ${profit > 0 ? 'text-status-win' : 'text-status-loss'}`}>
                  {formatCurrency(profit, language, settings.currency)}
                </p>
              </div>
              <div className="bg-surface-muted/30 p-4 rounded-xl border border-border/50 text-center">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Margin</p>
                <p className={`text-xl font-bold ${profit > 0 ? 'text-status-win' : 'text-status-loss'}`}>
                  {margin.toFixed(1)}%
                </p>
              </div>
              <div className="bg-surface-muted/30 p-4 rounded-xl border border-border/50 text-center">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Markup</p>
                <p className={`text-xl font-bold ${profit > 0 ? 'text-status-win' : 'text-status-loss'}`}>
                  {markup.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full py-4 text-lg" onClick={handleSendToCalculator}>
                <Calculator className="w-5 h-5 mr-2" />
                {t('products.sendToCalculator')}
              </Button>
              <p className="text-center text-xs text-text-secondary mt-3">
                Kirim HPP produk ini ke Hitung Cepat untuk menambahkan biaya Marketplace atau Reseller.
              </p>
            </div>
          </div>
          
          <div className="bg-surface-muted px-6 py-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dibuat: {formatDate(product.createdAt)}</span>
            </div>
            <span>v{product.version}</span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('products.deleteConfirmTitle')}
        message={t('products.deleteConfirmBody')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </PageContainer>
  );
};
