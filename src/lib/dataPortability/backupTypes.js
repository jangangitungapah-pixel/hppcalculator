export const BACKUP_FORMAT_VERSION = 1;
export const BACKUP_APP_NAME = "Modalin";
export const BACKUP_KIND = "modalin-local-backup";

export const BACKUP_MODULES = [
  'calculations',
  'ingredients',
  'recipes',
  'products',
  'channelProfiles',
  'pricingSimulations',
  'bundleSimulations'
];

export const BACKUP_MODULE_STORAGE_KEYS = {
  calculations: 'modalin:v1:calculations',
  ingredients: 'modalin:v1:ingredients',
  recipes: 'modalin:v1:recipes',
  products: 'modalin:v1:products',
  channelProfiles: 'modalin:v1:channelProfiles',
  pricingSimulations: 'modalin:v1:pricingSimulations',
  bundleSimulations: 'modalin:v1:bundleSimulations'
};
