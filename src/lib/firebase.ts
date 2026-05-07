import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// If firestoreDatabaseId is provided in config, use it, otherwise use default
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const logout = () => signOut(auth);

// CRITICAL: Validate connection to Firestore on boot
async function testConnection() {
  try {
    console.log("Testing Firebase connection...");
    // Attempt to read a document to check connectivity
    await getDocFromServer(doc(db, 'users', 'connectivity-test'));
    console.log("Firebase connection successful.");
  } catch (error: any) {
    console.error("Firebase connection test error:", error.code, error.message);
    if (error.message.includes('the client is offline')) {
      console.error("Firebase is offline. Please check your connection.");
    }
  }
}

testConnection();

