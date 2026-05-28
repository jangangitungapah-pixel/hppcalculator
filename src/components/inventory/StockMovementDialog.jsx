import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { STOCK_MOVEMENT_TYPES } from '../../lib/inventory';

const today = () => new Date().toISOString().slice(0, 10);

export const StockMovementDialog = ({
  open,
  ingredients = [],
  ingredient,
  initialType = STOCK_MOVEMENT_TYPES.STOCK_IN,
  onClose,
  onSubmit
}) => {
  const [form, setForm] = React.useState({
    ingredientId: ingredient?.id || ingredients[0]?.id || '',
    type: initialType,
    quantity: '',
    unit: ingredient?.baseUnit || ingredient?.purchaseUnit || ingredients[0]?.baseUnit || 'pcs',
    movementDate: today(),
    note: ''
  });

  React.useEffect(() => {
    if (!open) return;
    setForm({
      ingredientId: ingredient?.id || ingredients[0]?.id || '',
      type: initialType,
      quantity: '',
      unit: ingredient?.baseUnit || ingredient?.purchaseUnit || ingredients[0]?.baseUnit || 'pcs',
      movementDate: today(),
      note: ''
    });
  }, [open, ingredient, ingredients, initialType]);

  if (!open) return null;

  const selectedIngredient = ingredient || ingredients.find((item) => item.id === form.ingredientId);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      unit: form.unit || selectedIngredient?.baseUnit || selectedIngredient?.purchaseUnit || 'pcs',
      quantity: Number(form.quantity),
      movementDate: new Date(form.movementDate).toISOString(),
      referenceType: 'manual'
    });
  };

  return (
    <div className="inventory-dialog-backdrop" role="dialog" aria-modal="true">
      <form className="inventory-movement-dialog" onSubmit={submit} aria-labelledby="stock-movement-dialog-title">
        <div className="inventory-dialog-header">
          <div>
            <h2 id="stock-movement-dialog-title">Catat Movement Stok</h2>
            <p>{selectedIngredient?.name || 'Pilih bahan baku'}</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Tutup">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!ingredient && (
          <label className="inventory-field">
            <span>Bahan</span>
            <select value={form.ingredientId} onChange={(event) => update('ingredientId', event.target.value)} required>
              {ingredients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        )}

        <label className="inventory-field">
          <span>Tipe movement</span>
          <select value={form.type} onChange={(event) => update('type', event.target.value)} required>
            <option value="opening_balance">Opening balance</option>
            <option value="stock_in">Stok masuk</option>
            <option value="stock_out">Stok keluar</option>
            <option value="adjustment">Adjustment delta</option>
            <option value="waste">Waste</option>
            <option value="correction">Correction</option>
          </select>
        </label>

        <div className="inventory-form-grid">
          <Input label="Quantity" type="number" step="any" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} required />
          <Input label="Unit" value={form.unit} onChange={(event) => update('unit', event.target.value)} required />
        </div>

        <Input label="Tanggal" type="date" value={form.movementDate} onChange={(event) => update('movementDate', event.target.value)} required />
        <Input label="Catatan" value={form.note} onChange={(event) => update('note', event.target.value)} placeholder="Opsional" />

        <div className="inventory-dialog-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit">Simpan Movement</Button>
        </div>
      </form>
    </div>
  );
};
