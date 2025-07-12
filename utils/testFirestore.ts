import { getFirebaseFirestore } from '@/lib/firebaseClient';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  console.log('=== TESTE FIRESTORE ===');
  
  try {
    // Teste 1: Verificar se db existe
    console.log('1. DB existe?', !!getFirebaseFirestore);
    
    const db = getFirebaseFirestore();
    console.log('1.1. DB inicializado?', !!db);
    
    if (!db) {
      throw new Error('Firestore não inicializado');
    }

    // Debug do Firestore - ANTES de usar collection()
    console.log('=== DEBUG FIRESTORE ===');
    console.log('Tipo da instância db:', typeof db);
    console.log('É uma instância Firestore?', db instanceof Object);
    console.log('Propriedades do db:', Object.keys(db || {}));
    console.log('db é null/undefined?', db === null || db === undefined);
    console.log('========================');

    // Teste 2: Criar referência de collection
    console.log('2. Testando collection...');
    
    try {
      const testCollection = collection(db, 'test');
      console.log('✅ Collection criada com sucesso');
      console.log('Collection type:', typeof testCollection);
    } catch (error: any) {
      console.error('❌ Erro ao criar collection:', error.message);
      throw error;
    }

    // Teste 3: Criar documento de teste
    console.log('3. Testando documento...');
    const testDocRef = doc(db, 'test', 'teste-conexao');
    await setDoc(testDocRef, {
      timestamp: new Date(),
      test: 'Conexão funcionando'
    });
    console.log('✅ Documento criado');

    // Teste 4: Ler documento
    console.log('4. Testando leitura...');
    const docSnap = await getDoc(testDocRef);
    console.log('✅ Documento lido:', docSnap.exists());

    // Teste 5: Listar documentos da collection
    console.log('5. Testando listagem...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Documents encontrados:', querySnapshot.size);

    return { success: true, message: 'Firestore funcionando!' };
  } catch (error: any) {
    console.error('❌ Erro no teste:', error);
    return { success: false, error: error.message };
  }
};

// Função para debug específico de collection
export const debugFirestoreCollection = (db: any, collectionName: string) => {
  console.log('=== DEBUG COLLECTION ===');
  console.log('Collection name:', collectionName);
  console.log('DB instance:', !!db);
  console.log('DB type:', typeof db);
  
  if (!db) {
    console.error('❌ DB is null/undefined');
    return false;
  }
  
  try {
    const collectionRef = collection(db, collectionName);
    console.log('✅ Collection reference created successfully');
    console.log('Collection ref type:', typeof collectionRef);
    return true;
  } catch (error: any) {
    console.error('❌ Error creating collection reference:', error.message);
    return false;
  }
};
