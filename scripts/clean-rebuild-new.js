#!/usr/bin/env node

/**
 * Script avançado para limpar e reconstruir o projeto Next.js
 * Resolve problemas de webpack, cache e dependências
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

console.log('🧹 Iniciando limpeza e reconstrução avançada...\n');

// Função para executar comandos com melhor tratamento de erro
function runCommand(command, description) {
  log(`📋 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} concluído\n`, 'green');
  } catch (error) {
    log(`❌ Erro em ${description}: ${error.message}\n`, 'red');
  }
}

// Função para remover diretórios/arquivos
function removeIfExists(pathToRemove, description) {
  if (fs.existsSync(pathToRemove)) {
    log(`🗑️  Removendo ${description}...`, 'yellow');
    try {
      if (fs.lstatSync(pathToRemove).isDirectory()) {
        fs.rmSync(pathToRemove, { recursive: true, force: true });
      } else {
        fs.unlinkSync(pathToRemove);
      }
      log(`✅ ${description} removido`, 'green');
    } catch (error) {
      log(`❌ Erro ao remover ${description}: ${error.message}`, 'red');
    }
  } else {
    log(`ℹ️  ${description} não existe`, 'blue');
  }
}

// Função para finalizar processos Next.js
function killNextProcesses() {
  log('🔄 Finalizando processos Next.js...', 'yellow');
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    } else {
      execSync('pkill -f "next" || true', { stdio: 'ignore' });
    }
    log('✅ Processos Next.js finalizados', 'green');
  } catch (error) {
    log('ℹ️  Nenhum processo Next.js encontrado', 'blue');
  }
}

// Etapa 1: Finalizar processos
log('🔄 Etapa 1: Finalizando processos...', 'blue');
killNextProcesses();

// Etapa 2: Limpar cache e arquivos temporários
log('\n🧹 Etapa 2: Limpando cache e arquivos temporários...', 'blue');
const pathsToClean = [
  { path: '.next', description: 'Diretório .next' },
  { path: 'node_modules/.cache', description: 'Cache do node_modules' },
  { path: '.swc', description: 'Cache do SWC' },
  { path: 'out', description: 'Diretório out' },
  { path: 'dist', description: 'Diretório dist' },
  { path: '.vercel', description: 'Cache do Vercel' },
  { path: '.turbo', description: 'Cache do Turbo' },
  { path: 'next-env.d.ts', description: 'Arquivo next-env.d.ts' },
  { path: 'tsconfig.tsbuildinfo', description: 'Cache do TypeScript' }
];

pathsToClean.forEach(({ path, description }) => {
  removeIfExists(path, description);
});

// Etapa 3: Limpar cache do npm/yarn/pnpm
log('\n🧹 Etapa 3: Limpando cache do package manager...', 'blue');
runCommand('npm cache clean --force', 'Limpeza do cache npm');

// Detectar e limpar cache do package manager usado
if (fs.existsSync('yarn.lock')) {
  runCommand('yarn cache clean', 'Limpeza do cache yarn');
} else if (fs.existsSync('pnpm-lock.yaml')) {
  runCommand('pnpm store prune', 'Limpeza do cache pnpm');
}

// Etapa 4: Verificar e reparar dependências
log('\n🔧 Etapa 4: Verificando dependências...', 'blue');

// Detectar package manager
let packageManager = 'npm';
if (fs.existsSync('pnpm-lock.yaml')) packageManager = 'pnpm';
else if (fs.existsSync('yarn.lock')) packageManager = 'yarn';

log(`📦 Package manager detectado: ${packageManager}`, 'blue');

// Verificar se package.json existe
if (!fs.existsSync('package.json')) {
  log('❌ package.json não encontrado!', 'red');
  process.exit(1);
}

// Verificar se node_modules existe
if (!fs.existsSync('node_modules')) {
  log('📦 node_modules não encontrado, instalando dependências...', 'yellow');
  
  const installCommand = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install'
  }[packageManager];
  
  runCommand(installCommand, 'Instalação de dependências');
} else {
  log('✅ node_modules encontrado', 'green');
}

// Etapa 5: Verificar configuração do Next.js
log('\n🔧 Etapa 5: Verificando configuração...', 'blue');

// Verificar se next.config.js/mjs existe
const nextConfigFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
const nextConfigExists = nextConfigFiles.some(file => fs.existsSync(file));

if (nextConfigExists) {
  log('✅ Configuração do Next.js encontrada', 'green');
} else {
  log('⚠️  Configuração do Next.js não encontrada', 'yellow');
}

// Etapa 6: Verificar integridade
log('\n🔍 Etapa 6: Verificando integridade...', 'blue');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.next) {
    log('✅ Next.js encontrado nas dependências', 'green');
  } else {
    log('⚠️  Next.js não encontrado nas dependências', 'yellow');
  }
  
  if (packageJson.scripts && packageJson.scripts.dev) {
    log('✅ Script dev encontrado', 'green');
  } else {
    log('⚠️  Script dev não encontrado', 'yellow');
  }
  
} catch (error) {
  log('❌ Erro ao verificar package.json', 'red');
}

// Etapa 7: Finalização
log('\n🎉 Etapa 7: Finalização...', 'blue');
log('✅ Limpeza e verificação concluídas!', 'green');

log('\n📋 Próximos passos recomendados:', 'blue');
log('  1. npm run dev:clean  - Para desenvolvimento limpo', 'yellow');
log('  2. npm run build:clean - Para build limpo', 'yellow');
log('  3. npm run health:check - Para verificar saúde do cache', 'yellow');

log('\n🔧 Se ainda houver problemas:', 'blue');
log('  - npm run fresh:install - Reinstala todas as dependências', 'yellow');
log('  - npm run cache:clear:full - Limpeza completa do cache', 'yellow');

log('\n✨ Script concluído com sucesso!', 'green');
