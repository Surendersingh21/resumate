// Firebase Authentication service
import { 
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth as firebaseAuth, isFirebaseConfigured as firebaseConfigured } from '@/config/firebase';
import type { Auth } from 'firebase/auth';

// Check if Firebase is properly configured
const isFirebaseConfigured = firebaseConfigured;

// Type guard for auth
const getAuth = (): Auth => {
  if (!firebaseAuth) {
    throw new Error('Firebase auth not initialized');
  }
  return firebaseAuth as Auth;
};

// Custom User interface matching our app's needs
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: 'email' | 'google';
}

export interface AuthError {
  code: string;
  message: string;
}

// Convert Firebase User to our User interface
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  const providerData = firebaseUser.providerData[0];
  const isGoogleProvider = providerData?.providerId === 'google.com';
  
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    provider: isGoogleProvider ? 'google' : 'email'
  };
};

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    // Initialize Google Auth Provider
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
  }

  // Google Authentication
  async signInWithGoogle(): Promise<User> {
    if (!isFirebaseConfigured) {
      console.warn('🔥 Firebase not configured. Please add your Firebase config to .env.local');
      throw {
        code: 'auth/configuration-error',
        message: 'Firebase authentication is not configured. Please check your environment variables.'
      } as AuthError;
    }

    try {
      const authInstance = getAuth();
      const result = await signInWithPopup(authInstance, this.googleProvider);
      return convertFirebaseUser(result.user);
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      } as AuthError;
    }
  }

  // Email/Password Authentication
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    if (!isFirebaseConfigured) {
      console.warn('🔥 Firebase not configured. Please add your Firebase config to .env.local');
      throw {
        code: 'auth/configuration-error',
        message: 'Firebase authentication is not configured. Please check your environment variables.'
      } as AuthError;
    }

    try {
      const authInstance = getAuth();
      const userCredential = await firebaseSignInWithEmail(authInstance, email, password);
      return convertFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      } as AuthError;
    }
  }

  // Create account with email/password
  async createUserWithEmailAndPassword(email: string, password: string, displayName?: string): Promise<User> {
    if (!isFirebaseConfigured) {
      console.warn('🔥 Firebase not configured. Please add your Firebase config to .env.local');
      throw {
        code: 'auth/configuration-error',
        message: 'Firebase authentication is not configured. Please check your environment variables.'
      } as AuthError;
    }

    try {
      const authInstance = getAuth();
      const userCredential = await firebaseCreateUserWithEmail(authInstance, email, password);
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      return convertFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      } as AuthError;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const authInstance = getAuth();
      await firebaseSignOut(authInstance);
    } catch (error: any) {
      throw {
        code: error.code,
        message: error.message
      } as AuthError;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const authInstance = getAuth();
    const firebaseUser = authInstance.currentUser;
    return firebaseUser ? convertFirebaseUser(firebaseUser) : null;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const authInstance = getAuth();
    return firebaseOnAuthStateChanged(authInstance, (firebaseUser) => {
      const user = firebaseUser ? convertFirebaseUser(firebaseUser) : null;
      callback(user);
    });
  }
}

// Export singleton instance
export const authService = new AuthService();

// Helper function to get user-friendly error messages
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    // Sign In Errors
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Invalid email or password. Please check your credentials.';
    
    // Sign Up Errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    
    // Google Sign-In Errors
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up blocked. Please allow pop-ups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in request was cancelled.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials.';
    
    // Network Errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    
    // General Errors
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};