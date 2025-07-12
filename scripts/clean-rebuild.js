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
    console.error(`❌ Erro ao executar: ${description}`);
    console.error(error.message);
  }
}

// Função para remover diretórios/arquivos
function removeIfExists(pathToRemove, description) {
  if (fs.existsSync(pathToRemove)) {
    console.log(`🗑️  Removendo ${description}...`);
    try {
      if (fs.lstatSync(pathToRemove).isDirectory()) {
        fs.rmSync(pathToRemove, { recursive: true, force: true });
      } else {
        fs.unlinkSync(pathToRemove);
      }
      console.log(`✅ ${description} removido\n`);
    } catch (error) {
      console.error(`❌ Erro ao remover ${description}: ${error.message}\n`);
    }
  } else {
    console.log(`ℹ️  ${description} não encontrado, pulando...\n`);
  }
}

// Etapa 1: Limpar cache e builds
console.log('🔧 Etapa 1: Limpeza de cache e builds');
removeIfExists('.next', 'diretório .next');
removeIfExists('node_modules/.cache', 'cache do node_modules');
removeIfExists('.swc', 'cache do SWC');

// Etapa 2: Limpar dependências
console.log('🔧 Etapa 2: Limpeza de dependências');
removeIfExists('node_modules', 'node_modules');
removeIfExists('package-lock.json', 'package-lock.json');
removeIfExists('yarn.lock', 'yarn.lock');

// Etapa 3: Limpar cache do pnpm
console.log('🔧 Etapa 3: Limpeza do cache pnpm');
runCommand('pnpm store prune', 'Limpando store do pnpm');

// Etapa 4: Reinstalar dependências
console.log('🔧 Etapa 4: Reinstalação de dependências');
runCommand('pnpm install', 'Instalando dependências');

// Etapa 5: Build do projeto
console.log('🔧 Etapa 5: Build do projeto');
runCommand('pnpm run build', 'Fazendo build do projeto');

console.log('🎉 Limpeza e reconstrução concluídas!');
console.log('📝 Próximos passos:');
console.log('   - Execute: pnpm run dev');
console.log('   - Verifique se os erros foram resolvidos');
console.log('   - Monitore o console para novos erros\n');
