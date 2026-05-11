import type { ItemT } from '../../cli/components/ui/selectField'
import type { StatusLogT } from '../../cli/hooks/cliStatus.hook'
import { videoToTextService } from './videoToText.service'



export const conversionTypes = [
  { value: 'transcription-diarize-subtitles', label: 'Transcription, diarize and subtitles' },
  // { value: 'transcription-diarize-summarize', label: 'Transcription, diarize and summarize' },
] as const satisfies ItemT<string>[]

export type ConversionTypeT = typeof conversionTypes[number]
export type ConversionTypeNameT = ConversionTypeT['value']


type VideoToTextCtrlPropsT = {
  videoFullPath: string
  summarizeSkillPath?: string
  setStatusLogs: (steps: StatusLogT[]) => void
  onTerminalProcOutMsg?: (value: string) => void
  onTerminalProcErrMsg?: (value: string) => void
}


export function videoToTextCtrl() {


  async function transcribeDiarizeSubtitle({
    videoFullPath,
    setStatusLogs,
    onTerminalProcOutMsg: onStdout,
    onTerminalProcErrMsg: onStderr,
  }: Omit<VideoToTextCtrlPropsT, 'summarizeSkillPath'>) {

    return videoToTextService().runVideoToTextPipeline({
      videoFullPath,
      setStatusLogs,
      onStdout,
      onStderr,
    })
  }


  return { transcribeDiarizeSubtitle }
}

type VideoToTextCtrlResT = ReturnType<typeof videoToTextCtrl>
export type TranscribeDiarizeSubtitleResT =
  ReturnType<VideoToTextCtrlResT['transcribeDiarizeSubtitle']>


