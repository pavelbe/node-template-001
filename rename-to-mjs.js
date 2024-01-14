// rename-to-mjs.js (8 ver.)

// rename-to-mjs - renames .js to .mjs and updates imports to support the JavaScript module stack.
// rename-to-mjs - переименовывает .js в .mjs и обновляет импорты для поддержки модульного стека JavaScript.

import { promises as fs } from "fs"
import path from "path"
import inquirer from "inquirer"

const directory = path.resolve("dist")
const importPathCache = new Map()
const language = process.argv.includes("--ru") ? "ru" : "en"
let messages

async function loadMessages() {
  const data = await fs.readFile(path.resolve("./messages.json"), "utf-8")
  messages = JSON.parse(data)
}

function getMessage(key, placeholders = {}) {
  let message = messages[language][key]
  Object.keys(placeholders).forEach((placeholder) => {
    message = message.replace(`{${placeholder}}`, placeholders[placeholder])
  })
  return message
}

// Список стандартных библиотек, импорты для которых не должны изменяться
const builtInModules = [
  "fs",
  "path",
  "os",
  "http",
  "https",
  "url",
  "querystring",
  "stream",
  "util",
  "crypto",
  "puppeteer",
  "axios",
  "process",
  "net",
  "module",
  "buffer",
  "zlib",
  "inquirer",
]

async function updateImportPath(importPath, currentFilePath) {
  if (importPathCache.has(importPath)) {
    return importPathCache.get(importPath)
  }

  // Проверяем, является ли импорт стандартной библиотекой
  if (builtInModules.includes(importPath)) {
    importPathCache.set(importPath, importPath)
    return importPath
  }

  let updatedPath = importPath
  if (importPath.startsWith("@/")) {
    // Преобразуем алиас в относительный путь относительно текущего файла
    const aliasTarget = path.join(directory, importPath.slice(2))
    updatedPath = path.relative(path.dirname(currentFilePath), aliasTarget)
  }

  if (!updatedPath.startsWith(".")) {
    updatedPath = "./" + updatedPath
  }

  updatedPath = updatedPath.replace(/\\/g, "/")
  if (!updatedPath.endsWith(".mjs")) {
    updatedPath += ".mjs"
  }

  importPathCache.set(importPath, updatedPath)
  return updatedPath
}

async function updateImports(content, filePath) {
  const importRegex = /from\s+["']([^"']+)["']/g
  let matches
  while ((matches = importRegex.exec(content)) !== null) {
    const oldImport = matches[0]
    const importPath = matches[1]
    const newImportPath = await updateImportPath(importPath, filePath)
    const newImport = `from "${newImportPath}"`
    content = content.replace(oldImport, newImport)
    console.log(
      getMessage("fileChanged", {
        filePath: filePath,
        oldImport: oldImport,
        newImport: newImport,
      }),
    )
  }
  return content
}

async function processFile(fullPath) {
  try {
    let content = await fs.readFile(fullPath, "utf8")
    content = await updateImports(content, fullPath)
    const newPath = fullPath.replace(/\.js$/, ".mjs")
    await fs.writeFile(newPath, content, "utf8")
    await fs.unlink(fullPath)
    console.log(getMessage("fileRenamed", { fullPath, newPath }))
  } catch (error) {
    console.error(getMessage("fileProcessingError", { fullPath, error }))
    throw error // Прерываем выполнение текущей задачи
  }
}

async function renameFilesInDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      await renameFilesInDirectory(fullPath)
    } else if (
      file.name.endsWith(".js") &&
      !file.name.endsWith(".d.ts") &&
      !file.name.endsWith(".js.map")
    ) {
      await processFile(fullPath)
    }
  }
}

async function main() {
  try {
    await loadMessages()
    await fs.access(directory, fs.constants.W_OK)
    await renameFilesInDirectory(directory)
    console.log(getMessage("allFilesRenamed"))
  } catch (error) {
    console.error(getMessage("genericError", { error }))
    process.exit(1)
  }
}

main()
  .then(() => console.log(getMessage("scriptCompleted")))
  .catch((error) => {
    console.error(getMessage("scriptExecutionError", { error: error.message }))
    process.exit(1)
  })
