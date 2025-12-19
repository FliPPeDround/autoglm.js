import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const __filename = fileURLToPath(new URL('.', import.meta.url))
export const __dirname = dirname(__filename)
