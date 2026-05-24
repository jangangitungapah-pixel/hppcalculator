import { DEFAULT_PROFIT_STATUS_THRESHOLDS } from './constants.js';

export function getDefaultProfitStatusThresholds() {
  return { ...DEFAULT_PROFIT_STATUS_THRESHOLDS };
}

export function getProfitStatus({ profitPerUnit, marginPercent, thresholds = DEFAULT_PROFIT_STATUS_THRESHOLDS }) {
  if (profitPerUnit < 0 || marginPercent < thresholds.loss) {
    return {
      key: 'loss',
      labelId: 'Rugi',
      labelEn: 'Loss',
      messageId: 'Harga jual kamu masih di bawah HPP. Produk ini berpotensi rugi.',
      messageEn: 'Your selling price is below cost. This product may lose money.',
      severity: 'danger'
    };
  }
  
  if (marginPercent >= thresholds.loss && marginPercent < thresholds.low) {
    return {
      key: 'low',
      labelId: 'Rendah',
      labelEn: 'Low',
      messageId: 'Untungnya masih tipis. Hati-hati dengan biaya tambahan atau promo.',
      messageEn: 'Profit is still thin. Be careful with extra costs or discounts.',
      severity: 'warning'
    };
  }
  
  if (marginPercent >= thresholds.low && marginPercent < thresholds.okay) {
    return {
      key: 'okay',
      labelId: 'Cukup',
      labelEn: 'Okay',
      messageId: 'Margin cukup aman, tapi masih bisa dioptimalkan.',
      messageEn: 'The margin is acceptable, but it can still be improved.',
      severity: 'neutral'
    };
  }
  
  if (marginPercent >= thresholds.okay && marginPercent < thresholds.good) {
    return {
      key: 'good',
      labelId: 'Bagus',
      labelEn: 'Good',
      messageId: 'Margin produk ini sudah bagus untuk bisnis F&B kecil.',
      messageEn: 'This product has a good margin for a small F&B business.',
      severity: 'success'
    };
  }
  
  return {
    key: 'excellent',
    labelId: 'Sangat Bagus',
    labelEn: 'Excellent',
    messageId: 'Margin sangat sehat. Pastikan harga tetap masuk akal untuk pelanggan.',
    messageEn: 'The margin is very healthy. Make sure the price still feels reasonable for customers.',
    severity: 'excellent'
  };
}
