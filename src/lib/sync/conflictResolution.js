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

export const mergePayloads = (localPayload, cloudPayload, recordType) => {
  if (!localPayload) return cloudPayload;
  if (!cloudPayload) return localPayload;

  const merged = { ...localPayload };

  // For settings, do a shallow merge
  if (recordType === 'settings') {
    return { ...cloudPayload, ...localPayload };
  }

  // Iterate all keys in cloudPayload
  Object.keys(cloudPayload).forEach(key => {
    const localVal = localPayload[key];
    const cloudVal = cloudPayload[key];

    if (localVal === undefined || localVal === null || localVal === '') {
      merged[key] = cloudVal;
    } else if (cloudVal === undefined || cloudVal === null || cloudVal === '') {
      merged[key] = localVal;
    } else if (Array.isArray(localVal) && Array.isArray(cloudVal)) {
      // Merge arrays by ID or name if items have them
      const mergedArray = [...localVal];
      cloudVal.forEach(cloudItem => {
        const hasMatch = localVal.some(localItem => {
          const idMatch = (localItem.id && cloudItem.id && localItem.id === cloudItem.id);
          const nameMatch = (localItem.name && cloudItem.name && localItem.name.toLowerCase() === cloudItem.name.toLowerCase());
          const ingIdMatch = (localItem.ingredientId && cloudItem.ingredientId && localItem.ingredientId === cloudItem.ingredientId);
          return idMatch || nameMatch || ingIdMatch;
        });
        if (!hasMatch) {
          mergedArray.push(cloudItem);
        }
      });
      merged[key] = mergedArray;
    } else if (typeof localVal === 'object' && typeof cloudVal === 'object' && localVal !== null && cloudVal !== null) {
      merged[key] = { ...cloudVal, ...localVal };
    }
  });

  return merged;
};

export const resolveRecordConflict = (localRecord, cloudRecord) => {
  if (!localRecord) {
    if (cloudRecord) {
      cloudRecord.needPush = false;
      cloudRecord.needPull = true;
    }
    return cloudRecord;
  }
  if (!cloudRecord) {
    if (localRecord) {
      localRecord.needPush = true;
      localRecord.needPull = false;
    }
    return localRecord;
  }

  const winner = compareRecordFreshness(localRecord, cloudRecord);

  // If one of the records is deleted, deletion wins
  if (localRecord.deletedAt || cloudRecord.deletedAt) {
    const winningRecord = winner === 'local' ? localRecord : cloudRecord;
    winningRecord.needPush = winner === 'local';
    winningRecord.needPull = winner === 'cloud';
    return winningRecord;
  }

  // Both active: merge their payloads
  const mergedPayload = mergePayloads(localRecord.payload, cloudRecord.payload, localRecord.recordType);

  const winnerRecord = winner === 'local' ? localRecord : cloudRecord;

  // Optimize: if the merged payload is identical to the winner's payload, return winner directly to preserve reference equality in tests
  if (JSON.stringify(winnerRecord.payload) === JSON.stringify(mergedPayload)) {
    winnerRecord.needPush = winner === 'local';
    winnerRecord.needPull = winner === 'cloud';
    return winnerRecord;
  }

  const latestTime = new Date(localRecord.localUpdatedAt || 0).getTime() >= new Date(cloudRecord.localUpdatedAt || 0).getTime()
    ? localRecord.localUpdatedAt
    : cloudRecord.localUpdatedAt;

  const mergedRecord = {
    ...localRecord,
    payload: mergedPayload,
    localUpdatedAt: latestTime,
    deletedAt: null
  };

  // Determine if push/pull is needed based on changes compared to original inputs
  mergedRecord.needPush = JSON.stringify(localRecord.payload) !== JSON.stringify(mergedPayload);
  mergedRecord.needPull = JSON.stringify(cloudRecord.payload) !== JSON.stringify(mergedPayload);
  return mergedRecord;
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
        const mergedRecord = resolveRecordConflict(localRecord, cloudRecord);
        if (mergedRecord.needPush) {
          resolvedToCloud.push(mergedRecord);
        }
        if (mergedRecord.needPull) {
          resolvedToLocal.push(mergedRecord);
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
