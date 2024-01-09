
## Support the Project

If you find this project helpful, please consider giving it a star on GitHub. Your support is greatly appreciated and motivates me to continue improving and creating more useful projects.

[⭐ Star this project on GitHub!](https://github.com/pavelbe/node-template-001)


## Credits
When using this project, please provide proper credit to the original author, [pavelbe](https://github.com/pavelbe), including a link back to the GitHub repository.

-----------------------------------

# Node Template 001

Это шаблонный проект Node.js, настроенный для использования TypeScript и современных возможностей JavaScript.

## Особенности

- **TypeScript**: Использование TypeScript для типизации и повышения качества кода.
- **ES6 и выше**: Проект настроен на использование ECMAScript 6 и новее.
- **Скрипт `rename-to-mjs_v5.js`**: Автоматизирует процесс переименования `.js` файлов в `.mjs` и обновляет импорты для поддержки модулей ECMAScript.

## Скрипт `rename-to-mjs_v5.js`

Этот скрипт переименовывает файлы `.js` в `.mjs` и обновляет пути импорта в файлах проекта. Он использует асинхронные операции для эффективной обработки файлов и кэширует обновленные пути импорта для повышения производительности.

## Команды Скриптов

Используйте следующие команды для управления проектом:

### npm

- `npm run clean-build`: Очищает каталог `dist` и выполняет сборку проекта.
- `npm run clean`: Очищает каталог `dist` и связанные файлы конфигурации.
- `npm run build`: Выполняет сборку TypeScript проекта.
- `npm start`: Запускает собранное приложение из каталога `dist`.

### pnpm

- `pnpm run clean-build`: Аналогично команде `npm run clean-build`.
- `pnpm run clean`: Аналогично команде `npm run clean`.
- `pnpm run build`: Аналогично команде `npm run build`.
- `pnpm start`: Аналогично команде `npm start`.

## Настройка TypeScript

Файл `tsconfig.json` настроен для поддержки современных стандартов JavaScript и TypeScript, обеспечивая гибкую и мощную систему разработки.

## Установка и Запуск

```bash
1. Клонируйте репозиторий:   git clone https://github.com/pavelbe/node-template-001.git

2. Установите зависимости:
npm install
# or
pnpm install

3. Запустите сборку и запуск проекта:
npm run clean-build
# or
pnpm run clean-build

# or
bun run clean-build

```
Открывайте консоль и введите `npm start` или `pnpm start` для запуска приложения.


--
today 09.01.2024

