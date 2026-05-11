

const commands: Array<string[]> = [
  ['bun', 'run', '--filter', '@repo/agent', 'exports-clean'],
  ['bun', 'run', '--filter', '@repo/db-ai', 'exports-clean'],
  ['bun', 'run', '--filter', '@repo/core', 'exports-clean'],
  ['bun', 'run', '--filter', '@repo/infra', 'exports-clean'],
]

export const colors = { green: '\x1b[32m', red: '\x1b[31m', reset: '\x1b[0m' }


for (const command of commands) {

  const process = Bun.spawn(command, { stdout: 'inherit', stderr: 'inherit' })

  const exitCode = await process.exited
  if (exitCode !== 0) {
    const commandText = command.join(' ')
    throw new Error(`Command failed (${exitCode}): ${commandText}`)
  }
}

console.log(`${colors.green}exports-clean completed for all workspace packages.${colors.reset}`)
