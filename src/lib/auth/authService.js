import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth, googleProvider, isFirebaseConfigured } from '../firebase/firebaseClient';
import { getAuthErrorMessage } from './authErrors';

const createResponse = (success, data = null, error = null) => ({
  success,
  data,
  error
});

export const getCurrentUser = () => {
  if (!isFirebaseConfigured() || !firebaseAuth) return null;
  return firebaseAuth.currentUser;
};

export const signUpWithEmail = async ({ email, password, fullName }) => {
  if (!isFirebaseConfigured()) return createResponse(false, null, 'Firebase tidak dikonfigurasi.');
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (fullName) {
      await updateProfile(userCredential.user, { displayName: fullName });
    }
    return createResponse(true, userCredential.user);
  } catch (error) {
    return createResponse(false, null, getAuthErrorMessage(error));
  }
};

export const signInWithEmail = async ({ email, password }) => {
  if (!isFirebaseConfigured()) return createResponse(false, null, 'Firebase tidak dikonfigurasi.');
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return createResponse(true, userCredential.user);
  } catch (error) {
    return createResponse(false, null, getAuthErrorMessage(error));
  }
};

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured()) return createResponse(false, null, 'Firebase tidak dikonfigurasi.');
  try {
    const userCredential = await signInWithPopup(firebaseAuth, googleProvider);
    return createResponse(true, userCredential.user);
  } catch (error) {
    return createResponse(false, null, getAuthErrorMessage(error));
  }
};

export const signOutUser = async () => {
  if (!isFirebaseConfigured()) return createResponse(false, null, 'Firebase tidak dikonfigurasi.');
  try {
    await signOut(firebaseAuth);
    return createResponse(true);
  } catch (error) {
    return createResponse(false, null, getAuthErrorMessage(error));
  }
};

export const resetPassword = async (email) => {
  if (!isFirebaseConfigured()) return createResponse(false, null, 'Firebase tidak dikonfigurasi.');
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    return createResponse(true);
  } catch (error) {
    return createResponse(false, null, getAuthErrorMessage(error));
  }
};

export const onFirebaseAuthStateChange = (callback) => {
  if (!isFirebaseConfigured() || !firebaseAuth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(firebaseAuth, callback);
};
