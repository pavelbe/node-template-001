import fs from 'fs';
import path from 'path';

const directory = 'dist';

if (!fs.existsSync(directory)) {
    console.error('Каталог не найден:', directory);
    process.exit(1);
}

function updateImportPath(importPath) {
    if (importPath.startsWith('@/')) {
        importPath = importPath.replace('@/', './');
    }
    return importPath.endsWith('.mjs') ? importPath : `${importPath}.mjs`;
}

function updateImports(content, filePath) {
    return content.replace(/from ["'](\.?\/?.*?)["']/g, (match, p1) => {
        const newImportPath = updateImportPath(p1);
        console.log(`Файл: ${filePath}\nИзмененный импорт: ${match} -> from "${newImportPath}"`);
        return `from "${newImportPath}"`;
    });
}

function renameFilesInDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            renameFilesInDirectory(fullPath);
        } else if (file.name.endsWith('.js') && !file.name.endsWith('.d.ts') && !file.name.endsWith('.js.map')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const updatedContent = updateImports(content, fullPath);
            const newPath = fullPath.replace('.js', '.mjs');
            fs.writeFileSync(newPath, updatedContent, 'utf8');
            fs.unlinkSync(fullPath);
            console.log(`Переименовано: ${fullPath} -> ${newPath}`);
        }
    });
}

try {
    renameFilesInDirectory(directory);
    console.log('Все файлы успешно переименованы в .mjs и обновлены импорты');
} catch (error) {
    console.error('Произошла ошибка:', error);
}