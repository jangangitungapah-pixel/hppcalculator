import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';
import { validatePurchaseLog, validatePurchaseItem } from '../../lib/suppliers/purchaseValidation';
import { getLocalizedUnitOptions } from '../../lib/units';
import { X, Plus, Trash2, Calendar, FileText, Landmark } from 'lucide-react';

export const PurchaseFormDialog = ({
  open,
  purchaseLogId, // If edit mode (optional, mostly create mode is used)
  preselectedIngredientId, // From inventory quick action
  onSave,
  onCancel
}) => {
  const { t, lang } = useLanguage();
  const { suppliers, ingredients, getPurchaseDetail } = useAppData();
  const unitOptions = getLocalizedUnitOptions(lang);

  const [form, setForm] = useState({
    supplierId: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    paymentMethod: 'cash',
    notes: ''
  });

  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Initialize
  useEffect(() => {
    if (open) {
      // Reset form
      setForm({
        supplierId: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        paymentMethod: 'cash',
        notes: ''
      });
      setErrors({});
      setGeneralError('');

      if (purchaseLogId) {
        // Edit mode (optional)
        const detail = getPurchaseDetail(purchaseLogId);
        if (detail) {
          setForm({
            supplierId: detail.log.supplierId || '',
            purchaseDate: detail.log.purchaseDate || new Date().toISOString().split('T')[0],
            invoiceNumber: detail.log.invoiceNumber || '',
            paymentMethod: detail.log.paymentMethod || 'cash',
            notes: detail.log.notes || ''
          });
          setItems(detail.items.map(item => ({
            ...item,
            quantity: item.quantity.toString(),
            totalPrice: item.totalPrice.toString()
          })));
        }
      } else {
        // Create mode
        if (preselectedIngredientId) {
          const ing = ingredients.find(i => i.id === preselectedIngredientId);
          setItems([{
            id: `temp_${Date.now()}`,
            ingredientId: preselectedIngredientId,
            ingredientNameSnapshot: ing ? ing.name : '',
            quantity: '1',
            unit: ing ? ing.purchaseUnit : 'kg',
            totalPrice: ing ? ing.purchasePrice.toString() : '0',
            addToStock: true,
            updateIngredientPrice: true
          }]);
        } else {
          // Start with one empty item
          setItems([{
            id: `temp_${Date.now()}`,
            ingredientId: '',
            ingredientNameSnapshot: '',
            quantity: '1',
            unit: 'kg',
            totalPrice: '',
            addToStock: true,
            updateIngredientPrice: true
          }]);
        }
      }
    }
  }, [open, purchaseLogId, preselectedIngredientId, ingredients, getPurchaseDetail]);

  if (!open) return null;

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `temp_${Date.now()}_${Math.random()}`,
        ingredientId: '',
        ingredientNameSnapshot: '',
        quantity: '1',
        unit: 'kg',
        totalPrice: '',
        addToStock: true,
        updateIngredientPrice: true
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      
      const updated = { ...item, [field]: value };
      
      // Auto pre-fill unit and snap name when ingredient changes
      if (field === 'ingredientId') {
        const ing = ingredients.find(i => i.id === value);
        if (ing) {
          updated.ingredientNameSnapshot = ing.name;
          updated.unit = ing.purchaseUnit || 'kg';
          updated.totalPrice = ing.purchasePrice ? ing.purchasePrice.toString() : '';
        } else {
          updated.ingredientNameSnapshot = '';
        }
      }

      return updated;
    }));

    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');

    // Validate log
    const logValidation = validatePurchaseLog(form);
    if (!logValidation.isValid) {
      setGeneralError(logValidation.errors.join(', '));
      return;
    }

    if (items.length === 0) {
      setGeneralError(t('purchases.minOneItem', 'Minimal masukkan 1 item pembelian.'));
      return;
    }

    // Validate items
    let hasItemErrors = false;
    const itemErrors = {};

    items.forEach((item, idx) => {
      const itemValidation = validatePurchaseItem({
        ...item,
        quantity: Number(item.quantity),
        totalPrice: Number(item.totalPrice)
      });

      if (!itemValidation.isValid) {
        hasItemErrors = true;
        if (!item.ingredientId) itemErrors[`item_${idx}_ingredientId`] = t('purchases.requiredIngredient', 'Bahan wajib dipilih');
        if (Number(item.quantity) <= 0 || isNaN(Number(item.quantity))) itemErrors[`item_${idx}_quantity`] = t('purchases.invalidQuantity', 'Jumlah > 0');
        if (Number(item.totalPrice) < 0 || isNaN(Number(item.totalPrice))) itemErrors[`item_${idx}_totalPrice`] = t('purchases.invalidPrice', 'Harga >= 0');
        if (!item.unit) itemErrors[`item_${idx}_unit`] = t('purchases.requiredUnit', 'Satuan wajib');
      }
    });

    if (hasItemErrors) {
      setErrors(itemErrors);
      setGeneralError(t('purchases.pleaseFixRowErrors', 'Harap perbaiki kesalahan pada baris item.'));
      return;
    }

    // Fetch snapshot of supplier name
    const selectedSupplier = suppliers.find(s => s.id === form.supplierId);
    const supplierNameSnapshot = selectedSupplier ? selectedSupplier.name : (form.supplierId ? 'Supplier Terhapus' : 'Tanpa Supplier');

    const purchaseLogPayload = {
      ...form,
      supplierNameSnapshot,
      supplierId: form.supplierId || undefined
    };

    const purchaseItemsPayload = items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      totalPrice: Number(item.totalPrice)
    }));

    onSave(purchaseLogPayload, purchaseItemsPayload);
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);

  const supplierOptions = [
    { value: '', label: t('purchases.noSupplier', '-- Tanpa Supplier --') },
    ...suppliers.map(s => ({ value: s.id, label: s.name }))
  ];

  const paymentMethodOptions = [
    { value: 'cash', label: t('purchases.payCash', 'Tunai / Cash') },
    { value: 'transfer', label: t('purchases.payTransfer', 'Transfer Bank') },
    { value: 'qris', label: t('purchases.payQris', 'QRIS') },
    { value: 'ewallet', label: t('purchases.payEwallet', 'E-Wallet') },
    { value: 'debit', label: t('purchases.payDebit', 'Kartu Debit') },
    { value: 'credit', label: t('purchases.payCredit', 'Kartu Kredit') },
    { value: 'other', label: t('purchases.payOther', 'Lainnya') }
  ];

  return (
    <div className="dialog-overlay z-50">
      <div 
        className="dialog-card max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col purchase-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-dialog-title"
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border shrink-0">
          <h2 id="purchase-dialog-title" className="text-xl font-bold text-text-primary">
            {purchaseLogId ? t('purchases.editPurchase', 'Edit Catatan Pembelian') : t('purchases.addPurchase', 'Catat Pembelian Bahan')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel} className="-mr-2">
            <X className="w-5 h-5 text-text-secondary" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-5 pr-1">
          {generalError && (
            <div className="p-3 bg-danger-soft border border-danger/20 text-danger rounded-xl text-sm font-medium">
              {generalError}
            </div>
          )}

          {/* Form Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background/50 p-4 border border-border rounded-2xl">
            <div className="md:col-span-2">
              <Select 
                label={t('purchases.supplier', 'Pilih Supplier')}
                value={form.supplierId}
                onChange={(e) => handleFormChange('supplierId', e.target.value)}
                options={supplierOptions}
              />
            </div>
            <div>
              <Input 
                type="date"
                label={t('purchases.purchaseDate', 'Tanggal')}
                value={form.purchaseDate}
                onChange={(e) => handleFormChange('purchaseDate', e.target.value)}
                prefix={<Calendar className="w-4 h-4 text-text-soft" />}
              />
            </div>
            <div>
              <Input 
                label={t('purchases.invoiceNumber', 'Nomor Invoice')}
                placeholder="Cth: INV-12345"
                value={form.invoiceNumber}
                onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                prefix={<FileText className="w-4 h-4 text-text-soft" />}
              />
            </div>
            <div className="md:col-span-2">
              <Select 
                label={t('purchases.paymentMethod', 'Metode Pembayaran')}
                value={form.paymentMethod}
                onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                options={paymentMethodOptions}
              />
            </div>
            <div className="md:col-span-2">
              <Input 
                label={t('purchases.notes', 'Catatan Tambahan')}
                placeholder="Cth: Barang dikirim bertahap, diskon, dll"
                value={form.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-text-primary">
                {t('purchases.itemDetail', 'Detail Bahan yang Dibeli')}
              </h3>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleAddItem}
                className="text-brand-primary hover:text-brand-primary/80 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('purchases.addItem', 'Tambah Bahan')}
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const selectedIngredient = ingredients.find(ing => ing.id === item.ingredientId);
                const quantityNum = Number(item.quantity) || 0;
                const totalPriceNum = Number(item.totalPrice) || 0;
                const unitPrice = quantityNum > 0 ? totalPriceNum / quantityNum : 0;

                return (
                  <div 
                    key={item.id} 
                    className="purchase-item-row bg-surface border border-border p-4 rounded-2xl relative shadow-sm hover:border-brand-soft transition-all duration-200"
                  >
                    <div className="absolute right-3 top-3">
                      {items.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveItem(idx)}
                          className="text-danger hover:bg-danger-soft/10 w-8 h-8 rounded-full"
                          aria-label={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1.5 md:pt-0">
                      {/* Ingredient Selection */}
                      <div className="md:col-span-4">
                        <Select 
                          label={t('purchases.ingredient', 'Bahan')}
                          value={item.ingredientId}
                          onChange={(e) => handleItemChange(idx, 'ingredientId', e.target.value)}
                          options={[
                            { value: '', label: t('purchases.selectIngredient', '-- Pilih Bahan --') },
                            ...ingredients.map(ing => ({ value: ing.id, label: ing.name }))
                          ]}
                          error={errors[`item_${idx}_ingredientId`]}
                        />
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2">
                        <Input 
                          type="number"
                          step="any"
                          min="0.001"
                          label={t('purchases.qty', 'Jumlah')}
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          error={errors[`item_${idx}_quantity`]}
                        />
                      </div>

                      {/* Unit */}
                      <div className="md:col-span-2">
                        <Select 
                          label={t('purchases.unit', 'Satuan')}
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          options={unitOptions}
                          error={errors[`item_${idx}_unit`]}
                        />
                      </div>

                      {/* Total Price */}
                      <div className="md:col-span-4 pr-0 md:pr-10">
                        <Input 
                          type="number"
                          min="0"
                          label={t('purchases.totalPrice', 'Total Harga')}
                          prefix="Rp"
                          placeholder="0"
                          value={item.totalPrice}
                          onChange={(e) => handleItemChange(idx, 'totalPrice', e.target.value)}
                          error={errors[`item_${idx}_totalPrice`]}
                        />
                      </div>
                    </div>

                    {/* Calculated Unit Price & Options */}
                    <div className="mt-3.5 pt-3.5 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="text-xs text-text-secondary font-medium">
                        {t('purchases.unitPrice', 'Harga per satuan:')} <span className="font-bold text-text-primary bg-background px-2 py-1 rounded-md">Rp {unitPrice.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 2 })} / {item.unit || '-'}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-text-primary select-none cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={item.addToStock}
                            onChange={(e) => handleItemChange(idx, 'addToStock', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-brand-primary focus:ring-brand-primary"
                          />
                          {t('purchases.addToStock', 'Tambah ke Stok')}
                        </label>

                        <label className="flex items-center gap-1.5 text-xs font-semibold text-text-primary select-none cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={item.updateIngredientPrice}
                            onChange={(e) => handleItemChange(idx, 'updateIngredientPrice', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-brand-primary focus:ring-brand-primary"
                          />
                          {t('purchases.updatePrice', 'Update Harga Bahan')}
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Footer / Summary */}
          <div className="sticky bottom-0 bg-surface border border-border p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md shrink-0 purchase-total-summary z-10">
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{t('purchases.grandTotal', 'Total Belanja')}</p>
              <p className="text-2xl font-black text-brand-primary">
                Rp {totalAmount.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onCancel}
                className="flex-1 sm:flex-initial"
              >
                {t('common.cancel', 'Batal')}
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                className="flex-1 sm:flex-initial font-bold sm:px-8"
              >
                {t('purchases.saveRecord', 'Simpan Pembelian')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
