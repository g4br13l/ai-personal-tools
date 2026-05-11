import fs from 'node:fs'
import path from 'node:path'



/**
 * Walks upward from `process.cwd()` and returns the path to the first `.env` file found,
 * or `undefined` if the filesystem root is reached without a match.
 */
function findEnvFile(): string | undefined {
  let dir = process.cwd()
  while (true) {
    const candidate = path.join(dir, '.env')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) return undefined
    dir = parent
  }
}

/**
 * Finds the .env file by walking up from cwd and loads it into process.env.
 * Safe to call multiple times — existing vars are never overwritten.
 */
export function loadEnvFromRoot(): void {

  const envPath = findEnvFile()
  if (!envPath) return

  const content = fs.readFileSync(envPath, 'utf-8')

  for (const line of content.split('\n')) {

    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')

    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) { value = value.slice(1, -1) }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}
