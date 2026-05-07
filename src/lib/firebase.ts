import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// CRITICAL: Validate connection to Firestore on boot
async function testConnection() {
  try {
    // Attempt to read a document to check connectivity
    // Using 'users/test' might still fail but we catch the error
    await getDocFromServer(doc(db, 'users', 'connectivity-test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase is offline. Please check your connection.");
    }
    // We ignore other errors like permissions here as this is just a connectivity check
  }
}

testConnection();
