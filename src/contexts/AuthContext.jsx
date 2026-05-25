import React, { createContext, useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured } from '../lib/firebase/firebaseClient';
import { 
  onFirebaseAuthStateChange, 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signOutUser, 
  resetPassword 
} from '../lib/auth/authService';
import { 
  getUserProfile, 
  getBusinessProfile, 
  ensureUserProfile, 
  ensureBusinessProfile,
  upsertBusinessProfile
} from '../lib/auth/profileService';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const isFirebaseReady = isFirebaseConfigured();
  const isAuthenticated = !!user;
  const isGuest = !isAuthenticated;

  const loadProfiles = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setProfile(null);
      setBusinessProfile(null);
      return;
    }
    
    // Ensure docs exist
    await ensureUserProfile(firebaseUser);
    await ensureBusinessProfile(firebaseUser.uid);
    
    const [userProfile, busProfile] = await Promise.all([
      getUserProfile(firebaseUser.uid),
      getBusinessProfile(firebaseUser.uid)
    ]);
    
    setProfile(userProfile);
    setBusinessProfile(busProfile);
  }, []);

  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadProfiles(firebaseUser);
      } else {
        setProfile(null);
        setBusinessProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfiles]);

  const handleAuthAction = async (action, successMsg) => {
    setIsLoading(true);
    const response = await action();
    setIsLoading(false);
    
    if (response.success && successMsg) {
      addToast({ type: 'success', title: successMsg });
    } else if (!response.success) {
      addToast({ type: 'error', title: 'Error', message: response.error });
    }
    return response;
  };

  const signIn = (credentials) => handleAuthAction(() => signInWithEmail(credentials), 'Berhasil masuk');
  const signUp = (data) => handleAuthAction(() => signUpWithEmail(data), 'Akun berhasil dibuat');
  const signInGoogle = () => handleAuthAction(signInWithGoogle, 'Berhasil masuk dengan Google');
  const signOut = () => handleAuthAction(signOutUser, 'Berhasil keluar');
  const handleResetPassword = (email) => handleAuthAction(() => resetPassword(email), 'Link reset password terkirim');

  const updateBusinessProfileData = async (data) => {
    if (!user) return false;
    const success = await upsertBusinessProfile(user.uid, data);
    if (success) {
      setBusinessProfile(prev => ({ ...prev, ...data }));
    }
    return success;
  };

  const refreshAuth = async () => {
    if (user) {
      await loadProfiles(user);
    }
  };

  const value = {
    user,
    profile,
    businessProfile,
    isAuthenticated,
    isGuest,
    isLoading,
    isFirebaseReady,
    signIn,
    signUp,
    signInWithGoogle: signInGoogle,
    signOut,
    resetPassword: handleResetPassword,
    refreshAuth,
    updateBusinessProfile: updateBusinessProfileData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
