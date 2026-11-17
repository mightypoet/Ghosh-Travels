/**
 * Firebase Configuration & Backend Integration Structure
 *
 * When ready to connect a live Firebase project (Firestore + Firebase Auth + Storage),
 * populate the environment variables in `.env` or replace the placeholders below:
 *
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Firestore Database and Firebase Authentication (Google / Email sign-in).
 * 3. Copy your Web App Firebase config into the fields below or set VITE_FIREBASE_* env vars.
 */

export interface FirebaseConnectionConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export const FIREBASE_CONFIG_PLACEHOLDER: FirebaseConnectionConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ghosh-travels-kolkata.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ghosh-travels-kolkata',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ghosh-travels-kolkata.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_FIREBASE_APP_ID',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)',
};

export function isFirebaseConfigured(): boolean {
  return (
    Boolean(FIREBASE_CONFIG_PLACEHOLDER.apiKey) &&
    FIREBASE_CONFIG_PLACEHOLDER.apiKey !== 'YOUR_FIREBASE_API_KEY'
  );
}
