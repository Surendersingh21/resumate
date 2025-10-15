import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Check if Firebase environment variables are available
const isFirebaseConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

let app: any;
let auth: Auth | null;
let db: Firestore | null;
let analytics: Analytics | null = null;

if (!isFirebaseConfigured) {
  console.warn('⚠️ Firebase not configured. Authentication features will be disabled.');
  console.log('📝 Please add your Firebase credentials to .env.local file');
} else {
  console.log('✅ Firebase configuration loaded successfully');
  console.log('Project ID:', firebaseConfig.projectId);
}

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  console.log('✅ Firestore initialized');

  // Initialize Analytics (only in production/browser environment)
  if (typeof window !== 'undefined' && isFirebaseConfigured) {
    try {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized');
    } catch (error) {
      console.warn('Analytics initialization skipped:', error);
    }
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  auth = null;
  db = null;
  analytics = null;
}

export { auth, db, analytics, isFirebaseConfigured };
export default app;