import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const InventorySettingDialog = ({ open, ingredient, setting, onClose, onSubmit }) => {
  const [form, setForm] = React.useState({
    stockTrackingEnabled: true,
    stockUnit: ingredient?.baseUnit || ingredient?.purchaseUnit || 'pcs',
    minimumStock: 0,
    notes: ''
  });

  React.useEffect(() => {
    if (!open) return;
    setForm({
      stockTrackingEnabled: setting?.stockTrackingEnabled ?? true,
      stockUnit: setting?.stockUnit || ingredient?.baseUnit || ingredient?.purchaseUnit || 'pcs',
      minimumStock: setting?.minimumStock ?? 0,
      notes: setting?.notes || ''
    });
  }, [open, ingredient, setting]);

  if (!open || !ingredient) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      ingredientId: ingredient.id,
      minimumStock: Number(form.minimumStock)
    });
  };

  return (
    <div className="inventory-dialog-backdrop" role="dialog" aria-modal="true">
      <form className="inventory-setting-dialog" onSubmit={submit} aria-labelledby="inventory-setting-dialog-title">
        <div className="inventory-dialog-header">
          <div>
            <h2 id="inventory-setting-dialog-title">Atur Stok Bahan</h2>
            <p>{ingredient.name}</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Tutup">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <label className="inventory-check-field">
          <input
            type="checkbox"
            checked={form.stockTrackingEnabled}
            onChange={(event) => update('stockTrackingEnabled', event.target.checked)}
          />
          <span>Aktifkan tracking stok</span>
        </label>

        <div className="inventory-form-grid">
          <Input label="Stock unit" value={form.stockUnit} onChange={(event) => update('stockUnit', event.target.value)} required />
          <Input label="Minimum stock" type="number" step="any" value={form.minimumStock} onChange={(event) => update('minimumStock', event.target.value)} required />
        </div>
        <Input label="Catatan" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Opsional" />

        <div className="inventory-dialog-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit">Simpan Pengaturan</Button>
        </div>
      </form>
    </div>
  );
};
