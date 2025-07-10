// lib/firebaseClient.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!firebaseConfig[field]) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    console.error('❌ Missing Firebase configuration fields:', missingFields);
    console.error('Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set');
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase
let app;
let auth;

try {
  validateFirebaseConfig();
  
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  
  if (error.code === 'auth/configuration-not-found') {
    console.error('💡 Fix: Check your Firebase project configuration');
    console.error('   - Verify project exists in Firebase Console');
    console.error('   - Regenerate configuration from Firebase Console');
    console.error('   - Update .env.local with correct values');
  }
  
  // Create a mock auth object to prevent app crashes
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
    signOut: () => Promise.reject(new Error('Firebase not configured')),
    onAuthStateChanged: () => () => {}
  };
}

export { auth, app };
