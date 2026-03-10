import js from '@eslint/js'
import globals from 'globals'
import unusedImports from 'eslint-plugin-unused-imports'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactEslint from "eslint-plugin-react"
import { defineConfig, globalIgnores } from 'eslint/config'

import RULES from './.eslint-rules'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      "unused-imports": "unusedImports"
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactEslint.configs.recommended
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...RULES,
      "arrow-body-style": ["error"]
    }
  },
])
