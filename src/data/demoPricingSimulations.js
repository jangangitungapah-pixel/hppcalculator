import { SimulationTypes } from '../lib/channelPricing/channelTypes';

export const demoPricingSimulations = [
  {
    id: "demo-sim-gofood",
    version: 1,
    name: "Es Kopi Susu - GoFood",
    type: SimulationTypes.MARKETPLACE,
    sourceType: "manual",
    sourceId: null,
    sourceNameSnapshot: "Es Kopi Susu Gula Aren",
    baseHpp: 6500,
    baseSellingPrice: 18000,
    quantity: 1,
    channelProfileId: "preset-gofood",
    channelProfileSnapshot: {
      name: "GoFood (Contoh)",
      commissionPercent: 20,
      paymentFeePercent: 0,
      paymentFeeFixed: 0,
      additionalPackagingCost: 1500,
      sellerPromoPercent: 0,
      sellerPromoFixed: 0
    },
    input: {
      hppPerUnit: 6500,
      sellingPrice: 18000,
      quantity: 1,
      commissionPercent: 20,
      paymentFeePercent: 0,
      paymentFeeFixed: 0,
      additionalPackagingCost: 1500,
      sellerPromoPercent: 0,
      sellerPromoFixed: 0,
      targetMarginPercent: 30
    },
    result: {
      grossRevenue: 18000,
      platformCommission: 3600,
      paymentFee: 0,
      sellerPromo: 0,
      totalFees: 3600,
      netRevenue: 14400,
      totalHpp: 6500,
      totalAdditionalPackaging: 1500,
      totalCost: 8000,
      profit: 6400,
      profitPerUnit: 6400,
      marginPercent: 35.5,
      status: "good"
    },
    source: "demo",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "demo-sim-reseller",
    version: 1,
    name: "Donat Coklat - Reseller",
    type: SimulationTypes.RESELLER,
    sourceType: "manual",
    sourceId: null,
    sourceNameSnapshot: "Donat Coklat Lumer",
    baseHpp: 3000,
    baseSellingPrice: 6000,
    quantity: 10,
    channelProfileId: "preset-reseller",
    channelProfileSnapshot: null,
    input: {
      hppPerUnit: 3000,
      ownerTargetMarginPercent: 30,
      resellerTargetMarginPercent: 25,
      moq: 10,
      tiers: [
        { minQty: 10, ownerTargetMarginPercent: 30, resellerTargetMarginPercent: 25 },
        { minQty: 50, ownerTargetMarginPercent: 25, resellerTargetMarginPercent: 30 },
        { minQty: 100, ownerTargetMarginPercent: 20, resellerTargetMarginPercent: 35 }
      ]
    },
    result: {
      wholesalePrice: 4500,
      resellerSuggestedPrice: 6000,
      ownerProfitPerUnit: 1500,
      resellerProfitPerUnit: 1500,
      ownerTotalProfitAtMOQ: 15000,
      ownerMarginPercent: 33.3,
      resellerMarginPercent: 25,
      tierPricing: [
        {
          minQty: 10,
          wholesalePrice: 4500,
          resellerSuggestedPrice: 6000,
          ownerProfitPerUnit: 1500,
          resellerProfitPerUnit: 1500,
          ownerTotalProfitAtMOQ: 15000,
          ownerMarginPercent: 33.3,
          resellerMarginPercent: 25
        },
        {
          minQty: 50,
          wholesalePrice: 4000,
          resellerSuggestedPrice: 6000,
          ownerProfitPerUnit: 1000,
          resellerProfitPerUnit: 2000,
          ownerTotalProfitAtMOQ: 50000,
          ownerMarginPercent: 25,
          resellerMarginPercent: 33.3
        },
        {
          minQty: 100,
          wholesalePrice: 4000, // Assuming rounding step 1000 applied to 3000/(1-0.2)=3750 => 4000
          resellerSuggestedPrice: 6500, // 4000/(1-0.35)=6153 => 6500
          ownerProfitPerUnit: 1000,
          resellerProfitPerUnit: 2500,
          ownerTotalProfitAtMOQ: 100000,
          ownerMarginPercent: 25,
          resellerMarginPercent: 38.4
        }
      ]
    },
    source: "demo",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];
