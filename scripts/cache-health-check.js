#!/usr/bin/env node

/**
 * Script para verificar a saúde do cache do Next.js
 * Detecta problemas antes que causem erros
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

function logStep(step, message, color = 'blue') {
  console.log(`${colors[color]}[${step}] ${message}${colors.reset}`);
}

console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════════╗
║                   CACHE HEALTH CHECK v1.0                    ║
║              Next.js Cache Diagnostic Tool                    ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}`);

// Função para verificar se um diretório existe
function dirExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Função para verificar se um arquivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

// Função para obter tamanho de diretório
function getDirSize(dirPath) {
  if (!dirExists(dirPath)) return 0;
  
  let totalSize = 0;
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        totalSize += getDirSize(filePath);
      } else {
        try {
          totalSize += fs.statSync(filePath).size;
        } catch (error) {
          // Arquivo pode ter sido removido durante a leitura
        }
      }
    }
  } catch (error) {
    // Diretório pode não existir mais
  }
  
  return totalSize;
}

// Função para formatar tamanho em bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função para verificar arquivos corrompidos
function checkCorruptedFiles(dirPath) {
  if (!dirExists(dirPath)) return [];
  
  const corruptedFiles = [];
  
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      
      if (file.isDirectory()) {
        corruptedFiles.push(...checkCorruptedFiles(filePath));
      } else {
        try {
          // Tentar ler o arquivo para verificar se está corrompido
          const stats = fs.statSync(filePath);
          
          // Verificar se o arquivo está vazio quando não deveria estar
          if (stats.size === 0 && path.extname(filePath) === '.js') {
            corruptedFiles.push(filePath);
          }
          
          // Verificar se é um arquivo .js e tentar fazer parse básico
          if (path.extname(filePath) === '.js') {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('UNKNOWN: unknown error')) {
              corruptedFiles.push(filePath);
            }
          }
        } catch (error) {
          corruptedFiles.push(filePath);
        }
      }
    }
  } catch (error) {
    // Diretório pode não existir mais
  }
  
  return corruptedFiles;
}

// Função para verificar permissões de arquivos
function checkPermissions(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
}

// Função para verificar integridade do package.json
function checkPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verificar campos essenciais
    const required = ['name', 'version', 'scripts', 'dependencies'];
    const missing = required.filter(field => !packageJson[field]);
    
    return {
      valid: missing.length === 0,
      missing: missing,
      data: packageJson
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      data: null
    };
  }
}

// Função para verificar configuração do Next.js
function checkNextConfig() {
  const configFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
  const results = [];
  
  for (const configFile of configFiles) {
    if (fileExists(configFile)) {
      try {
        const content = fs.readFileSync(configFile, 'utf8');
        results.push({
          file: configFile,
          exists: true,
          size: fs.statSync(configFile).size,
          readable: true,
          content: content.slice(0, 200) + '...'
        });
      } catch (error) {
        results.push({
          file: configFile,
          exists: true,
          size: 0,
          readable: false,
          error: error.message
        });
      }
    } else {
      results.push({
        file: configFile,
        exists: false
      });
    }
  }
  
  return results;
}

// Função para verificar espaço em disco
function checkDiskSpace() {
  try {
    const stats = fs.statSync('.');
    return {
      available: true,
      writable: checkPermissions('.')
    };
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
}

// Função principal de verificação
async function checkCacheHealth() {
  logStep('START', 'Iniciando verificação de saúde do cache...', 'magenta');
  
  const results = {
    issues: [],
    warnings: [],
    info: []
  };
  
  // 1. Verificar arquivos de configuração
  logStep('CONFIG', 'Verificando arquivos de configuração...', 'blue');
  
  const packageCheck = checkPackageJson();
  if (!packageCheck.valid) {
    results.issues.push(`package.json inválido: ${packageCheck.error || 'Campos obrigatórios faltando: ' + packageCheck.missing.join(', ')}`);
    log('❌ package.json com problemas', 'red');
  } else {
    log('✅ package.json válido', 'green');
  }
  
  const nextConfigCheck = checkNextConfig();
  const validConfigs = nextConfigCheck.filter(config => config.exists && config.readable);
  
  if (validConfigs.length === 0) {
    results.warnings.push('Nenhuma configuração Next.js encontrada');
    log('⚠️  Nenhuma configuração Next.js encontrada', 'yellow');
  } else {
    log(`✅ Configuração Next.js encontrada: ${validConfigs[0].file}`, 'green');
  }
  
  // 2. Verificar diretórios de cache
  logStep('CACHE', 'Verificando diretórios de cache...', 'blue');
  
  const cacheDirectories = [
    { path: '.next', name: 'Next.js Cache' },
    { path: 'node_modules/.cache', name: 'Node Modules Cache' },
    { path: '.swc', name: 'SWC Cache' }
  ];
  
  let totalCacheSize = 0;
  
  for (const dir of cacheDirectories) {
    if (dirExists(dir.path)) {
      const size = getDirSize(dir.path);
      totalCacheSize += size;
      
      if (size > 500 * 1024 * 1024) { // > 500MB
        results.warnings.push(`${dir.name} muito grande: ${formatBytes(size)}`);
        log(`⚠️  ${dir.name}: ${formatBytes(size)} (muito grande)`, 'yellow');
      } else {
        log(`📁 ${dir.name}: ${formatBytes(size)}`, 'cyan');
      }
    } else {
      log(`📁 ${dir.name}: Não existe`, 'cyan');
    }
  }
  
  results.info.push(`Tamanho total do cache: ${formatBytes(totalCacheSize)}`);
  
  // 3. Verificar arquivos corrompidos
  logStep('CORRUPT', 'Verificando arquivos corrompidos...', 'blue');
  
  const corruptedFiles = checkCorruptedFiles('.next');
  if (corruptedFiles.length > 0) {
    results.issues.push(`${corruptedFiles.length} arquivos corrompidos encontrados`);
    log(`❌ ${corruptedFiles.length} arquivos corrompidos encontrados`, 'red');
    
    // Mostrar alguns exemplos
    const examples = corruptedFiles.slice(0, 3);
    for (const file of examples) {
      log(`   - ${file}`, 'red');
    }
    
    if (corruptedFiles.length > 3) {
      log(`   ... e mais ${corruptedFiles.length - 3} arquivos`, 'red');
    }
  } else {
    log('✅ Nenhum arquivo corrompido encontrado', 'green');
  }
  
  // 4. Verificar permissões
  logStep('PERMS', 'Verificando permissões...', 'blue');
  
  const diskSpace = checkDiskSpace();
  if (!diskSpace.available || !diskSpace.writable) {
    results.issues.push('Problemas de permissão ou espaço em disco');
    log('❌ Problemas de permissão ou espaço em disco', 'red');
  } else {
    log('✅ Permissões OK', 'green');
  }
  
  // 5. Verificar dependências
  logStep('DEPS', 'Verificando dependências...', 'blue');
  
  if (!dirExists('node_modules')) {
    results.issues.push('node_modules não encontrado - execute npm install');
    log('❌ node_modules não encontrado', 'red');
  } else {
    const nodeModulesSize = getDirSize('node_modules');
    log(`📦 node_modules: ${formatBytes(nodeModulesSize)}`, 'cyan');
    
    if (nodeModulesSize < 50 * 1024 * 1024) { // < 50MB
      results.warnings.push('node_modules muito pequeno - pode estar incompleto');
      log('⚠️  node_modules pode estar incompleto', 'yellow');
    } else {
      log('✅ node_modules parece completo', 'green');
    }
  }
  
  // 6. Verificar arquivos de lock
  logStep('LOCK', 'Verificando arquivos de lock...', 'blue');
  
  const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
  const existingLocks = lockFiles.filter(file => fileExists(file));
  
  if (existingLocks.length === 0) {
    results.warnings.push('Nenhum arquivo de lock encontrado');
    log('⚠️  Nenhum arquivo de lock encontrado', 'yellow');
  } else if (existingLocks.length > 1) {
    results.warnings.push(`Múltiplos arquivos de lock encontrados: ${existingLocks.join(', ')}`);
    log(`⚠️  Múltiplos arquivos de lock: ${existingLocks.join(', ')}`, 'yellow');
  } else {
    log(`✅ Arquivo de lock encontrado: ${existingLocks[0]}`, 'green');
  }
  
  // Relatório final
  logStep('REPORT', 'Relatório de saúde do cache', 'magenta');
  
  if (results.issues.length > 0) {
    log('\n❌ PROBLEMAS ENCONTRADOS:', 'red');
    results.issues.forEach(issue => log(`  • ${issue}`, 'red'));
  }
  
  if (results.warnings.length > 0) {
    log('\n⚠️  AVISOS:', 'yellow');
    results.warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
  }
  
  if (results.info.length > 0) {
    log('\nℹ️  INFORMAÇÕES:', 'cyan');
    results.info.forEach(info => log(`  • ${info}`, 'cyan'));
  }
  
  // Recomendações
  logStep('RECOMMENDATIONS', 'Recomendações:', 'cyan');
  
  if (results.issues.length > 0) {
    log('🔧 Execute: npm run cache:optimize', 'cyan');
    log('🔧 Execute: npm run recovery (se problemas persistirem)', 'cyan');
  } else if (results.warnings.length > 0) {
    log('🔧 Execute: npm run cache:clear', 'cyan');
  } else {
    log('✅ Cache está saudável!', 'green');
  }
  
  log('💡 Execute este script regularmente para monitorar a saúde do cache', 'cyan');
  
  // Status final
  const status = results.issues.length === 0 ? 'SAUDÁVEL' : 'PROBLEMAS DETECTADOS';
  const statusColor = results.issues.length === 0 ? 'green' : 'red';
  
  logStep('STATUS', `Cache está: ${status}`, statusColor);
  
  return results.issues.length === 0;
}

// Executar verificação
checkCacheHealth().then(isHealthy => {
  process.exit(isHealthy ? 0 : 1);
}).catch(error => {
  log(`❌ Erro durante a verificação: ${error.message}`, 'red');
  process.exit(1);
});
