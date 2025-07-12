import { useEffect, useState } from 'react';
import { Firestore } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebaseClient';

export const useFirestore = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    const checkFirestore = async () => {
      try {
        if (typeof window !== 'undefined') {
          const firestoreInstance = getFirebaseFirestore();
          
          if (firestoreInstance) {
            console.log('Firestore está pronto:', !!firestoreInstance);
            setDb(firestoreInstance);
            setIsReady(true);
          } else {
            console.error('Firestore não foi inicializado');
            setError('Firestore não disponível');
          }
        }
      } catch (err: any) {
        console.error('Erro ao verificar Firestore:', err);
        setError('Erro ao inicializar Firestore: ' + err.message);
      }
    };

    checkFirestore();
  }, []);

  return { isReady, error, db };
};

// Versão original para compatibilidade
export const useFirestoreSafe = () => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const firestoreInstance = getFirebaseFirestore();
        setDb(firestoreInstance);
        console.log('Firestore instance:', firestoreInstance);
        console.log('Is Firestore ready:', !!firestoreInstance);
      } catch (error) {
        console.error('Failed to initialize Firestore:', error);
        setError('Failed to initialize Firestore');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return { db, loading, error };
};

// Safe Firestore operations wrapper
export const withFirestoreSafe = <T extends any[]>(
  operation: (db: Firestore, ...args: T) => Promise<any>
) => {
  return async (...args: T) => {
    let db: Firestore | null = null;
    
    try {
      // Debug do Firestore
      console.log('=== DEBUG FIRESTORE ===');
      
      db = getFirebaseFirestore();
      
      console.log('Tipo da instância db:', typeof db);
      console.log('É uma instância Firestore?', db instanceof Object);
      console.log('Propriedades do db:', Object.keys(db || {}));
      console.log('db é null/undefined?', db === null || db === undefined);
      console.log('========================');
      
      if (!db) {
        console.error('Firestore não inicializado!');
        throw new Error('Firestore não está disponível');
      }
      
      return await operation(db, ...args);
    } catch (error: any) {
      console.error('❌ Erro ao executar operação Firestore:', {
        error: error.message,
        dbInstance: !!db,
        dbType: typeof db,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };
};
