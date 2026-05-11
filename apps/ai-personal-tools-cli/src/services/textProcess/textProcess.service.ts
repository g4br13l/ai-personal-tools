import { isErrRes, jsonToString, okRes, pathValidate, timeUtils, tryCatchAsyncWrap, type ErrResBT, type OkResBT } from '@repo/infra/all'
import { file, write } from 'bun'
import path from 'node:path'
import type { StatusLogT } from '../../cli/hooks/cliStatus.hook'



type TranscriptDataChunkT = {
  timestamp: [number, number | null]
  text: string
}

type TranscriptDataSpeakersT = {
  speaker: string
} & TranscriptDataChunkT

type TranscriptJsonDataT = {
  speakers: TranscriptDataSpeakersT[]
  chunks: TranscriptDataChunkT[]
}

type JsonTranscriptToSubtitlesPropsT = {
  transcriptionFilePath: string
  setStatusLogs: (steps: StatusLogT[]) => void
  onStdout?: (value: string) => void
}

export type JsonTranscriptToSubtitlesResT = Promise<ErrResBT | OkResBT<{
  inputFilePath: string
  outputSubtitlesFilePath: string
}>>



export function textProcessService() {

  const timeUtl = timeUtils()


  function parseJsonTranscriptionChunksToSubtitles(transcriptionData: TranscriptJsonDataT) {

    let srtBody = ''
    const segments = transcriptionData.speakers

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      if (seg == null) continue
      const startSec = seg.timestamp[0]
      let endSec = seg.timestamp[1]
      if (endSec == null) {
        const nextSeg = segments[i + 1]
        endSec = nextSeg != null ? nextSeg.timestamp[0] : startSec + 2
      }
      if (endSec <= startSec) {
        endSec = startSec + 0.2
      }
      const line = `${seg.speaker}: ${seg.text.trim()}`
      srtBody +=
        `${i + 1}\n` +
        `${timeUtl.secToSrtTimestamp(startSec)} --> ${timeUtl.secToSrtTimestamp(endSec)}\n` +
        `${line}\n\n`
    }

    return srtBody
  }


  const jsonTranscriptToSubtitles = tryCatchAsyncWrap(async ({
    transcriptionFilePath,
    setStatusLogs,
    onStdout: _onStdout,
  }: JsonTranscriptToSubtitlesPropsT): JsonTranscriptToSubtitlesResT => {

    setStatusLogs?.([{ type: 'highlight', text: 'Generating subtitles from transcript...' }])
    const inputPathRes = await pathValidate(transcriptionFilePath, ['.json'])
    if (isErrRes(inputPathRes)) {
      setStatusLogs?.([{ type: 'error', text: jsonToString(inputPathRes) }])
      return inputPathRes
    }

    const { filePath, fileDir, fileBaseName } = inputPathRes.value
    const outputFilePath = path.join(fileDir, `${fileBaseName}_subtitle.srt`)
    const transcriptFile = file(filePath)

    const transcriptJsonData: TranscriptJsonDataT = await transcriptFile.json()
    const srtBody = parseJsonTranscriptionChunksToSubtitles(transcriptJsonData)

    await write(outputFilePath, srtBody)
    const outputPathRes = await pathValidate(outputFilePath, ['.srt'])
    if (isErrRes(outputPathRes)) {
      setStatusLogs?.([{ type: 'error', text: jsonToString(outputPathRes) }])
      return outputPathRes
    }

    setStatusLogs?.([{ type: 'success', text: 'jsonTranscriptToSubtitles completed successfully!' }])
    return okRes({
      inputFilePath: filePath,
      outputSubtitlesFilePath: outputPathRes.value.filePath,
    })

  }, 'json-transcript-to-subtitles-error')


  return { jsonTranscriptToSubtitles }
}


/* const res = await textProcessService().jsonTranscriptToSubtitles({
  transcriptionFilePath: 'C:/Users/gabriel.lima/Videos/Captures/ApowerRec/job-interviews-2026/Interview-with-Everson-for-Nexton-consultancy-on-20-03_2026/captions.sbv',
})
console.dir(res, { depth: 5 }) */
