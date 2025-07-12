import { getFirebaseFirestore } from '@/lib/firebaseClient';
import { collection, getDocs, where, query } from 'firebase/firestore';

export const debugHookFirestore = async (hookName: string, collectionName: string) => {
  console.log(`=== DEBUG ${hookName} ===`);
  
  try {
    const db = getFirebaseFirestore();
    
    if (!db) {
      console.error(`❌ ${hookName}: Firestore não inicializado`);
      return false;
    }

    console.log(`✅ ${hookName}: Firestore inicializado`);
    
    // Test collection access
    const collectionRef = collection(db, collectionName);
    console.log(`✅ ${hookName}: Collection ${collectionName} acessada`);
    
    // Test query
    const snapshot = await getDocs(collectionRef);
    console.log(`✅ ${hookName}: Query executada, docs: ${snapshot.size}`);
    
    return true;
  } catch (error: any) {
    console.error(`❌ ${hookName}: Erro - ${error.message}`);
    return false;
  }
};

export const safeCollectionRef = (db: any, collectionName: string, hookName: string) => {
  try {
    if (!db) {
      console.error(`❌ ${hookName}: DB não inicializado`);
      return null;
    }
    
    const collectionRef = collection(db, collectionName);
    console.log(`✅ ${hookName}: Collection ${collectionName} criada com sucesso`);
    return collectionRef;
  } catch (error: any) {
    console.error(`❌ ${hookName}: Erro ao criar collection ${collectionName}:`, error.message);
    return null;
  }
};
