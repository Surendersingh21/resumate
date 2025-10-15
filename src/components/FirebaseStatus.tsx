import { useEffect, useState } from 'react';
import { isFirebaseConfigured, auth, db, analytics } from '@/config/firebase';

export const FirebaseStatus = () => {
  const [status, setStatus] = useState({
    configured: false,
    auth: false,
    firestore: false,
    analytics: false,
    projectId: ''
  });

  useEffect(() => {
    setStatus({
      configured: isFirebaseConfigured,
      auth: auth !== null,
      firestore: db !== null,
      analytics: analytics !== null,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-lg max-w-md">
        <strong className="font-bold">⚠️ Firebase Not Configured</strong>
        <p className="text-sm mt-1">Please add Firebase credentials to .env.local</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded shadow-lg max-w-md">
      <strong className="font-bold">✅ Firebase Connected</strong>
      <div className="text-sm mt-2 space-y-1">
        <p><strong>Project:</strong> {status.projectId}</p>
        <div className="flex gap-4 mt-2">
          <span className={status.auth ? 'text-green-600' : 'text-red-600'}>
            {status.auth ? '✓' : '✗'} Auth
          </span>
          <span className={status.firestore ? 'text-green-600' : 'text-red-600'}>
            {status.firestore ? '✓' : '✗'} Firestore
          </span>
          <span className={status.analytics ? 'text-green-600' : 'text-red-600'}>
            {status.analytics ? '✓' : '✗'} Analytics
          </span>
        </div>
      </div>
      <button 
        onClick={() => setStatus({ ...status, configured: false })}
        className="absolute top-2 right-2 text-green-600 hover:text-green-800"
      >
        ×
      </button>
    </div>
  );
};

export default FirebaseStatus;
