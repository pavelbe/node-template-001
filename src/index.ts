// src/index.ts

import { start } from "./commands/startCommand"

import { test } from "./commands/testCommand"

console.log("👋 Hello world...")

const startBot = () => {
  start()
  test()
}

startBot()
