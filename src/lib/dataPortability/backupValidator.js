import { BACKUP_FORMAT_VERSION, BACKUP_KIND, BACKUP_MODULES } from './backupTypes';

export const validateBackupEnvelope = (backup) => {
  if (!backup || typeof backup !== 'object') return false;
  if (backup.kind !== BACKUP_KIND) return false;
  if (!backup.data || typeof backup.data !== 'object') return false;
  return true;
};

export const validateBackupDataShape = (data) => {
  // If we have an array for every module and settings is an object
  for (const module of BACKUP_MODULES) {
    if (data[module] !== undefined && !Array.isArray(data[module])) {
      return false; // Type mismatch
    }
  }
  
  if (data.settings !== undefined && typeof data.settings !== 'object') {
    return false;
  }
  
  return true;
};

export const createImportPreview = (backup, currentAppData) => {
  const preview = {
    version: backup.version || 1,
    exportedAt: backup.exportedAt || 'Unknown',
    totalRecords: backup.metadata?.totalRecords || 0,
    modules: backup.metadata?.modules || {},
    settingsIncluded: backup.metadata?.settingsIncluded || false,
    conflicts: {}
  };
  
  // Calculate conflicts
  for (const module of BACKUP_MODULES) {
    preview.conflicts[module] = 0;
    
    const incomingArr = backup.data[module];
    const currentArr = currentAppData[module];
    
    if (Array.isArray(incomingArr) && Array.isArray(currentArr)) {
      const currentIds = new Set(currentArr.map(item => item.id).filter(Boolean));
      
      incomingArr.forEach(item => {
        if (item.id && currentIds.has(item.id)) {
          preview.conflicts[module]++;
        }
      });
    }
  }
  
  return preview;
};

export const validateBackupFile = (backup) => {
  const result = {
    isValid: false,
    severity: "invalid",
    errors: [],
    warnings: [],
    summary: null,
    conflicts: null
  };

  if (!validateBackupEnvelope(backup)) {
    result.errors.push("Invalid backup envelope format. 'kind' or 'data' is missing.");
    return result;
  }

  if (!validateBackupDataShape(backup.data)) {
    result.errors.push("Invalid data shape inside backup.");
    return result;
  }

  if (backup.version > BACKUP_FORMAT_VERSION) {
    result.warnings.push(`Backup version (${backup.version}) is newer than supported version (${BACKUP_FORMAT_VERSION}). Some fields might be ignored.`);
    result.severity = "warning";
  }

  result.isValid = true;
  if (result.severity === "invalid") {
      result.severity = result.warnings.length > 0 ? "warning" : "valid";
  }

  result.summary = {
    backupVersion: backup.version || 1,
    exportedAt: backup.exportedAt || null,
    totalRecords: backup.metadata?.totalRecords || 0,
    modules: backup.metadata?.modules || {},
    settingsIncluded: backup.metadata?.settingsIncluded || false
  };

  return result;
};
