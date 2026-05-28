import { formatCurrency } from '../calculations';

export const formatSupplierType = (type, lang = 'id') => {
  const dictionary = {
    id: {
      market: 'Pasar',
      grocery: 'Toko Kelontong / Swalayan',
      distributor: 'Distributor / Agen',
      online: 'Toko Online / E-commerce',
      farmer: 'Petani / Produsen Langsung',
      other: 'Lainnya'
    },
    en: {
      market: 'Market',
      grocery: 'Grocery Store / Supermarket',
      distributor: 'Distributor / Agency',
      online: 'Online Store / E-commerce',
      farmer: 'Farmer / Direct Producer',
      other: 'Other'
    }
  };

  const l = lang === 'en' ? 'en' : 'id';
  return dictionary[l][type] || type || dictionary[l].other;
};

export const formatPaymentMethod = (method, lang = 'id') => {
  const dictionary = {
    id: {
      cash: 'Tunai',
      transfer: 'Transfer Bank',
      qris: 'QRIS',
      ewallet: 'E-Wallet',
      debit: 'Debit',
      credit: 'Kredit',
      other: 'Lainnya'
    },
    en: {
      cash: 'Cash',
      transfer: 'Bank Transfer',
      qris: 'QRIS',
      ewallet: 'E-Wallet',
      debit: 'Debit Card',
      credit: 'Credit Card',
      other: 'Other'
    }
  };

  const l = lang === 'en' ? 'en' : 'id';
  return dictionary[l][method] || method || dictionary[l].cash;
};

export const formatPurchaseDate = (dateString, lang = 'id') => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'id-ID', {
      dateStyle: 'medium'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatPurchaseAmount = (amount, lang = 'id', currency = 'IDR') => {
  return formatCurrency(amount, lang, currency);
};
