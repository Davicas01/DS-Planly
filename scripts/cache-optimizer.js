#!/usr/bin/env node

/**
 * Script avançado para otimização de cache do Next.js
 * Remove arquivos corrompidos e otimiza performance
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
║                    CACHE OPTIMIZER v2.0                      ║
║              Next.js Cache Management System                  ║
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

// Função para remover diretório recursivamente
function removeDirectory(dirPath) {
  if (dirExists(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      return true;
    } catch (error) {
      log(`⚠️  Erro ao remover ${dirPath}: ${error.message}`, 'yellow');
      return false;
    }
  }
  return true;
}

// Função para remover arquivo
function removeFile(filePath) {
  if (fileExists(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      log(`⚠️  Erro ao remover ${filePath}: ${error.message}`, 'yellow');
      return false;
    }
  }
  return true;
}

// Função para executar comandos com tratamento de erro
function runCommand(command, description, optional = false) {
  logStep('CMD', description, 'blue');
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    logStep('✓', `${description} - Concluído`, 'green');
    return true;
  } catch (error) {
    if (optional) {
      logStep('⚠️', `${description} - Falhou (opcional)`, 'yellow');
      return false;
    } else {
      logStep('✗', `${description} - Falhou`, 'red');
      throw error;
    }
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

// Lista de diretórios e arquivos para limpeza
const cleanupPaths = [
  // Diretórios de cache Next.js
  { path: '.next', type: 'dir', description: 'Next.js build cache' },
  { path: '.next/cache', type: 'dir', description: 'Next.js runtime cache' },
  { path: '.next/server', type: 'dir', description: 'Next.js server cache' },
  { path: '.next/static', type: 'dir', description: 'Next.js static cache' },
  
  // Diretórios de cache de node_modules
  { path: 'node_modules/.cache', type: 'dir', description: 'Node modules cache' },
  { path: 'node_modules/.cache/webpack', type: 'dir', description: 'Webpack cache' },
  { path: 'node_modules/.cache/@swc', type: 'dir', description: 'SWC cache' },
  { path: 'node_modules/.cache/babel-loader', type: 'dir', description: 'Babel cache' },
  { path: 'node_modules/.cache/terser-webpack-plugin', type: 'dir', description: 'Terser cache' },
  
  // Diretórios de cache SWC
  { path: '.swc', type: 'dir', description: 'SWC compiler cache' },
  { path: '.swc/plugins', type: 'dir', description: 'SWC plugins cache' },
  
  // Diretórios de build
  { path: 'out', type: 'dir', description: 'Next.js export output' },
  { path: 'build', type: 'dir', description: 'Build output' },
  { path: 'dist', type: 'dir', description: 'Distribution files' },
  
  // Diretórios de cache de ferramentas
  { path: '.vercel', type: 'dir', description: 'Vercel cache' },
  { path: '.turbo', type: 'dir', description: 'Turbo cache' },
  { path: '.parcel-cache', type: 'dir', description: 'Parcel cache' },
  { path: '.webpack', type: 'dir', description: 'Webpack cache' },
  
  // Arquivos de cache
  { path: '.tsbuildinfo', type: 'file', description: 'TypeScript build info' },
  { path: 'tsconfig.tsbuildinfo', type: 'file', description: 'TypeScript config build info' },
  { path: '.eslintcache', type: 'file', description: 'ESLint cache' },
  { path: '.stylelintcache', type: 'file', description: 'Stylelint cache' },
  
  // Arquivos de log
  { path: 'npm-debug.log', type: 'file', description: 'NPM debug log' },
  { path: 'yarn-debug.log', type: 'file', description: 'Yarn debug log' },
  { path: 'yarn-error.log', type: 'file', description: 'Yarn error log' },
  { path: 'pnpm-debug.log', type: 'file', description: 'PNPM debug log' },
];

// Função principal de limpeza
async function optimizeCache() {
  logStep('START', 'Iniciando otimização de cache...', 'magenta');
  
  let totalSizeRemoved = 0;
  let filesRemoved = 0;
  
  // Calcular tamanho total antes da limpeza
  const sizeBefore = cleanupPaths.reduce((total, item) => {
    const size = getDirSize(item.path);
    if (size > 0) {
      log(`📁 ${item.description}: ${formatBytes(size)}`, 'cyan');
    }
    return total + size;
  }, 0);
  
  if (sizeBefore > 0) {
    log(`\n📊 Tamanho total do cache: ${formatBytes(sizeBefore)}`, 'yellow');
  }
  
  // Remover arquivos e diretórios
  logStep('CLEAN', 'Removendo arquivos de cache...', 'blue');
  
  for (const item of cleanupPaths) {
    if (item.type === 'dir') {
      if (dirExists(item.path)) {
        const size = getDirSize(item.path);
        if (removeDirectory(item.path)) {
          totalSizeRemoved += size;
          filesRemoved++;
          log(`🗑️  ${item.description} removido (${formatBytes(size)})`, 'green');
        }
      }
    } else if (item.type === 'file') {
      if (fileExists(item.path)) {
        const size = fs.statSync(item.path).size;
        if (removeFile(item.path)) {
          totalSizeRemoved += size;
          filesRemoved++;
          log(`🗑️  ${item.description} removido (${formatBytes(size)})`, 'green');
        }
      }
    }
  }
  
  // Verificar integridade do package.json
  logStep('CHECK', 'Verificando integridade do package.json...', 'blue');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    logStep('✓', 'package.json está válido', 'green');
  } catch (error) {
    logStep('✗', 'package.json está corrompido!', 'red');
    throw new Error('package.json corrompido. Restaure de um backup.');
  }
  
  // Verificar integridade do next.config.js
  logStep('CHECK', 'Verificando integridade do next.config...', 'blue');
  const nextConfigFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
  let nextConfigExists = false;
  
  for (const configFile of nextConfigFiles) {
    if (fileExists(configFile)) {
      nextConfigExists = true;
      logStep('✓', `${configFile} encontrado`, 'green');
      break;
    }
  }
  
  if (!nextConfigExists) {
    logStep('⚠️', 'Nenhum next.config encontrado', 'yellow');
  }
  
  // Limpar cache do sistema operacional (opcional)
  logStep('SYSTEM', 'Limpando cache do sistema...', 'blue');
  
  if (process.platform === 'win32') {
    // Windows
    runCommand('npm cache clean --force', 'Limpando cache do NPM', true);
    runCommand('yarn cache clean', 'Limpando cache do Yarn', true);
    runCommand('pnpm store prune', 'Limpando store do PNPM', true);
  } else {
    // Unix/Linux/macOS
    runCommand('npm cache clean --force', 'Limpando cache do NPM', true);
    runCommand('yarn cache clean', 'Limpando cache do Yarn', true);
    runCommand('pnpm store prune', 'Limpando store do PNPM', true);
  }
  
  // Verificar se o node_modules precisa ser reinstalado
  logStep('DEPS', 'Verificando dependências...', 'blue');
  
  if (!dirExists('node_modules') || !fileExists('node_modules/.package-lock.json')) {
    logStep('⚠️', 'node_modules pode precisar ser reinstalado', 'yellow');
    log('💡 Execute: npm run fresh:install', 'cyan');
  } else {
    logStep('✓', 'node_modules parece estar íntegro', 'green');
  }
  
  // Relatório final
  logStep('REPORT', 'Relatório de otimização', 'magenta');
  log(`📊 Espaço liberado: ${formatBytes(totalSizeRemoved)}`, 'green');
  log(`🗂️  Itens removidos: ${filesRemoved}`, 'green');
  
  if (totalSizeRemoved > 0) {
    log(`✅ Cache otimizado com sucesso!`, 'green');
  } else {
    log(`ℹ️  Cache já estava limpo`, 'blue');
  }
  
  // Recomendações
  logStep('TIPS', 'Recomendações:', 'cyan');
  log('• Execute este script regularmente para manter a performance', 'cyan');
  log('• Use "npm run dev:clean" para desenvolvimento limpo', 'cyan');
  log('• Use "npm run build:clean" para builds limpos', 'cyan');
  log('• Use "npm run recovery" em caso de problemas graves', 'cyan');
  
  logStep('DONE', 'Otimização concluída!', 'green');
}

// Executar otimização
optimizeCache().catch(error => {
  log(`❌ Erro durante a otimização: ${error.message}`, 'red');
  process.exit(1);
});
