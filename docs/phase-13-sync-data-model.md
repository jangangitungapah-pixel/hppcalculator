# Firestore Sync Data Model

Data sinkronisasi disimpan secara flat di bawah struktur:
`users/{uid}/syncRecords/{recordType}_{recordId}`

## Schema `syncRecords`
```typescript
{
  recordType: string;       // "calculation", "ingredient", dll.
  recordId: string;         // id dari record lokal, atau "settings"
  payload: object;          // Data utuh object
  localUpdatedAt: string;   // ISO String timestamp
  deletedAt: string | null; // ISO String tombstone
  createdAt: timestamp;     // Firestore serverTimestamp
  updatedAt: timestamp;     // Firestore serverTimestamp
}
```

## Record Types Mapping
- `calculations` -> `calculation`
- `ingredients` -> `ingredient`
- `recipes` -> `recipe`
- `products` -> `product`
- `channelProfiles` -> `channelProfile`
- `pricingSimulations` -> `pricingSimulation`
- `bundleSimulations` -> `bundleSimulation`
- `settings` -> `settings`

## Konflik Handling (Freshness Comparison)
- Jika ada `deletedAt`, record tersebut diutamakan.
- Timestamp pembanding utama adalah `localUpdatedAt`. Data dari sumber dengan timestamp terbarulah yang menang dan akan disinkronisasikan (atau disimpan secara lokal).
