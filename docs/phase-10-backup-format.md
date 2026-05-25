# Phase 10 Backup Format

The Modalin backup uses a standardized JSON structure. It is designed to be future-proof and "backend-ready", meaning it could easily be ingested into a future PostgreSQL/NoSQL cloud database if Modalin evolves into a synced SaaS.

## JSON Schema Envelope

```json
{
  "kind": "modalin-local-backup",
  "app": "Modalin",
  "version": 1,
  "exportedAt": "2026-05-25T12:00:00.000Z",
  "exportedBy": "local-browser",
  "schema": {
    "storageVersion": 1,
    "appDataVersion": 1
  },
  "metadata": {
    "totalRecords": 105,
    "modules": {
      "calculations": 10,
      "ingredients": 50,
      "recipes": 20,
      "products": 15,
      "channelProfiles": 5,
      "pricingSimulations": 3,
      "bundleSimulations": 2
    },
    "settingsIncluded": true,
    "draftIncluded": false
  },
  "data": {
    "settings": { ... },
    "calculations": [ ... ],
    "ingredients": [ ... ],
    "recipes": [ ... ],
    "products": [ ... ],
    "channelProfiles": [ ... ],
    "pricingSimulations": [ ... ],
    "bundleSimulations": [ ... ]
  }
}
```

## Metadata Schema
The `modalin:v1:backupMeta` stores information about the local backup usage:
```json
{
  "version": 1,
  "lastBackupAt": "2026-05-25T12:00:00.000Z",
  "lastImportAt": null,
  "backupCount": 1,
  "importCount": 0,
  "updatedAt": "2026-05-25T12:00:00.000Z"
}
```

## Included Modules
- `modalin:v1:settings`
- `modalin:v1:calculations`
- `modalin:v1:ingredients`
- `modalin:v1:recipes`
- `modalin:v1:products`
- `modalin:v1:channelProfiles`
- `modalin:v1:pricingSimulations`
- `modalin:v1:bundleSimulations`

## Excluded Modules
- `modalin:v1:calculatorDraft` (Temporary working memory, excluded to keep backups clean).

## Versioning Notes
- The envelope version is currently `1`.
- If we change the structure in the future, the `backupValidator` will be able to handle backwards compatibility by checking `schema.storageVersion`.

## Backend Migration Notes
- All IDs are currently simple generated IDs or UUIDs depending on the module.
- The `exportedAt` property guarantees we know the snapshot timestamp.
- On backend migration, a script can read `data.ingredients` and perform batch inserts, mapping local IDs to database foreign keys if necessary.
