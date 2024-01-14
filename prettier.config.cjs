// prettier.config.js
/** @type {import('prettier').Config} */

module.exports = {
  endOfLine: "auto",
  // endOfLine: "CRLF",
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  // singleQuote: false, jsxSingleQuote: true: Это интересный выбор — использовать двойные кавычки для JavaScript и одинарные для JSX. Это вопрос личных предпочтений и единообразия внутри вашей команды.

  tabWidth: 2,
  // tabWidth: 4, попробовать использовать 4 таба
  trailingComma: "none",
  arrowParens: "avoid",
  proseWrap: "always",
  // printWidth: 120, попробовать 120
  // printWidth: 80,
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
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
}
