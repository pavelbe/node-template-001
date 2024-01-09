import fs from 'fs';
import path from 'path';

const directory = 'dist';

function updateImportPath(importPath) {
    // Проверяем, содержит ли путь алиас
    if (importPath.startsWith('@/')) {
        // Преобразуем алиас в относительный путь
        // Например, "@/commands/startCommand" становится "./commands/startCommand"
        importPath = importPath.replace('@/', './');
    }
    // Добавляем расширение .mjs, если его нет
    return importPath.endsWith('.mjs') ? importPath : `${importPath}.mjs`;
}

function updateImports(content, filePath) {
    let updatedContent = content;
    const importRegex = /from ["'](\.?\/?.*?)["']/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const oldImport = match[0];
        const importPath = match[1];

        const newImportPath = updateImportPath(importPath);
        const newImport = `from "${newImportPath}"`;

        // Замена старого импорта на новый
        updatedContent = updatedContent.replace(oldImport, newImport);

        // Логирование изменения
        console.log(`Файл: ${filePath}\nИзмененный импорт: ${oldImport} -> ${newImport}`);
    }

    return updatedContent;
}

function renameFilesInDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            renameFilesInDirectory(fullPath);
        } else if (path.extname(file.name) === '.js') {
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