export const calculateWholesalePrice = (hppPerUnit, ownerTargetMarginPercent, roundingStep = 1000) => {
  const margin = ownerTargetMarginPercent / 100;
  if (margin >= 1) return 0; // Impossible
  
  const rawPrice = hppPerUnit / (1 - margin);
  return roundingStep > 0 ? Math.ceil(rawPrice / roundingStep) * roundingStep : rawPrice;
};

export const calculateResellerSuggestedPrice = (wholesalePrice, resellerTargetMarginPercent, roundingStep = 1000) => {
  const margin = resellerTargetMarginPercent / 100;
  if (margin >= 1) return 0; // Impossible
  
  const rawPrice = wholesalePrice / (1 - margin);
  return roundingStep > 0 ? Math.ceil(rawPrice / roundingStep) * roundingStep : rawPrice;
};

export const calculateResellerProfitBreakdown = (input) => {
  const {
    hppPerUnit = 0,
    ownerTargetMarginPercent = 0,
    resellerTargetMarginPercent = 0,
    moq = 1,
    roundingStep = 1000
  } = input;

  const wholesalePrice = calculateWholesalePrice(hppPerUnit, ownerTargetMarginPercent, roundingStep);
  const resellerSuggestedPrice = calculateResellerSuggestedPrice(wholesalePrice, resellerTargetMarginPercent, roundingStep);

  const ownerProfitPerUnit = wholesalePrice - hppPerUnit;
  const resellerProfitPerUnit = resellerSuggestedPrice - wholesalePrice;
  const ownerTotalProfitAtMOQ = ownerProfitPerUnit * moq;

  const ownerMarginPercent = wholesalePrice > 0 ? (ownerProfitPerUnit / wholesalePrice) * 100 : 0;
  const resellerMarginPercent = resellerSuggestedPrice > 0 ? (resellerProfitPerUnit / resellerSuggestedPrice) * 100 : 0;

  return {
    wholesalePrice,
    resellerSuggestedPrice,
    ownerProfitPerUnit,
    resellerProfitPerUnit,
    ownerTotalProfitAtMOQ,
    ownerMarginPercent,
    resellerMarginPercent
  };
};

export const calculateResellerTierPricing = (input) => {
  const {
    hppPerUnit = 0,
    tiers = [],
    roundingStep = 1000
  } = input;

  return tiers.map(tier => {
    const breakdown = calculateResellerProfitBreakdown({
      hppPerUnit,
      ownerTargetMarginPercent: tier.ownerTargetMarginPercent,
      resellerTargetMarginPercent: tier.resellerTargetMarginPercent,
      moq: tier.minQty,
      roundingStep
    });

    return {
      minQty: tier.minQty,
      ...breakdown
    };
  });
};

export const validateResellerPricingInput = (input) => {
  const errors = {};
  if (!input.hppPerUnit || input.hppPerUnit <= 0) errors.hppPerUnit = 'HPP harus lebih dari 0';
  if (input.ownerTargetMarginPercent >= 100) errors.ownerTargetMarginPercent = 'Margin tidak boleh 100% atau lebih';
  if (input.resellerTargetMarginPercent >= 100) errors.resellerTargetMarginPercent = 'Margin tidak boleh 100% atau lebih';
  return Object.keys(errors).length > 0 ? errors : null;
};
