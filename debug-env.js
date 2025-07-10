// Debug script para verificar variáveis de ambiente
// Execute este script para verificar se as variáveis estão sendo carregadas

console.log('=== DEBUG: Variáveis de Ambiente Firebase ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Platform:', typeof window !== 'undefined' ? 'Client' : 'Server');

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('\n=== Status das Variáveis ===');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ OK' : '❌ MISSING';
  const displayValue = value ? `${value.substring(0, 10)}...` : 'undefined';
  console.log(`${varName}: ${status} (${displayValue})`);
});

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('\n❌ VARIÁVEIS AUSENTES:');
  missingVars.forEach(varName => {
    console.log(`- ${varName}`);
  });
  
  console.log('\n🔧 SOLUÇÃO:');
  console.log('1. Acesse https://vercel.com/dashboard');
  console.log('2. Selecione seu projeto DS-Planly');
  console.log('3. Vá em Settings → Environment Variables');
  console.log('4. Adicione as variáveis ausentes com prefixo NEXT_PUBLIC_');
  console.log('5. Selecione Production, Preview e Development');
  console.log('6. Faça um redeploy do projeto');
} else {
  console.log('\n✅ Todas as variáveis estão configuradas!');
}

console.log('\n=== Todas as Variáveis de Ambiente ===');
Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC_'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`);
  });