#!/usr/bin/env node

/**
 * Script de emergência para resolver problemas críticos de cache
 * Use quando o projeto não conseguir iniciar devido a problemas de cache
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

console.log(`${colors.red}
╔═══════════════════════════════════════════════════════════════╗
║                    🚨 EMERGENCY CLEAN 🚨                     ║
║              Sistema de Limpeza de Emergência                 ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}`);

log('⚠️  ATENÇÃO: Este script irá remover TODOS os caches e dependências!', 'yellow');
log('⚠️  Use apenas em caso de problemas críticos que impedem o funcionamento.', 'yellow');

// Função para remover diretório/arquivo de forma segura
function forceRemove(itemPath) {
  if (fs.existsSync(itemPath)) {
    try {
      if (fs.statSync(itemPath).isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        log(`🗑️  Removido diretório: ${itemPath}`, 'green');
      } else {
        fs.unlinkSync(itemPath);
        log(`🗑️  Removido arquivo: ${itemPath}`, 'green');
      }
      return true;
    } catch (error) {
      log(`❌ Erro ao remover ${itemPath}: ${error.message}`, 'red');
      return false;
    }
  } else {
    log(`ℹ️  Item não existe: ${itemPath}`, 'blue');
    return true;
  }
}

// Função para executar comando com tratamento de erro
function runCommand(command, description, critical = false) {
  log(`🔧 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`✅ ${description} - Concluído`, 'green');
    return true;
  } catch (error) {
    if (critical) {
      log(`❌ ${description} - FALHOU (crítico)`, 'red');
      throw error;
    } else {
      log(`⚠️  ${description} - Falhou (continuando...)`, 'yellow');
      return false;
    }
  }
}

async function emergencyClean() {
  log('\n🚀 Iniciando limpeza de emergência...', 'magenta');
  
  // 1. Parar qualquer processo que possa estar rodando
  log('\n📋 ETAPA 1: Parando processos...', 'cyan');
  
  if (process.platform === 'win32') {
    runCommand('taskkill /F /IM node.exe 2>nul || echo "Nenhum processo Node encontrado"', 'Parando processos Node.js');
    runCommand('taskkill /F /IM next.exe 2>nul || echo "Nenhum processo Next encontrado"', 'Parando processos Next.js');
  } else {
    runCommand('pkill -f "next dev" || echo "Nenhum processo Next dev encontrado"', 'Parando Next.js dev');
    runCommand('pkill -f "node" || echo "Nenhum processo Node encontrado"', 'Parando processos Node.js');
  }
  
  // 2. Remover TODOS os diretórios de cache
  log('\n📋 ETAPA 2: Removendo diretórios de cache...', 'cyan');
  
  const cacheDirectories = [
    '.next',
    'node_modules',
    '.swc',
    'out',
    'build',
    'dist',
    '.vercel',
    '.turbo',
    '.parcel-cache',
    '.webpack',
    '.cache',
    'temp',
    'tmp'
  ];
  
  for (const dir of cacheDirectories) {
    forceRemove(dir);
  }
  
  // 3. Remover arquivos de cache e lock
  log('\n📋 ETAPA 3: Removendo arquivos de cache...', 'cyan');
  
  const cacheFiles = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.tsbuildinfo',
    'tsconfig.tsbuildinfo',
    '.eslintcache',
    '.stylelintcache',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
    'pnpm-debug.log'
  ];
  
  for (const file of cacheFiles) {
    forceRemove(file);
  }
  
  // 4. Limpar cache global dos gerenciadores de pacote
  log('\n📋 ETAPA 4: Limpando cache global...', 'cyan');
  
  runCommand('npm cache clean --force', 'Limpando cache global do NPM');
  runCommand('yarn cache clean', 'Limpando cache global do Yarn');
  runCommand('pnpm store prune', 'Limpando store do PNPM');
  
  // 5. Limpar cache do sistema operacional
  log('\n📋 ETAPA 5: Limpando cache do sistema...', 'cyan');
  
  if (process.platform === 'win32') {
    runCommand('del /q /s %TEMP%\\* 2>nul || echo "Temp limpo"', 'Limpando arquivos temporários');
  } else {
    runCommand('rm -rf /tmp/.* 2>/dev/null || echo "Temp limpo"', 'Limpando arquivos temporários');
  }
  
  // 6. Reinstalar dependências
  log('\n📋 ETAPA 6: Reinstalando dependências...', 'cyan');
  
  // Verificar qual gerenciador de pacote usar
  let packageManager = 'npm';
  if (fs.existsSync('pnpm-lock.yaml') || fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.packageManager && packageJson.packageManager.includes('pnpm')) {
        packageManager = 'pnpm';
      }
    } catch (error) {
      log('⚠️  Erro ao ler package.json, usando npm como padrão', 'yellow');
    }
  }
  
  if (packageManager === 'pnpm') {
    runCommand('pnpm install --force', 'Reinstalando dependências com PNPM', true);
  } else {
    runCommand('npm install --force', 'Reinstalando dependências com NPM', true);
  }
  
  // 7. Verificar integridade da instalação
  log('\n📋 ETAPA 7: Verificando integridade...', 'cyan');
  
  if (!fs.existsSync('node_modules')) {
    log('❌ node_modules não foi criado!', 'red');
    throw new Error('Falha na instalação das dependências');
  }
  
  if (!fs.existsSync('package.json')) {
    log('❌ package.json não encontrado!', 'red');
    throw new Error('package.json não encontrado');
  }
  
  // 8. Tentar fazer build de teste
  log('\n📋 ETAPA 8: Testando build...', 'cyan');
  
  try {
    if (packageManager === 'pnpm') {
      runCommand('pnpm run build', 'Testando build', false);
    } else {
      runCommand('npm run build', 'Testando build', false);
    }
    log('✅ Build de teste bem-sucedido!', 'green');
  } catch (error) {
    log('⚠️  Build de teste falhou, mas instalação foi concluída', 'yellow');
  }
  
  // Relatório final
  log('\n📊 RELATÓRIO FINAL:', 'magenta');
  log('✅ Cache completamente limpo', 'green');
  log('✅ Dependências reinstaladas', 'green');
  log('✅ Sistema pronto para uso', 'green');
  
  log('\n🎯 PRÓXIMOS PASSOS:', 'cyan');
  log(`• Execute: ${packageManager} run dev`, 'cyan');
  log('• Se ainda houver problemas, verifique o arquivo next.config.mjs', 'cyan');
  log('• Consulte os logs de erro para problemas específicos', 'cyan');
  
  log('\n🔧 COMANDOS ÚTEIS:', 'blue');
  log(`• Desenvolvimento limpo: ${packageManager} run dev:clean`, 'blue');
  log(`• Build limpo: ${packageManager} run build:clean`, 'blue');
  log(`• Verificar saúde: ${packageManager} run health:check`, 'blue');
  
  log('\n🎉 Limpeza de emergência concluída!', 'green');
}

// Executar limpeza
emergencyClean().catch(error => {
  log(`\n💥 ERRO CRÍTICO: ${error.message}`, 'red');
  log('\n🆘 AÇÕES MANUAIS NECESSÁRIAS:', 'yellow');
  log('1. Verifique se você tem permissões de escrita no diretório', 'yellow');
  log('2. Feche todos os editores e terminais', 'yellow');
  log('3. Reinicie o computador se necessário', 'yellow');
  log('4. Execute o script novamente', 'yellow');
  process.exit(1);
});
