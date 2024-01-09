// src/index.ts

import {help} from "./commands/helpCommand";
import {start} from "@/commands/startCommand";


console.log("Hello World!")

const startBot = () => {
    console.log("Hello World!2")
    start()
    help()
}


startBot()