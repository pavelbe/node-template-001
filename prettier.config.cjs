// prettier.config.js
/** @type {import('prettier').Config} */

module.exports = {
  endOfLine: "auto",
  // endOfLine: "CRLF",
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  arrowParens: "avoid",
  proseWrap: "always",
  printWidth: 120,
  bracketSameLine: false,
  // "bracketSameLine": true, попробовать true - указывает на то, что Prettier должен помещать закрывающую скобку в тот же строку, что и последний атрибут элемента, вместо того чтобы помещать ее на новую строку.
  bracketSpacing: true,
  useTabs: false,
  quoteProps: "as-needed",
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
}
