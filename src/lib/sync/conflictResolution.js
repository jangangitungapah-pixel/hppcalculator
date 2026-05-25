export const isConflict = (localRecord, cloudRecord) => {
  if (!localRecord || !cloudRecord) return false;
  return localRecord.localUpdatedAt !== cloudRecord.localUpdatedAt;
};

export const compareRecordFreshness = (localRecord, cloudRecord) => {
  // Check deletion status first. If one is deleted later, it wins.
  const localDel = localRecord.deletedAt ? new Date(localRecord.deletedAt).getTime() : null;
  const cloudDel = cloudRecord.deletedAt ? new Date(cloudRecord.deletedAt).getTime() : null;

  if (localDel && cloudDel) {
    return localDel >= cloudDel ? 'local' : 'cloud';
  }
  if (localDel && (!cloudRecord.localUpdatedAt || localDel > new Date(cloudRecord.localUpdatedAt).getTime())) {
    return 'local';
  }
  if (cloudDel && (!localRecord.localUpdatedAt || cloudDel > new Date(localRecord.localUpdatedAt).getTime())) {
    return 'cloud';
  }

  // Compare update timestamps
  const localTime = new Date(localRecord.localUpdatedAt || 0).getTime();
  const cloudTime = new Date(cloudRecord.localUpdatedAt || 0).getTime();

  if (localTime > cloudTime) return 'local';
  if (cloudTime > localTime) return 'cloud';
  
  // If exactly equal, local wins to prevent accidental overwrite of local un-pushed changes
  return 'local'; 
};

export const resolveRecordConflict = (localRecord, cloudRecord) => {
  if (!localRecord) return cloudRecord;
  if (!cloudRecord) return localRecord;

  const winner = compareRecordFreshness(localRecord, cloudRecord);
  return winner === 'local' ? localRecord : cloudRecord;
};

export const resolveSyncConflicts = (localRecords, cloudRecords) => {
  const cloudMap = new Map(cloudRecords.map(r => [`${r.recordType}_${r.recordId}`, r]));
  const localMap = new Map(localRecords.map(r => [`${r.recordType}_${r.recordId}`, r]));
  
  const resolvedToCloud = [];
  const resolvedToLocal = [];
  let conflictCount = 0;

  // Process cloud records
  cloudMap.forEach((cloudRecord, key) => {
    const localRecord = localMap.get(key);
    if (localRecord) {
      if (isConflict(localRecord, cloudRecord)) {
        conflictCount++;
        const winner = resolveRecordConflict(localRecord, cloudRecord);
        if (winner === cloudRecord) {
          resolvedToLocal.push(cloudRecord); // we need to apply this to local
        } else {
          resolvedToCloud.push(localRecord); // we need to push this to cloud
        }
      }
      // If no conflict, they are identical, do nothing.
    } else {
      // Cloud has it, local doesn't -> pull to local
      resolvedToLocal.push(cloudRecord);
    }
  });

  // Process local records not in cloud
  localMap.forEach((localRecord, key) => {
    if (!cloudMap.has(key)) {
      resolvedToCloud.push(localRecord);
    }
  });

  return { resolvedToLocal, resolvedToCloud, conflictCount };
};
