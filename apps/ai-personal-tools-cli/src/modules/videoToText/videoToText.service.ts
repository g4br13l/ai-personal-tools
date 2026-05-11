import { fnPipeAsync, isErrRes, okRes, pipeStep, tryCatchAsyncWrap } from '@repo/infra/all'
import type { StatusLogT } from '../../cli/hooks/cliStatus.hook'
import { audioProcessService } from '../../services/audioProcess/audioProcess.service'
import { textProcessService } from '../../services/textProcess/textProcess.service'
import { videoProcessService } from '../../services/videoProcess/videoProcess.service'



type TranscribeDiarizeSubtitlePropsT = {
  videoFullPath: string
  setStatusLogs: (steps: StatusLogT[]) => void
  onStdout?: (value: string) => void
  onStderr?: (value: string) => void
}

type TranscribeDiarizeSubtitlePipeDataT = {
  videoFullPath: string
  audioMonoFullPath: string
  transcriptionFilePath: string
  subtitlesFilePath: string
  setStatusLogs: (steps: StatusLogT[]) => void
  onStdout?: (value: string) => void
  onStderr?: (value: string) => void
}



export function videoToTextService() {
  

  const runVideoToTextPipeline = tryCatchAsyncWrap(async ({
    videoFullPath,
    setStatusLogs,
    onStdout,
    onStderr,
  }: TranscribeDiarizeSubtitlePropsT) => {
    

    const initialValues = {
      videoFullPath,
      setStatusLogs,
      onStdout,
      onStderr,
      audioMonoFullPath: '',
      transcriptionFilePath: '',
      subtitlesFilePath: '',
    } satisfies TranscribeDiarizeSubtitlePipeDataT


    const pipelineRes = await fnPipeAsync<TranscribeDiarizeSubtitlePipeDataT>(initialValues)(
      

      async (props) => pipeStep(
        await videoProcessService().videoToAudioMono(props),
        (v) => okRes({ ...props, audioMonoFullPath: v.outputAudioFilePath }),
      ),

      async (props) => pipeStep(
        await (async () => audioProcessService().transcribeDiarize(props))(),
        (v) => okRes({ ...props, transcriptionFilePath: v.outputTranscriptFilePath }),
      ),

      async (props) => pipeStep(
        await (async () => textProcessService().jsonTranscriptToSubtitles(props))(),
        (v) => okRes({ ...props, subtitlesFilePath: v.outputSubtitlesFilePath }),
      ),

      (props) => okRes(props),

    )

    if (isErrRes(pipelineRes)) return pipelineRes
    return pipelineRes.value


  }, 'transcribe_diarize-from-video')


  return { runVideoToTextPipeline }
}

