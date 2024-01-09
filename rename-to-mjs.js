// rename-to-mjs.js (6 ver.)

// rename-to-mjs - renames .js to .mjs and updates imports to support the JavaScript module stack.
// rename-to-mjs - переименовывает .js в .mjs и обновляет импорты для поддержки модульного стека JavaScript.

import { promises as fs } from 'fs'
import path from 'path'

// import messages from './messages.json' with { type: 'json' }

async function loadMessages() {
  const data = await fs.readFile('./messages.json', 'utf-8')
  return JSON.parse(data)
}

const messages = await loadMessages()

const directory = 'dist'
const importPathCache = new Map()
const language = process.argv.includes('--ru') ? 'ru' : 'en'

function getMessage(key, placeholders = {}) {
  let message = messages[language][key]
  Object.keys(placeholders).forEach(placeholder => {
    message = message.replace(`{${placeholder}}`, placeholders[placeholder])
  })
  return message
}

async function updateImportPath(importPath) {
  if (importPathCache.has(importPath)) {
    return importPathCache.get(importPath)
  }

  let updatedPath = importPath
  if (importPath.startsWith('@/')) {
    updatedPath = updatedPath.replace('@/', './')
  }
  updatedPath = updatedPath.endsWith('.mjs')
    ? updatedPath
    : `${updatedPath}.mjs`

  importPathCache.set(importPath, updatedPath)
  return updatedPath
}

async function updateImports(content, filePath) {
  const importRegex = /from ["'](\.?\/?.*?)["']/g
  let matches = [...content.matchAll(importRegex)]

  for (const match of matches) {
    const oldImport = match[0]
    const importPath = match[1]
    const newImportPath = await updateImportPath(importPath)
    const newImport = `from "${newImportPath}"`

    content = content.replace(oldImport, newImport)
    // console.log(
    //   `Файл: ${filePath}\nИзмененный импорт: ${oldImport} -> ${newImport}`
    // )
    console.log(
      getMessage('fileChanged', {
        filePath: filePath,
        oldImport: oldImport,
        newImport: newImport,
      })
    )
  }

  return content
}

async function processFile(fullPath) {
  try {
    let content = await fs.readFile(fullPath, 'utf8')
    content = await updateImports(content, fullPath)
    const newPath = fullPath.replace('.js', '.mjs')
    await fs.writeFile(newPath, content, 'utf8')
    await fs.unlink(fullPath)
    // console.log(`Переименовано: ${fullPath} -> ${newPath}`)
    console.log(
      getMessage('fileRenamed', {
        fullPath: fullPath,
        newPath: newPath,
      })
    )
  } catch (error) {
    // console.error(`Ошибка обработки файла ${fullPath}:`, error)
    console.error(
      getMessage('fileProcessingError', {
        fullPath: fullPath,
        error: error,
      })
    )
  }
}

async function renameFilesInDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  const tasks = files.map(file => {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      return renameFilesInDirectory(fullPath)
    } else if (
      file.name.endsWith('.js') &&
      !file.name.endsWith('.d.ts') &&
      !file.name.endsWith('.js.map')
    ) {
      return processFile(fullPath)
    }
  })
  await Promise.all(tasks)
}

async function main() {
  try {
    await fs.access(directory)
    await renameFilesInDirectory(directory)
    // console.log('Все файлы успешно переименованы в .mjs и обновлены импорты')
    console.log(getMessage('allFilesRenamed'))
  } catch (error) {
    // console.error('Произошла ошибка:', error)
    console.error(getMessage('genericError', { error: error }))
    process.exit(1)
  }
}

main()
  .then(() => {
    // console.log('Скрипт выполнен успешно.')
    console.log(getMessage('scriptCompleted'))
  })
  .catch(error => {
    // console.error('Ошибка выполнения скрипта:', error)
    console.error(getMessage('scriptExecutionError', { error: error }))
    process.exit(1)
  })
