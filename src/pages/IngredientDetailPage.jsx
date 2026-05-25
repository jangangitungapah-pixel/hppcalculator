import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Store, Tag } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { formatCurrency } from '../lib/calculations';
import { formatQuantityWithUnit } from '../lib/units';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const IngredientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
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
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/ingredients')}
            className="p-2 rounded-full hover:bg-surface-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
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
              <h2 className="text-3xl font-bold text-text-primary mb-2">{ingredient.name}</h2>
              <div className="flex items-center gap-3 flex-wrap text-sm text-text-secondary">
                <span className="flex items-center gap-1 bg-surface-muted px-2 py-1 rounded-md">
                  <Tag className="w-4 h-4" />
                  <span className="capitalize">{ingredient.category}</span>
                </span>
                {ingredient.source === 'demo' && (
                  <span className="bg-brand-soft text-brand-primary px-2 py-1 rounded-md font-semibold uppercase text-xs">
                    Demo
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-muted/50 p-4 rounded-2xl border border-border/50">
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Harga Beli</p>
              <p className="text-xl font-bold text-text-primary">
                {formatCurrency(ingredient.purchasePrice, language, settings.currency)}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                untuk {formatQuantityWithUnit(ingredient.purchaseQuantity, ingredient.purchaseUnit, language)}
              </p>
            </div>
            
            <div className="bg-brand-soft/30 p-4 rounded-2xl border border-brand-soft">
              <p className="text-xs text-brand-primary/80 font-medium uppercase tracking-wider mb-1">Cost per Base Unit</p>
              <p className="text-xl font-bold text-brand-primary">
                {formatCurrency(ingredient.costPerBaseUnit, language, settings.currency)}
              </p>
              <p className="text-sm text-brand-primary/70 mt-1">
                per {ingredient.baseUnit}
              </p>
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
