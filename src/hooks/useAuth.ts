import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Fetch or create profile
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setProfile(userDoc.data());
            } else {
              // Create initial profile
              const newProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                createdAt: serverTimestamp(),
                age: 30,
                weight: 70,
                height: 170,
                gender: 'other'
              };
              await setDoc(userDocRef, newProfile);
              setProfile(newProfile);
            }
          } catch (profileError) {
            console.error("Error fetching/creating profile:", profileError);
            // We still have the user object, so we can let them in, 
            // but the profile data will be missing.
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
