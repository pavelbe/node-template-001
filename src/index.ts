// src/index.ts

import { start } from '@/commands/startCommand'

import { help } from './commands/helpCommand'

console.log('Hello World! ☺️')

const startBot = () => {
  console.log('ok')
  start()
  help()
}

startBot()
