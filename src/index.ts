// src/index.ts

import { start } from "./commands/startCommand"
import { test } from "./commands/testCommand"
import { newTest } from "./commands/test/newTestCommand"

console.log("👋 Hello world...")

const startBot = () => {
  start()
  test()
  newTest()
}

startBot()
