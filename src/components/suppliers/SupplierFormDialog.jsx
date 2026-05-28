import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../hooks/useLanguage';
import { validateSupplier } from '../../lib/suppliers/purchaseValidation';
import { SUPPLIER_TYPES } from '../../lib/suppliers/supplierTypes';
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
    { value: 'market', label: t('suppliers.typeMarket', 'Pasar') },
    { value: 'grocery', label: t('suppliers.typeGrocery', 'Toko Kelontong / Swalayan') },
    { value: 'distributor', label: t('suppliers.typeDistributor', 'Distributor / Agen') },
    { value: 'online', label: t('suppliers.typeOnline', 'Toko Online / E-commerce') },
    { value: 'farmer', label: t('suppliers.typeFarmer', 'Petani / Produsen Langsung') },
    { value: 'other', label: t('suppliers.typeOther', 'Lainnya') }
  ];

  return (
    <div className="dialog-overlay z-50">
      <div 
        className="dialog-card max-w-lg w-full max-h-[90vh] overflow-y-auto supplier-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-dialog-title"
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
          <h2 id="supplier-dialog-title" className="text-xl font-bold text-text-primary">
            {supplier ? t('suppliers.editSupplier', 'Edit Supplier') : t('suppliers.addSupplier', 'Tambah Supplier')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel} className="-mr-2">
            <X className="w-5 h-5 text-text-secondary" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={t('suppliers.name', 'Nama Supplier *')}
            placeholder="Cth: Toko Makmur Abadi"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
          />

          <Select 
            label={t('suppliers.type', 'Kategori / Tipe')}
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
            options={typeOptions}
          />

          <Input 
            label={t('suppliers.contactName', 'Nama Kontak Person')}
            placeholder="Cth: Pak Budi"
            value={form.contactName}
            onChange={(e) => handleChange('contactName', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={t('suppliers.phone', 'Nomor Telepon')}
              placeholder="Cth: 081234567890"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <Input 
              label={t('suppliers.email', 'Email')}
              placeholder="Cth: supplier@domain.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
          </div>

          <Input 
            label={t('suppliers.address', 'Alamat')}
            placeholder="Cth: Jl. Kebon Jeruk No. 12"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />

          <Input 
            label={t('suppliers.notes', 'Catatan')}
            placeholder="Tambahkan catatan khusus supplier"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox"
              id="isFavorite"
              checked={form.isFavorite}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="isFavorite" className="text-sm font-semibold text-text-primary select-none cursor-pointer">
              {t('suppliers.markAsFavorite', 'Tandai sebagai Supplier Favorit')}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border mt-6">
            {supplier && onDelete && (
              <Button 
                type="button"
                variant="danger" 
                className="w-full sm:w-auto order-3 sm:order-1 sm:mr-auto"
                onClick={() => onDelete(supplier.id)}
              >
                {t('common.delete', 'Hapus')}
              </Button>
            )}
            <Button 
              type="button"
              variant="ghost" 
              className="w-full sm:flex-1 order-2 sm:order-2" 
              onClick={onCancel}
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button 
              type="submit"
              variant="primary"
              className="w-full sm:flex-1 order-1 sm:order-3 font-bold"
            >
              {t('common.save', 'Simpan')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
