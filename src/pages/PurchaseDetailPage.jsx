import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { usePurchases } from '../hooks/usePurchases';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { PurchaseFormDialog } from '../components/purchases/PurchaseFormDialog';
import { useToast } from '../hooks/useToast';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Truck,
  ArrowRightLeft
} from 'lucide-react';
import { formatPurchaseDate, formatPaymentMethod } from '../lib/suppliers';

export const PurchaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { getPurchaseDetail, deletePurchaseLog, savePurchaseLog } = usePurchases();
  const { addToast } = useToast();

  const [detail, setDetail] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const data = getPurchaseDetail(id);
    if (data) {
      setDetail(data);
    } else {
      navigate('/purchases');
    }
  }, [id, getPurchaseDetail, navigate]);

  if (!detail) {
    return (
      <PageContainer>
        <div className="text-center py-10 font-semibold text-text-secondary">
          {t('purchases.loadingDetail', 'Memuat detail pembelian...')}
        </div>
      </PageContainer>
    );
  }

  const { log, items } = detail;

  const handleDelete = () => {
    if (window.confirm(t('purchases.confirmDeleteLog', 'Apakah Anda yakin ingin menghapus catatan pembelian ini? Stok yang ditambahkan dari log ini akan ditarik kembali.'))) {
      try {
        deletePurchaseLog(log.id);
        addToast({
          title: t('purchases.deletedTitle', 'Pembelian Dihapus'),
          message: t('purchases.deletedMessage', 'Catatan pembelian berhasil dihapus.'),
          type: 'success'
        });
        navigate('/purchases');
      } catch (err) {
        addToast({
          title: 'Error',
          message: err.message,
          type: 'error'
        });
      }
    }
  };

  const handleSaveEdit = (logData, itemsData) => {
    try {
      // Save purchase log (which overwrites because ID is matching)
      savePurchaseLog({ ...logData, id: log.id }, itemsData);
      setEditDialogOpen(false);
      
      // Reload detail
      const updated = getPurchaseDetail(log.id);
      if (updated) {
        setDetail(updated);
      }

      addToast({
        title: t('purchases.updatedTitle', 'Pembelian Diperbarui'),
        message: t('purchases.updatedMessage', 'Catatan pembelian berhasil diperbarui.'),
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.message,
        type: 'error'
      });
    }
  };

  return (
    <PageContainer maxWidth="max-w-4xl" className="purchase-detail-shell pb-10">
      {/* Back Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/purchases')}
            aria-label={t('common.back', 'Kembali')}
            className="-ml-2"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              {log.supplierNameSnapshot || t('purchases.noSupplier', 'Tanpa Supplier')}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              ID Transaksi: {log.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setEditDialogOpen(true)} className="text-xs sm:text-sm font-semibold">
            <Edit3 className="w-4 h-4 mr-1.5" />
            {t('common.edit', 'Edit')}
          </Button>
          <Button variant="danger" onClick={handleDelete} className="text-xs sm:text-sm font-semibold">
            <Trash2 className="w-4 h-4 mr-1.5" />
            {t('common.delete', 'Hapus')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Info Card */}
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm md:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase text-text-secondary tracking-wider pb-2 border-b border-border">
            {t('purchases.infoGeneral', 'Informasi Transaksi')}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-text-soft font-medium">{t('purchases.purchaseDate', 'Tanggal Pembelian')}</p>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-text-primary">
                <Calendar className="w-4 h-4 text-text-soft" />
                {formatPurchaseDate(log.purchaseDate, lang)}
              </div>
            </div>

            <div>
              <p className="text-xs text-text-soft font-medium">{t('purchases.invoiceNumber', 'Nomor Invoice')}</p>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-text-primary">
                <FileText className="w-4 h-4 text-text-soft" />
                {log.invoiceNumber || '-'}
              </div>
            </div>

            <div>
              <p className="text-xs text-text-soft font-medium">{t('purchases.paymentMethod', 'Metode Pembayaran')}</p>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-text-primary uppercase">
                <Clock className="w-4 h-4 text-text-soft" />
                {formatPaymentMethod(log.paymentMethod, lang)}
              </div>
            </div>

            <div>
              <p className="text-xs text-text-soft font-medium">{t('purchases.supplierName', 'Nama Supplier')}</p>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-text-primary">
                <Truck className="w-4 h-4 text-text-soft" />
                {log.supplierNameSnapshot || t('purchases.noSupplier', 'Tanpa Supplier')}
              </div>
            </div>
          </div>

          {log.notes && (
            <div className="pt-3 border-t border-border/60">
              <p className="text-xs text-text-soft font-medium">{t('purchases.notes', 'Catatan')}</p>
              <p className="text-sm text-text-primary mt-1 bg-background p-3 rounded-xl border border-border">
                {log.notes}
              </p>
            </div>
          )}
        </div>

        {/* Total Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">
              {t('purchases.totalAmount', 'Total Pembayaran')}
            </span>
            <span className="text-3xl font-black text-brand-primary block mt-2">
              Rp {log.totalAmount.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
            </span>
          </div>

          <div className="text-[10px] text-zinc-400 border-t border-zinc-800/80 pt-3 mt-4 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            <span>Semua transaksi disimpan secara lokal & aman.</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase text-text-secondary tracking-wider pb-2 border-b border-border">
          {t('purchases.itemDetail', 'Bahan Baku Yang Dibeli')} ({items.length} Item)
        </h3>

        <div className="space-y-3">
          {items.map(item => (
            <div 
              key={item.id}
              className="p-4 bg-background border border-border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-soft/40 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-primary">
                  {item.ingredientNameSnapshot || 'Bahan'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                  <span>
                    Jumlah: <strong className="text-text-primary">{item.quantity} {item.unit}</strong>
                  </span>
                  <span>|</span>
                  <span>
                    Harga Satuan: <strong className="text-text-primary">Rp {item.unitPrice.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 2 })} / {item.unit}</strong>
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto shrink-0 border-t border-border/40 sm:border-t-0 pt-2 sm:pt-0">
                <span className="text-base font-black text-brand-primary">
                  Rp {item.totalPrice.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                </span>
                
                <div className="flex gap-3 text-[10px] font-bold mt-1 text-text-soft">
                  <span className="flex items-center gap-1">
                    {item.addToStock ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-text-soft" />
                    )}
                    Stok
                  </span>
                  <span className="flex items-center gap-1">
                    {item.updateIngredientPrice ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-text-soft" />
                    )}
                    Harga
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form Dialog */}
      <PurchaseFormDialog 
        open={editDialogOpen}
        purchaseLogId={log.id}
        onSave={handleSaveEdit}
        onCancel={() => setEditDialogOpen(false)}
      />
    </PageContainer>
  );
};
