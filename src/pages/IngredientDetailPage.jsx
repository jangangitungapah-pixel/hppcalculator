import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Store, Info } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { IngredientCategoryPill } from '../components/ingredients/IngredientCategoryPill';
import { 
  formatIngredientPurchasePrice, 
  formatIngredientUsagePrice,
  formatIngredientUnitInfo 
} from '../lib/ingredients/ingredientFormatters';

export const IngredientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings } = useAppData();
  const { getIngredientById, deleteIngredient } = useIngredients();
  const { addToast } = useToast();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const ingredient = getIngredientById(id);

  if (!ingredient) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Bahan Tidak Ditemukan</h2>
          <p className="text-text-secondary mb-6">Bahan ini mungkin sudah dihapus.</p>
          <Button onClick={() => navigate('/ingredients')}>Kembali ke Daftar Bahan</Button>
        </div>
      </PageContainer>
    );
  }

  const handleDelete = () => {
    deleteIngredient(id);
    addToast({ type: 'success', title: t('ingredients.deletedToastTitle') });
    navigate('/ingredients');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <PageContainer maxWidth="max-w-2xl" className="py-4 sm:py-5">
      {/* Top Header & Actions */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/ingredients')}
            aria-label="Kembali ke Daftar Bahan"
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-cream border border-border-soft hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight line-clamp-1">Detail Bahan</h2>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/ingredients/${id}/edit`)} 
            className="h-10 px-4 border border-border/80 bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <Edit2 className="w-4 h-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">{t('ingredients.editIngredient')}</span>
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

      {/* Main Details Card */}
      <div className="bg-surface border border-border/80 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          {/* Header Info */}
          <div className="flex justify-between items-start gap-3 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-2 tracking-tight leading-tight">{ingredient.name}</h2>
              <div className="flex items-center gap-2.5 flex-wrap text-sm text-text-secondary">
                <IngredientCategoryPill category={ingredient.category} />
                {ingredient.source === 'demo' && (
                  <span className="bg-blue-500/10 text-blue-700 border border-blue-500/10 px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] tracking-wider">
                    Demo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cost Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-sky-500/5 p-4.5 rounded-2xl border border-sky-500/10 text-sky-900">
              <p className="text-[10px] text-sky-700 font-extrabold uppercase tracking-wider mb-1">Harga Beli</p>
              <p className="text-xl sm:text-2xl font-black tabular-nums">
                {formatIngredientPurchasePrice(ingredient, lang, settings.currency)}
              </p>
              <p className="text-[11px] text-sky-700/80 mt-2 border-t border-sky-500/10 pt-2 font-semibold">
                Pembelian dasar dari supplier/pasar.
              </p>
            </div>
            
            <div className="bg-orange-500/5 p-4.5 rounded-2xl border border-orange-500/10 text-orange-900">
              <p className="text-[10px] text-brand-primary font-extrabold uppercase tracking-wider mb-1">Harga Satuan Pakai</p>
              <p className="text-xl sm:text-2xl font-black tabular-nums">
                {formatIngredientUsagePrice(ingredient, lang, settings.currency)}
              </p>
              {ingredient.purchaseUnit !== ingredient.baseUnit ? (
                <p className="text-[11px] text-brand-primary/80 mt-2 border-t border-orange-500/10 pt-2 font-semibold">
                  Konversi: {formatIngredientUnitInfo(ingredient)}
                </p>
              ) : (
                <p className="text-[11px] text-brand-primary/80 mt-2 border-t border-orange-500/10 pt-2 font-semibold">
                  Satuan beli sama dengan satuan pakai.
                </p>
              )}
            </div>
          </div>

          {/* Supplier & Notes Details */}
          <div className="space-y-3.5">
            {ingredient.supplier && (
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-cream border border-border-soft">
                <Store className="w-5 h-5 text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Supplier / Toko</p>
                  <p className="text-sm font-bold text-text-primary">{ingredient.supplier}</p>
                </div>
              </div>
            )}
            
            {ingredient.notes && (
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-cream border border-border-soft">
                <Info className="w-5 h-5 text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Catatan</p>
                  <p className="text-sm font-semibold text-text-secondary leading-relaxed">{ingredient.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Metadata */}
        <div className="bg-surface-cream px-6 py-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-text-soft" />
            <span>Dibuat: {formatDate(ingredient.createdAt)}</span>
          </div>
          <span className="px-2.5 py-0.5 bg-surface rounded-md border border-border-soft">v{ingredient.version}</span>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('ingredients.deleteConfirmTitle')}
        description={t('ingredients.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
      />
    </PageContainer>
  );
};

