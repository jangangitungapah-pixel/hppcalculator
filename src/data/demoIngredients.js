import { calculateIngredientBaseData } from '../lib/recipe';

const rawIngredients = [
  {
    id: 'demo-ing-1',
    name: 'Tepung Terigu Segitiga Biru',
    category: 'ingredient',
    purchasePrice: 13500,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    supplier: 'Toko Sembako Maju',
    notes: 'Tepung serbaguna untuk donat',
    source: 'demo'
  },
  {
    id: 'demo-ing-2',
    name: 'Gula Pasir',
    category: 'ingredient',
    purchasePrice: 17000,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    supplier: 'Toko Sembako Maju',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-3',
    name: 'Telur Ayam',
    category: 'ingredient',
    purchasePrice: 28000,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    supplier: 'Pasar Pagi',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-4',
    name: 'Margarin Blueband',
    category: 'ingredient',
    purchasePrice: 10000,
    purchaseQuantity: 200,
    purchaseUnit: 'gram',
    supplier: 'Minimarket',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-5',
    name: 'Susu UHT Full Cream',
    category: 'ingredient',
    purchasePrice: 19000,
    purchaseQuantity: 1,
    purchaseUnit: 'liter',
    supplier: 'Minimarket',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-6',
    name: 'Kopi Espresso Blend',
    category: 'ingredient',
    purchasePrice: 150000,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    supplier: 'Roastery',
    notes: 'Campuran arabica robusta 70:30',
    source: 'demo'
  },
  {
    id: 'demo-ing-7',
    name: 'Gula Aren Cair',
    category: 'ingredient',
    purchasePrice: 35000,
    purchaseQuantity: 1,
    purchaseUnit: 'liter',
    supplier: 'Toko Bahan Kue',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-8',
    name: 'Cup Plastik 16oz + Tutup',
    category: 'packaging',
    purchasePrice: 25000,
    purchaseQuantity: 50,
    purchaseUnit: 'pcs',
    supplier: 'Toko Kemasan',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-9',
    name: 'Ayam Fillet Dada',
    category: 'ingredient',
    purchasePrice: 45000,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    supplier: 'Pasar Pagi',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-10',
    name: 'Paper Bowl 500ml',
    category: 'packaging',
    purchasePrice: 40000,
    purchaseQuantity: 50,
    purchaseUnit: 'pcs',
    supplier: 'Toko Kemasan',
    notes: '',
    source: 'demo'
  },
  {
    id: 'demo-ing-11',
    name: 'Saus Mentai Homemade',
    category: 'ingredient',
    purchasePrice: 65000,
    purchaseQuantity: 500,
    purchaseUnit: 'gram',
    supplier: 'Bikin Sendiri',
    notes: 'Campuran mayo, tobiko, saus sambal',
    source: 'demo'
  },
  {
    id: 'demo-ing-12',
    name: 'Beras Premium',
    category: 'ingredient',
    purchasePrice: 75000,
    purchaseQuantity: 5,
    purchaseUnit: 'kg',
    supplier: 'Agen Beras',
    notes: '',
    source: 'demo'
  }
];

export const demoIngredients = rawIngredients.map((ing) => {
  return {
    ...calculateIngredientBaseData(ing),
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});
