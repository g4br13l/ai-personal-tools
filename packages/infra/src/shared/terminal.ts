
import { createInterface } from 'node:readline'



export type InteractiveShellOptionsT = {
  shell?: string
  shellArgs?: string[]
}


export const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  purple: '\x1b[35m',
  reset: '\x1b[0m',
}

export const okTermRes = (msg: string) => `${colors.green}${msg}${colors.reset}`
export const errTermRes = (msg: string) => `${colors.red}${msg}${colors.reset}`
export const colorPurple = (msg: string) => `${colors.purple}${msg}${colors.reset}`


export function defaultTerminal() {

  const rl = createInterface({ input: process.stdin, output: process.stdout })


  const getDefaultShell = () => {

    if (process.platform === 'win32') {
      return {
        shell: process.env.ComSpec ?? 'cmd.exe',
        shellArgs: ['/K'],
      }
    }
    return {
      shell: process.env.SHELL ?? 'bash',
      shellArgs: ['-i'],
    }
  }


  const startInteractiveTerminal = (options: InteractiveShellOptionsT = {}) => {
  
    const defaultShell = getDefaultShell()
    const {
      shell = defaultShell.shell,
      shellArgs = defaultShell.shellArgs,
    } = options

    const proc = Bun.spawn({
      cmd: [shell, ...shellArgs],
      stdin: 'inherit',
      stdout: 'inherit',
      stderr: 'inherit',
    })

    return proc
  }


  const runInteractiveTerminal = async (options?: InteractiveShellOptionsT) => {
    const proc = startInteractiveTerminal(options)
    await proc.exited
  }

  type AskQuestionOptionsT = {
    defaultValue?: string
  }

  const askQuestion = (
    question: string,
    options: AskQuestionOptionsT = {},
  ): Promise<string> => {

    const { defaultValue } = options
    const prompt = defaultValue === undefined
      ? `${question} `
      : `${question} (${defaultValue}) `

    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        const cleaned = String(answer ?? '').trim()
        resolve(cleaned.length > 0 ? cleaned : (defaultValue ?? ''))
      })
    })
  }

  const close = () => rl.close()

  return { runInteractiveTerminal, askQuestion, close }
}



