# Node Template 001

This is a Node.js template project configured to use TypeScript and modern JavaScript features.

## Features
- **TypeScript**: Leveraging TypeScript for type safety and improved code quality.
- **ES6 and Above**: Configured to use ECMAScript 6 and later.
- **Script `rename-to-mjs.js`**: Automates converting `.js` files to `.mjs` and updates imports for ECMAScript modules support.

## Script `rename-to-mjs.js`
The script renames `.js` files to `.mjs` and updates import paths in project files. It uses asynchronous operations for efficient file processing and caches updated import paths for performance improvement.

## Support This Project
If you find this project helpful, please consider giving it a star on GitHub. Your support is greatly appreciated and motivates continuous improvement and development of new useful tools.

[⭐ Star this project on GitHub!](https://github.com/pavelbe/node-template-001)

## Script Commands
Use these commands to manage the project:

### npm
- `npm run clean-build`: Cleans the `dist` directory and performs project build.
- `npm run clean`: Cleans the `dist` directory and related configuration files.
- `npm run build`: Builds the TypeScript project.
- `npm start`: Runs the built application from the `dist` directory.
- `npm run dev`: Starts the project in development mode.

### pnpm
- `pnpm run clean-build`: Equivalent to `npm run clean-build`.
- `pnpm run clean`: Equivalent to `npm run clean`.
- `pnpm run build`: Equivalent to `npm run build`.
- `pnpm start`: Equivalent to `npm start`.
- `pnpm run dev`: Equivalent to `npm run dev`.

## TypeScript Configuration
The `tsconfig.json` file is set up to support modern JavaScript and TypeScript standards, providing a flexible and powerful development environment.

## Installation and Launch
```bash
1. Clone the repository: git clone https://github.com/pavelbe/node-template-001.git

2. Install dependencies:
   npm install
   # or
   pnpm install

3. Run build and launch the project:
   npm run clean-build
   # or
   pnpm run clean-build

4. Start the project in development mode:
   npm run dev
   # or
   pnpm run dev
