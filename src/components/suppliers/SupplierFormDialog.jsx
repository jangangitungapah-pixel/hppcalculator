import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../hooks/useLanguage';
import { validateSupplier } from '../../lib/suppliers/purchaseValidation';
import { X } from 'lucide-react';

export const SupplierFormDialog = ({
  open,
  supplier,
  onSave,
  onCancel,
  onDelete
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    type: 'other',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    isFavorite: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (supplier) {
        setForm({
          name: supplier.name || '',
          type: supplier.type || 'other',
          contactName: supplier.contactName || '',
          phone: supplier.phone || '',
          email: supplier.email || '',
          address: supplier.address || '',
          notes: supplier.notes || '',
          isFavorite: Boolean(supplier.isFavorite)
        });
      } else {
        setForm({
          name: '',
          type: 'other',
          contactName: '',
          phone: '',
          email: '',
          address: '',
          notes: '',
          isFavorite: false
        });
      }
      setErrors({});
    }
  }, [open, supplier]);

  // Support for Escape key to close the dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateSupplier(form);
    if (!validation.isValid) {
      const errObj = {};
      if (validation.errors.includes('Nama supplier wajib diisi')) {
        errObj.name = 'Nama supplier wajib diisi';
      }
      if (validation.errors.includes('Format email tidak valid')) {
        errObj.email = 'Format email tidak valid';
      }
      setErrors(errObj);
      return;
    }

    onSave({
      ...supplier, // Keep id, createdAt, source, etc.
      ...form
    });
  };

  const typeOptions = [
    { value: 'market', label: t('suppliers.typeMarket') },
    { value: 'grocery', label: t('suppliers.typeGrocery') },
    { value: 'distributor', label: t('suppliers.typeDistributor') },
    { value: 'online', label: t('suppliers.typeOnline') },
    { value: 'farmer', label: t('suppliers.typeFarmer') },
    { value: 'other', label: t('suppliers.typeOther') }
  ];

  return createPortal(
    <div 
      className="dialog-overlay z-50" 
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      aria-hidden="false"
    >
      <div 
        className="dialog-card max-w-md w-full max-h-[85vh] overflow-y-auto flex flex-col p-6 rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-dialog-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
          <h2 id="supplier-dialog-title" className="text-lg font-black text-text-primary">
            {supplier ? t('suppliers.editSupplier') : t('suppliers.addSupplier')}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel} 
            className="-mr-2 rounded-full hover:bg-background-soft"
            aria-label={t('common.close', 'Tutup')}
          >
            <X className="w-5 h-5 text-text-secondary" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 flex-1">
          <Input 
            label={t('suppliers.name')}
            placeholder="Cth: Toko Makmur Abadi"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            className="font-semibold text-sm"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select 
              label={t('suppliers.type')}
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={typeOptions}
              className="text-sm"
            />

            <Input 
              label={t('suppliers.contactName')}
              placeholder="Cth: Pak Budi"
              value={form.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input 
              label={t('suppliers.phone')}
              placeholder="Cth: 081234567890"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="text-sm"
            />
            
            <Input 
              label={t('suppliers.email')}
              placeholder="Cth: supplier@domain.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              className="text-sm"
            />
          </div>

          <Input 
            label={t('suppliers.address')}
            placeholder="Cth: Jl. Kebon Jeruk No. 12"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="text-sm"
          />

          <Input 
            label={t('suppliers.notes')}
            placeholder="Tambahkan catatan khusus supplier"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="text-sm"
          />

          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox"
              id="isFavorite"
              checked={form.isFavorite}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
              className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary cursor-pointer"
            />
            <label htmlFor="isFavorite" className="text-xs font-bold text-text-primary select-none cursor-pointer">
              {t('suppliers.markAsFavorite')}
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 pt-4 border-t border-border mt-5 flex-row justify-end">
            {supplier && onDelete && (
              <Button 
                type="button"
                variant="danger" 
                className="font-bold mr-auto px-4 rounded-xl text-xs sm:text-sm"
                onClick={() => onDelete(supplier.id)}
              >
                {t('common.delete')}
              </Button>
            )}
            <Button 
              type="button"
              variant="ghost" 
              className="px-4 rounded-xl text-xs sm:text-sm" 
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit"
              variant="primary"
              className="px-6 rounded-xl text-xs sm:text-sm font-extrabold shadow-glow-primary hover:shadow-soft-glow"
            >
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
