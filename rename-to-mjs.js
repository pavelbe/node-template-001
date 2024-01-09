// rename-to-mjs.js (5 ver.)

// rename-to-mjs_v5 - renames .js to .mjs and updates imports to support the JavaScript module stack.
// rename-to-mjs_v5 - переименовывает .js в .mjs и обновляет импорты для поддержки модульного стека JavaScript.

import { promises as fs } from 'fs';
import path from 'path';

const directory = 'dist';
const importPathCache = new Map();

async function updateImportPath(importPath) {
    if (importPathCache.has(importPath)) {
        return importPathCache.get(importPath);
    }

    let updatedPath = importPath;
    if (importPath.startsWith('@/')) {
        updatedPath = updatedPath.replace('@/', './');
    }
    updatedPath = updatedPath.endsWith('.mjs') ? updatedPath : `${updatedPath}.mjs`;

    importPathCache.set(importPath, updatedPath);
    return updatedPath;
}

async function updateImports(content, filePath) {
    const importRegex = /from ["'](\.?\/?.*?)["']/g;
    let matches = [...content.matchAll(importRegex)];

    for (const match of matches) {
        const oldImport = match[0];
        const importPath = match[1];
        const newImportPath = await updateImportPath(importPath);
        const newImport = `from "${newImportPath}"`;

        content = content.replace(oldImport, newImport);
        console.log(`Файл: ${filePath}\nИзмененный импорт: ${oldImport} -> ${newImport}`);
    }

    return content;
}

async function processFile(fullPath) {
    try {
        let content = await fs.readFile(fullPath, 'utf8');
        content = await updateImports(content, fullPath);
        const newPath = fullPath.replace('.js', '.mjs');
        await fs.writeFile(newPath, content, 'utf8');
        await fs.unlink(fullPath);
        console.log(`Переименовано: ${fullPath} -> ${newPath}`);
    } catch (error) {
        console.error(`Ошибка обработки файла ${fullPath}:`, error);
    }
}

async function renameFilesInDirectory(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const tasks = files.map(file => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            return renameFilesInDirectory(fullPath);
        } else if (file.name.endsWith('.js') && !file.name.endsWith('.d.ts') && !file.name.endsWith('.js.map')) {
            return processFile(fullPath);
        }
    });
    await Promise.all(tasks);
}

async function main() {
    try {
        await fs.access(directory);
        await renameFilesInDirectory(directory);
        console.log('Все файлы успешно переименованы в .mjs и обновлены импорты');
    } catch (error) {
        console.error('Произошла ошибка:', error);
        process.exit(1);
    }
}

main()
    .then(() => console.log('Скрипт выполнен успешно.'))
    .catch((error) => {
        console.error('Ошибка выполнения скрипта:', error);
        process.exit(1);
    });