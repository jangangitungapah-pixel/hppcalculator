export const mockCalculations = [
  {
    id: "1",
    productName: "Donat Coklat Lumer",
    sellingUnit: "pcs",
    totalProductionCost: 200000,
    hppPerUnit: 4000,
    sellingPrice: 8000,
    profitPerUnit: 4000,
    totalProfit: 200000,
    marginPercent: 50,
    markupPercent: 100,
    statusKey: "good",
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    costItems: [
      { id: "1", name: "Bahan Kue", amount: 120000, category: "Bahan" },
      { id: "2", name: "Topping Coklat", amount: 50000, category: "Bahan" },
      { id: "3", name: "Box Dus", amount: 30000, category: "Kemasan" }
    ],
    outputQuantity: 50,
    failedQuantity: 0
  },
  {
    id: "2",
    productName: "Es Kopi Susu Gula Aren",
    sellingUnit: "cup",
    totalProductionCost: 150000,
    hppPerUnit: 7500,
    sellingPrice: 15000,
    profitPerUnit: 7500,
    totalProfit: 150000,
    marginPercent: 50,
    markupPercent: 100,
    statusKey: "good",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    costItems: [
      { id: "4", name: "Biji Kopi", amount: 80000, category: "Bahan" },
      { id: "5", name: "Susu & Gula", amount: 40000, category: "Bahan" },
      { id: "6", name: "Cup & Sedotan", amount: 30000, category: "Kemasan" }
    ],
    outputQuantity: 20,
    failedQuantity: 0
  },
  {
    id: "3",
    productName: "Rice Bowl Ayam Mentai",
    sellingUnit: "porsi",
    totalProductionCost: 350000,
    hppPerUnit: 17500,
    sellingPrice: 20000,
    profitPerUnit: 2500,
    totalProfit: 50000,
    marginPercent: 12.5,
    markupPercent: 14.3,
    statusKey: "low",
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    costItems: [
      { id: "7", name: "Beras & Ayam", amount: 200000, category: "Bahan" },
      { id: "8", name: "Saus Mentai", amount: 100000, category: "Bahan" },
      { id: "9", name: "Paper Bowl", amount: 50000, category: "Kemasan" }
    ],
    outputQuantity: 20,
    failedQuantity: 0
  },
  {
    id: "4",
    productName: "Promo Dessert Box (Rugi)",
    sellingUnit: "box",
    totalProductionCost: 400000,
    hppPerUnit: 40000,
    sellingPrice: 35000,
    profitPerUnit: -5000,
    totalProfit: -50000,
    marginPercent: -14.3,
    markupPercent: -12.5,
    statusKey: "loss",
    date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    costItems: [
      { id: "10", name: "Bahan Dessert", amount: 300000, category: "Bahan" },
      { id: "11", name: "Kotak Akrilik", amount: 100000, category: "Kemasan" }
    ],
    outputQuantity: 10,
    failedQuantity: 0
  }
];
