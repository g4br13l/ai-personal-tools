import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { tryCatchAsyncWrap } from '../fp/fpTryCatch.adap'



type SaveLogPropsT = {
  logDir: string
  fileBaseName: string
  command?: string
  stdout?: string
  stderr?: string
  exitCode?: number
}



export function loggerAdap() {

  const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-')
  const safeFileName = (value: string) => value.replace(/[^\w.-]+/g, '_')

  async function saveLogImpl(props: SaveLogPropsT): Promise<string> {

    const logDir = path.join(process.cwd(), '.logs', props.logDir)
    await mkdir(logDir, { recursive: true })
    const fileName = `${safeFileName(props.fileBaseName)}_${timestamp()}.log`
    const logPath = path.join(logDir, fileName)

    const logLines = [
      `Command: ${props.command}`,
      `Exit code: ${props.exitCode}`,
      `Timestamp: ${new Date().toISOString()}`,
      '--- stdout ---',
      props.stdout,
      '--- stderr ---',
      props.stderr,
    ].join('\n')

    await Bun.write(logPath, logLines)
    return logPath
  }


  return {
    saveLog: tryCatchAsyncWrap(saveLogImpl, 'save-log-error'),
  }
}


/* const res = await loggerAdap().saveLog({ logDir: 1, fileBaseName: 'testFile' })
console.dir(res, { depth: 5 }) */

