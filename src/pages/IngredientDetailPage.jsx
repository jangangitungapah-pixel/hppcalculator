import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Store } from 'lucide-react';
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
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/ingredients')}
            aria-label="Kembali ke Daftar Bahan"
            className="-ml-2"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Button>
          <h1 className="text-2xl font-bold text-text-primary line-clamp-1">Detail Bahan</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/ingredients/${id}/edit`)} className="px-3">
            <Edit2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t('ingredients.editIngredient')}</span>
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="px-3">
            <Trash2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t('common.delete')}</span>
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2 tracking-tight">{ingredient.name}</h2>
              <div className="flex items-center gap-3 flex-wrap text-sm text-text-secondary">
                <IngredientCategoryPill category={ingredient.category} />
                {ingredient.source === 'demo' && (
                  <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] tracking-wider">
                    Demo
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-muted/30 p-5 rounded-2xl border border-border/50">
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">Harga Beli</p>
              <p className="text-xl font-extrabold text-text-primary tabular-nums">
                {formatIngredientPurchasePrice(ingredient, lang, settings.currency)}
              </p>
              <p className="text-xs text-text-secondary mt-2 border-t border-border/30 pt-2 font-medium">
                Pembelian dasar dari supplier/pasar.
              </p>
            </div>
            
            <div className="bg-brand-soft/20 p-5 rounded-2xl border border-brand-soft">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider mb-1">Harga Satuan Pakai</p>
              <p className="text-xl font-extrabold text-brand-primary tabular-nums">
                {formatIngredientUsagePrice(ingredient, lang, settings.currency)}
              </p>
              {ingredient.purchaseUnit !== ingredient.baseUnit ? (
                <p className="text-xs text-brand-primary/80 mt-2 border-t border-brand-soft/50 pt-2 font-medium">
                  Konversi: {formatIngredientUnitInfo(ingredient)}
                </p>
              ) : (
                <p className="text-xs text-brand-primary/80 mt-2 border-t border-brand-soft/50 pt-2 font-medium">
                  Satuan beli sama dengan satuan pakai.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {ingredient.supplier && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted/30">
                <Store className="w-5 h-5 text-text-secondary mt-0.5" />
                <div>
                  <p className="font-semibold text-text-primary">Supplier / Toko</p>
                  <p className="text-text-secondary">{ingredient.supplier}</p>
                </div>
              </div>
            )}
            {ingredient.notes && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted/30">
                <div className="w-5 h-5 text-text-secondary mt-0.5 flex items-center justify-center font-serif italic text-lg">i</div>
                <div>
                  <p className="font-semibold text-text-primary">Catatan</p>
                  <p className="text-text-secondary">{ingredient.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-surface-muted px-6 py-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dibuat: {formatDate(ingredient.createdAt)}</span>
          </div>
          <span>v{ingredient.version}</span>
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
