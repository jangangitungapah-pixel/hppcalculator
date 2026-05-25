import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseDb, isFirebaseConfigured } from '../firebase/firebaseClient';

export const getUserProfile = async (uid) => {
  if (!isFirebaseConfigured() || !firebaseDb) return null;
  try {
    const docRef = doc(firebaseDb, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const upsertUserProfile = async (user) => {
  if (!isFirebaseConfigured() || !firebaseDb || !user) return false;
  try {
    const docRef = doc(firebaseDb, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || '',
        avatarUrl: user.photoURL || '',
        provider: user.providerData?.[0]?.providerId || 'password',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Just update login info
      await setDoc(docRef, {
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return false;
  }
};

export const getBusinessProfile = async (uid) => {
  if (!isFirebaseConfigured() || !firebaseDb) return null;
  try {
    const docRef = doc(firebaseDb, `users/${uid}/businessProfile/main`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }
};

export const upsertBusinessProfile = async (uid, profileData) => {
  if (!isFirebaseConfigured() || !firebaseDb || !uid) return false;
  try {
    const docRef = doc(firebaseDb, `users/${uid}/businessProfile/main`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error('Error upserting business profile:', error);
    return false;
  }
};

export const ensureUserProfile = async (user) => {
  return await upsertUserProfile(user);
};

export const ensureBusinessProfile = async (uid) => {
  const profile = await getBusinessProfile(uid);
  if (!profile) {
    return await upsertBusinessProfile(uid, {
      businessName: '',
      businessType: '',
      city: '',
      notes: ''
    });
  }
  return true;
};
