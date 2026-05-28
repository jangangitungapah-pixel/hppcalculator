import { collection, doc, getDocs, setDoc, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { firebaseDb, isFirebaseConfigured } from '../firebase/firebaseClient';

export const fetchCloudRecords = async (uid) => {
  if (!isFirebaseConfigured() || !firebaseDb || !uid) return [];
  try {
    const colRef = collection(firebaseDb, `users/${uid}/syncRecords`);
    const snapshot = await getDocs(colRef);
    const records = [];
    snapshot.forEach(doc => {
      records.push(doc.data());
    });
    return records;
  } catch (error) {
    console.error('Error fetching cloud records:', error);
    throw new Error('Gagal mengambil data dari cloud');
  }
};

export const upsertCloudRecords = async (uid, records) => {
  if (!isFirebaseConfigured() || !firebaseDb || !uid) return { success: false };
  
  try {
    if (!records.length) {
      await updateSyncState(uid, { lastPushAt: new Date().toISOString() });
      return { success: true };
    }

    // Firestore batch limit is 500, we use 400 to be safe
    const CHUNK_SIZE = 400;
    for (let i = 0; i < records.length; i += CHUNK_SIZE) {
      const chunk = records.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(firebaseDb);
      
      chunk.forEach(record => {
        const recordKey = `${record.recordType}_${record.recordId}`;
        const docRef = doc(firebaseDb, `users/${uid}/syncRecords/${recordKey}`);
        
        batch.set(docRef, {
          ...record,
          updatedAt: serverTimestamp(),
          // we only set createdAt if the doc didn't exist, use merge true
        }, { merge: true });
      });
      
      await batch.commit();
    }
    
    // Update sync state
    await updateSyncState(uid, { lastPushAt: new Date().toISOString() });
    
    return { success: true };
  } catch (error) {
    console.error('Error upserting cloud records:', error);
    throw new Error('Gagal mengirim data ke cloud');
  }
};

export const softDeleteCloudRecord = async (uid, recordType, recordId) => {
  if (!isFirebaseConfigured() || !firebaseDb || !uid) return;
  const recordKey = `${recordType}_${recordId}`;
  try {
    const docRef = doc(firebaseDb, `users/${uid}/syncRecords/${recordKey}`);
    await setDoc(docRef, {
      deletedAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft deleting cloud record:', error);
  }
};

export const fetchSyncState = async (uid) => {
  if (!isFirebaseConfigured() || !firebaseDb || !uid) return null;
  try {
    const docRef = doc(firebaseDb, `users/${uid}/syncState/main`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching sync state:', error);
    return null;
  }
};

export const updateSyncState = async (uid, partial) => {
  if (!isFirebaseConfigured() || !firebaseDb || !uid) return;
  try {
    const docRef = doc(firebaseDb, `users/${uid}/syncState/main`);
    await setDoc(docRef, {
      ...partial,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating sync state:', error);
  }
};
