import { consoleStreamAdap, errRes, isErrRes, jsonToString, loggerAdap, okRes, pathValidate, tryCatchAsyncWrap, type ErrResBT, type OkResBT } from '@repo/infra/all'
import { file, spawn } from 'bun'
import path from 'node:path'
import { envConfig } from '../../../../../envConfig'
import { makeFastWhisperCommand } from './audioProcess.script'
import type { StatusLogT } from '../../cli/hooks/cliStatus.hook'



type TranscribeDiarizePropsT = {
  audioMonoFullPath: string
  setStatusLogs: (steps: StatusLogT[]) => void
  onStdout?: (value: string) => void
  onStderr?: (value: string) => void
}

export type TranscribeDiarizeResT = Promise<ErrResBT | OkResBT<{
  inputFilePath: string
  outputTranscriptFilePath: string
  stdout: string
}>>



export function audioProcessService() {
  

  const cStream = consoleStreamAdap()
  const logger = loggerAdap()


  const transcribeDiarize = tryCatchAsyncWrap(async ({
    audioMonoFullPath,
    setStatusLogs,
    onStdout,
    onStderr,
  }: TranscribeDiarizePropsT): TranscribeDiarizeResT => {

    setStatusLogs?.([{ type: 'highlight', text: 'Transcribing and diarizing audio...' }])
    const pathValidationRes = await pathValidate(audioMonoFullPath, ['.wav'])
    if (isErrRes(pathValidationRes)) {
      setStatusLogs?.([{ type: 'error', text: jsonToString(pathValidationRes) }])
      return pathValidationRes
    }

    const { filePath, fileDir, fileBaseName } = pathValidationRes.value
    const outputFilePath = path.join(fileDir, `${fileBaseName}_transcribed_diarized.json`)
    const hfToken = envConfig.HUGGING_FACE_TOKEN
    const fastWhisperCommand = makeFastWhisperCommand(filePath, outputFilePath, hfToken)

    const whisperProc = spawn({ cmd: fastWhisperCommand, stdout: 'pipe', stderr: 'pipe' })
    const [stdout, stderr] =
      await cStream.getProcOutput(whisperProc.stdout, whisperProc.stderr, onStdout, onStderr)

    const exitCode = await whisperProc.exited
    const terminalOutput = `${stdout}\n${stderr}`.trim()
    await logger.saveLog({
      logDir: 'fast-whisper-Logs',
      fileBaseName: `${fileBaseName}-insanely-fast-whisper`,
      command: fastWhisperCommand.join(' '),
      stdout,
      stderr,
      exitCode,
    })

    if (exitCode !== 0 || !(await file(outputFilePath).exists())) {
      const error = errRes({
        id: 'insanely_fast_whisper_command_error',
        msg: stderr,
        code: exitCode,
      })
      setStatusLogs?.([{ type: 'error', text: jsonToString(error) }])
      return error
    }

    setStatusLogs?.([{ type: 'success', text: 'transcribeDiarize completed successfully!' }])
    return okRes({
      inputFilePath: filePath,
      outputTranscriptFilePath: outputFilePath,
      stdout: terminalOutput,
    })
    
  }, 'transcribe-diarize-io-error')


  return {
    transcribeDiarize,
  }
}

