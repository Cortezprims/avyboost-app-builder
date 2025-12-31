import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  balance: number;
  loyaltyLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generateReferralCode = () => {
    return 'AVY' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>) => {
    const userRef = doc(db, 'users', user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      balance: 0,
      loyaltyLevel: 'bronze',
      loyaltyPoints: 0,
      referralCode: generateReferralCode(),
      createdAt: new Date(),
      ...additionalData
    };
    
    await setDoc(userRef, {
      ...newProfile,
      createdAt: serverTimestamp()
    });
    
    return newProfile;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(user, { displayName: name });
    return user;
  };

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if profile exists, if not create one
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    if (!profileDoc.exists()) {
      await createUserProfile(user);
    }
    
    return user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword
  };
};
