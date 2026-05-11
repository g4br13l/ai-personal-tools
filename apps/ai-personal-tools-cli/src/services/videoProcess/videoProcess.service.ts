import { consoleStreamAdap, errRes, isErrRes, jsonToString, loggerAdap, okRes, pathValidate, tryCatchAsyncWrap, type ErrResBT, type OkResBT } from '@repo/infra/all'
import { spawn } from 'bun'
import type { StatusLogT } from '../../cli/hooks/cliStatus.hook'
import { makeFfmpegVideoToAudioCommand } from './videoProcess.script'



type VideoToAudioMonoPropsT = {
  videoFullPath: string
  setStatusLogs: (steps: StatusLogT[]) => void
  onStdout?: (value: string) => void
  onStderr?: (value: string) => void
}

export type VideoToAudioMonoResT = Promise<ErrResBT | OkResBT<{
  outputAudioFilePath: string
}>>



export function videoProcessService() {

  const cStream = consoleStreamAdap()
  const logger = loggerAdap()


  const videoToAudioMono = tryCatchAsyncWrap(async ({
    videoFullPath,
    setStatusLogs,
    onStdout,
    onStderr,
  }: VideoToAudioMonoPropsT): VideoToAudioMonoResT => {

    setStatusLogs?.([{ type: 'highlight', text: 'Generating audio from video...' }])
    const pathValidRes = await pathValidate(videoFullPath, ['.mp4'])
    if (isErrRes(pathValidRes)) {
      setStatusLogs?.([{ type: 'error', text: jsonToString(pathValidRes) }])
      return pathValidRes
    }

    const { fileDir, fileBaseName } = pathValidRes.value
    const outputFile = `${fileDir}/${fileBaseName}_audio_mono_16kHz.wav`

    const ffmpegCommand = makeFfmpegVideoToAudioCommand(videoFullPath, outputFile)
    const ffmpegProc = spawn({ cmd: ffmpegCommand, stdout: 'pipe', stderr: 'pipe' })

    const [stdout, stderr] =
      await cStream.getProcOutput(ffmpegProc.stdout, ffmpegProc.stderr, onStdout, onStderr)

    const exitCode = await ffmpegProc.exited
    await logger.saveLog({
      logDir: 'ffmpeg-logs',
      fileBaseName: `${fileBaseName}-ffmpeg`, 
      command: ffmpegCommand.join(' '),
      stdout, 
      stderr, 
      exitCode,
    })

    if (exitCode !== 0) {
      const error = errRes({ id: 'ffmpeg_command_error', msg: stderr, code: exitCode })
      setStatusLogs?.([{ type: 'error', text: jsonToString(error) }])
      return error
    }

    const outputPathValidRes = await pathValidate(outputFile, ['.wav'])
    if (isErrRes(outputPathValidRes)) {
      setStatusLogs?.([{ type: 'error', text: jsonToString(outputPathValidRes) }])
      return outputPathValidRes
    }
    setStatusLogs?.([{ type: 'success', text: 'videoToAudioMono completed successful!' }])
    return okRes({ outputAudioFilePath: outputPathValidRes.value.filePath })

  }, 'video-to-audio-mono-error')


  return {
    videoToAudioMono,
  }
}



/* const videoToAudioMonoRes = await videoProcessService().videoToAudioMono({
  videoFullPath: String.raw`C:\Users\gabriel.lima\Videos\Captures\ApowerRec\job-interviews-2026\interview-with-Castro-for-uber-25-03-2026\interview-with-Castro-for-uber-25-03-2026_audio_mono_16kHz_transcribed_diarized_subtitle.srt`,
})
console.dir(videoToAudioMonoRes, { depth: 5 }) */
