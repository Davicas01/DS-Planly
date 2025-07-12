#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

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

function checkDirectory(dir) {
  try {
    const stats = fs.statSync(dir)
    return {
      exists: true,
      size: stats.size,
      modified: stats.mtime
    }
  } catch (error) {
    return {
      exists: false,
      error: error.message
    }
  }
}

function getDirectorySize(dir) {
  try {
    const result = execSync(`du -sh "${dir}" 2>/dev/null || echo "0B"`, { encoding: 'utf8' })
    return result.trim().split('\t')[0]
  } catch (error) {
    return 'N/A'
  }
}

function checkCacheHealth() {
  log('🔍 Verificando saúde do cache Next.js...', 'blue')
  log('=' * 50, 'blue')

  const checks = [
    { name: '.next', path: '.next', critical: false },
    { name: 'node_modules/.cache', path: 'node_modules/.cache', critical: false },
    { name: '.swc', path: '.swc', critical: false },
    { name: 'node_modules', path: 'node_modules', critical: true },
    { name: 'package.json', path: 'package.json', critical: true },
    { name: 'next.config.mjs', path: 'next.config.mjs', critical: true }
  ]

  let issues = []
  
  checks.forEach(check => {
    const result = checkDirectory(check.path)
    const size = result.exists ? getDirectorySize(check.path) : 'N/A'
    
    if (result.exists) {
      log(`✅ ${check.name}: OK (${size})`, 'green')
    } else {
      const level = check.critical ? 'red' : 'yellow'
      const symbol = check.critical ? '❌' : '⚠️'
      log(`${symbol} ${check.name}: ${check.critical ? 'CRÍTICO' : 'AVISO'}`, level)
      
      if (check.critical) {
        issues.push(`${check.name} não encontrado`)
      }
    }
  })

  // Verificar arquivos problemáticos
  log('\n🔍 Verificando arquivos problemáticos...', 'blue')
  
  const problematicPaths = [
    '.next/cache',
    '.next/server',
    '.next/static',
    'node_modules/.cache/webpack',
    'node_modules/.cache/next',
    'node_modules/.cache/swc'
  ]

  problematicPaths.forEach(dir => {
    const result = checkDirectory(dir)
    if (result.exists) {
      const size = getDirectorySize(dir)
      log(`📁 ${dir}: ${size}`, 'yellow')
    }
  })

  // Verificar processes do Next.js
  log('\n🔍 Verificando processos Next.js...', 'blue')
  try {
    const processes = execSync('pgrep -f "next" || echo "Nenhum processo Next.js encontrado"', { encoding: 'utf8' })
    log(`🔄 Processos: ${processes.trim()}`, 'blue')
  } catch (error) {
    log(`🔄 Processos: Erro ao verificar (${error.message})`, 'yellow')
  }

  // Verificar package manager
  log('\n🔍 Verificando package manager...', 'blue')
  const packageManagers = ['pnpm', 'npm', 'yarn']
  packageManagers.forEach(pm => {
    try {
      const version = execSync(`${pm} --version 2>/dev/null || echo "N/A"`, { encoding: 'utf8' })
      log(`📦 ${pm}: ${version.trim()}`, 'green')
    } catch (error) {
      log(`📦 ${pm}: Não instalado`, 'yellow')
    }
  })

  // Verificar espaço em disco
  log('\n🔍 Verificando espaço em disco...', 'blue')
  try {
    const diskSpace = execSync('df -h . 2>/dev/null || echo "N/A"', { encoding: 'utf8' })
    log(`💾 Espaço em disco:\n${diskSpace}`, 'blue')
  } catch (error) {
    log(`💾 Espaço em disco: Erro ao verificar`, 'yellow')
  }

  // Resumo
  log('\n📊 RESUMO DA VERIFICAÇÃO', 'blue')
  log('=' * 30, 'blue')
  
  if (issues.length === 0) {
    log('✅ Nenhum problema crítico encontrado!', 'green')
  } else {
    log(`❌ ${issues.length} problema(s) crítico(s) encontrado(s):`, 'red')
    issues.forEach(issue => log(`   - ${issue}`, 'red'))
  }

  // Recomendações
  log('\n💡 RECOMENDAÇÕES', 'blue')
  log('=' * 20, 'blue')
  
  const recommendations = [
    'Execute "npm run cache:clear" para limpar cache',
    'Execute "npm run fresh:install" se há problemas de dependências',
    'Execute "npm run dev:clean" para desenvolvimento limpo',
    'Execute "npm run build:clean" para build limpo',
    'Monitore o uso de memória durante desenvolvimento'
  ]

  recommendations.forEach(rec => log(`💡 ${rec}`, 'yellow'))

  log('\n🔧 COMANDOS ÚTEIS', 'blue')
  log('=' * 20, 'blue')
  
  const commands = [
    'npm run cache:clear       - Limpa cache básico',
    'npm run cache:clear:full  - Limpa cache completo',
    'npm run fresh:install     - Reinstala dependências',
    'npm run health:check      - Executa esta verificação',
    'npm run dev:clean         - Desenvolvimento limpo',
    'npm run build:clean       - Build limpo'
  ]

  commands.forEach(cmd => log(`🔧 ${cmd}`, 'blue'))
}

// Executar verificação
checkCacheHealth()
