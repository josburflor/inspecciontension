import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, getRedirectResult } from 'firebase/auth';

import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log("Redirect login successful:", result.user.email);
      }
    }).catch((error) => {
      console.error("Redirect login error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log("Auth state changed:", firebaseUser?.email || "No user");
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Fetch or create profile
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              console.log("Profile found:", userDoc.data().name);
              setProfile(userDoc.data());
            } else {
              console.log("Creating new profile for:", firebaseUser.email);
              // Create initial profile
              const newProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'Usuario',
                createdAt: serverTimestamp(),
                age: 30,
                weight: 70,
                height: 170,
                gender: 'other'
              };
              await setDoc(userDocRef, newProfile);
              setProfile(newProfile);
              console.log("Profile created successfully");
            }
          } catch (profileError: any) {
            console.error("Error fetching/creating profile:", profileError.code, profileError.message);
            // If it's a permission error, maybe the rules are blocking it
            if (profileError.code === 'permission-denied') {
              console.warn("Permission denied for Firestore. Check your rules.");
            }
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
