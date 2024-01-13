// rename-to-mjs.js (7 ver.)

// rename-to-mjs - renames .js to .mjs and updates imports to support the JavaScript module stack.
// rename-to-mjs - переименовывает .js в .mjs и обновляет импорты для поддержки модульного стека JavaScript.

import { promises as fs } from "fs"
import path from "path"

async function loadMessages() {
  const data = await fs.readFile("./messages.json", "utf-8")
  return JSON.parse(data)
}

const messages = await loadMessages()

const directory = "dist"
const importPathCache = new Map()
const language = process.argv.includes("--ru") ? "ru" : "en"

function getMessage(key, placeholders = {}) {
  let message = messages[language][key]
  Object.keys(placeholders).forEach((placeholder) => {
    message = message.replace(`{${placeholder}}`, placeholders[placeholder])
  })
  return message
}

async function updateImportPath(importPath, currentFilePath) {
  if (importPath.startsWith("@/")) {
    importPath = importPath.slice(2) // Удаляем '@/'
  }

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
    "stream",
    "process",
    "net",
    "module",
    "buffer",
    "zlib",
  ]

  if (builtInModules.includes(importPath)) {
    return importPath
  }

  let updatedPath = importPath
  if (importPath.startsWith("./") || importPath.startsWith("../")) {
    const dir = path.dirname(currentFilePath)
    updatedPath = path.resolve(dir, importPath)
    updatedPath = path.relative(directory, updatedPath)
    updatedPath = updatedPath.replace(/\\/g, "/")
    if (!updatedPath.startsWith("./") && !updatedPath.startsWith("../")) {
      updatedPath = "./" + updatedPath
    }
    updatedPath += updatedPath.endsWith(".mjs") ? "" : ".mjs"
  } else {
    updatedPath = `./${importPath}.mjs`
  }

  importPathCache.set(importPath, updatedPath)
  return updatedPath
}

async function updateImports(content, filePath) {
  const importRegex = /from ["'](\.?\/?.*?)["']/g
  let matches = [...content.matchAll(importRegex)]

  for (const match of matches) {
    const oldImport = match[0]
    const importPath = match[1]
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
  }
}

async function renameFilesInDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  const tasks = files.map((file) => {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      return renameFilesInDirectory(fullPath)
    } else if (
      file.name.endsWith(".js") &&
      !file.name.endsWith(".d.ts") &&
      !file.name.endsWith(".js.map")
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
    console.log(getMessage("allFilesRenamed"))
  } catch (error) {
    console.error(getMessage("genericError", { error }))
    process.exit(1)
  }
}

main()
  .then(() => console.log(getMessage("scriptCompleted")))
  .catch((error) => {
    console.error(getMessage("scriptExecutionError", { error }))
    process.exit(1)
  })
