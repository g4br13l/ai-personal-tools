import { isErrRes } from '@repo/infra/all'
import { Box, Text } from 'ink'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext } from 'react-router'
import { envConfig } from '../../../../../envConfig'
import { Summary, type SummaryPathRowT } from '../../cli/components/ui/summary'
import { CliStatus } from '../../cli/components/ui/cliStatus'
import type { CliLayoutContextT } from '../../cli/components/layout/layout.cli'
import { ReadOnlyField } from '../../cli/components/ui/readOnlyField'
import { SelectField } from '../../cli/components/ui/selectField'
import { TextField } from '../../cli/components/ui/textField'
import { Title } from '../../cli/components/ui/title'
import { useCliStatus, type StatusLogT } from '../../cli/hooks/cliStatus.hook'
import { cliSafeWidth, cliTitleMaxWidth, useTerminalSize } from '../../cli/hooks/useTerminalSize.hook'
import { conversionTypes, videoToTextCtrl, type ConversionTypeNameT, type TranscribeDiarizeSubtitleResT } from './videoToText.ctrl'



type VideoToTextFlowStepT =
  | 'getVideoPath'
  | 'getConversionType'
  | 'getSummarizeSkillPath'
  | 'done'

type RunVideoToTextConversionParamsT = {
  videoFullPath: string
  conversionType: ConversionTypeNameT
  conversionLabel: string
  skillPathForSummary?: string
}

const defaultWhisperModelPath = envConfig.WHISPER_MODEL_PATH

const requiresSummarizeSkill = (conversionTypeName?: ConversionTypeNameT) =>
  conversionTypeName?.includes('summarize') ?? false


type ErrEntryT = { name?: string, msg?: string }


function formatFirstErrResForUser(errors: ErrEntryT[] | undefined): string {
  const first = errors?.[0]
  if (!first) return 'Video to text conversion failed'
  const name = (first.name ?? '').trim()
  const msg = (first.msg ?? '').trim()
  if (!name && !msg) return 'Video to text conversion failed'
  if (!msg) return name
  if (!name) return msg
  const msgLooksLikeNoise =
    msg.length <= 4 && /^[^a-zA-Z0-9]*$/.test(msg)
  if (msgLooksLikeNoise) return name
  return `${name}: ${msg}`
}


export function VideoToTextCli() {

  const [videoPathInput, setVideoPathInput] = useState('')
  const [conversionTypeInput, setConversionTypeInput] = useState<ConversionTypeNameT>()
  const [summarizeSkillPathInput, setSummarizeSkillPathInput] = useState('')
  const [flowStep, setFlowStep] = useState<VideoToTextFlowStepT>('getVideoPath')
  const [conversionOutputRows, setConversionOutputRows] = useState<SummaryPathRowT[] | null>(null)
  const {
    status,
    setStatusLogs,
    appendPipelineStatusLogs,
    clearStatusResult,
    startStatus,
    appendTerminalStdLog,
    markCompletedStatus,
    markErrorStatus,
  } = useCliStatus()

  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const { focusArea } = useOutletContext<CliLayoutContextT>()
  const { columns } = useTerminalSize()
  const sectionTitleWidth = useMemo(() => cliTitleMaxWidth(columns), [columns])
  const outputTableWidth = useMemo(() => cliSafeWidth(columns), [columns])



  const runVideoToTextConversion = useCallback(
    async (props: RunVideoToTextConversionParamsT) => {

      const { videoFullPath, conversionType/* , conversionLabel, skillPathForSummary */ } = props
      const guard = () => mountedRef.current


      const reportStatus = (conversionRes: Awaited<TranscribeDiarizeSubtitleResT>) => {

        if (!guard()) return

        if (isErrRes(conversionRes)) {
          setConversionOutputRows(null)
          markErrorStatus(
            [{ type: 'error', text: 'Video to text conversion failed.' }],
            formatFirstErrResForUser(conversionRes._brand.errors),
          )
          return
        }
        const { videoFullPath, audioMonoFullPath, transcriptionFilePath, subtitlesFilePath } =
          conversionRes.value

        setConversionOutputRows([
          { label: 'Video', value: videoFullPath },
          { label: 'Audio (mono)', value: audioMonoFullPath },
          { label: 'Transcription', value: transcriptionFilePath },
          { label: 'Subtitles', value: subtitlesFilePath },
        ])
        markCompletedStatus(
          [{ text: 'Video to text conversion finished.', type: 'success' }],
          [],
        )
      }
      

      try {

        setConversionOutputRows(null)
        startStatus([
          { type: 'highlight', text: 'Starting video to text conversion...' },
        ])

        const videoToTextCtrlFn = videoToTextCtrl()

        if (conversionType === 'transcription-diarize-subtitles') {
          const subtitlesRes = await videoToTextCtrlFn.transcribeDiarizeSubtitle({
            videoFullPath,
            onTerminalProcOutMsg: (chunk) => {
              if (guard()) appendTerminalStdLog(chunk, 'stdout')
            },
            onTerminalProcErrMsg: (chunk) => {
              if (guard()) appendTerminalStdLog(chunk, 'stderr')
            },
            setStatusLogs: (logs: StatusLogT[]) => {
              appendPipelineStatusLogs(logs)
            },
          })

          reportStatus(subtitlesRes)
          return
        }
        markErrorStatus(
          [{ type: 'error', text: 'Video to text conversion failed.' }],
          `Conversion mode not supported yet: ${conversionType}`,
        )

      }
      catch (err) {
        if (!guard()) return
        setConversionOutputRows(null)
        markErrorStatus(
          [{ type: 'error', text: 'Video to text conversion failed.' }],
          err instanceof Error ? err.message : 'Video to text conversion failed',
        )
      }
    },
    [
      appendPipelineStatusLogs,
      appendTerminalStdLog,
      markCompletedStatus,
      markErrorStatus,
      startStatus,
      setConversionOutputRows,
    ],
  )

  const handleSetVideoPath = useCallback((value: string) => {
    const [firstChar, lastChar] = [value[0], value[value.length - 1]]
    const cleanValue = firstChar === '"' && lastChar === '"' ? value.slice(1, -1) : value
    setVideoPathInput(cleanValue)
    setConversionOutputRows(null)
    clearStatusResult()
    setStatusLogs([{ type: 'basic', text: 'Video path captured.' }])
    setFlowStep('getConversionType')
  }, [clearStatusResult, setStatusLogs])

  const handleSetConversionType = useCallback((value: ConversionTypeNameT) => {
    setConversionTypeInput(value)
    setConversionOutputRows(null)
    clearStatusResult()
    setStatusLogs([{ type: 'basic', text: 'Conversion type selected.' }])
    if (requiresSummarizeSkill(value)) {
      setFlowStep('getSummarizeSkillPath')
      return
    }
    setFlowStep('done')
    const label = conversionTypes.find((item) => item.value === value)?.label ?? value
    void runVideoToTextConversion({
      videoFullPath: videoPathInput,
      conversionType: value,
      conversionLabel: label,
    })
  }, [clearStatusResult, setStatusLogs, videoPathInput, runVideoToTextConversion])

  const handleSetSummarizeSkillPath = useCallback((value: string) => {
    setSummarizeSkillPathInput(value)
    setConversionOutputRows(null)
    clearStatusResult()
    setStatusLogs([{ type: 'basic', text: 'Summarize skill path captured.' }])
    setFlowStep('done')
    if (!conversionTypeInput) return
    const label =
      conversionTypes.find((item) => item.value === conversionTypeInput)?.label ??
      conversionTypeInput
    void runVideoToTextConversion({
      videoFullPath: videoPathInput,
      conversionType: conversionTypeInput,
      conversionLabel: label,
      skillPathForSummary: value,
    })
  }, [
    clearStatusResult,
    setStatusLogs,
    conversionTypeInput,
    videoPathInput,
    runVideoToTextConversion,
  ])


  return (

    <Box flexDirection="column" width="100%" rowGap={1}>

      <ReadOnlyField
        label="Whisper model"
        value={defaultWhisperModelPath}
      />

      <TextField
        label="Video path"
        valueFilled={videoPathInput}
        onSubmitFn={handleSetVideoPath}
        isFocused={focusArea === 'content' && flowStep === 'getVideoPath'}
      />

      <SelectField
        label="Conversion type"
        items={conversionTypes}
        onSelectFn={(item) => handleSetConversionType(item.value)}
        isFocused={focusArea === 'content' && flowStep === 'getConversionType'}
        valueFilled={conversionTypeInput}
      />

      {requiresSummarizeSkill(conversionTypeInput) && (
        <TextField
          label="Summarize skill path"
          valueFilled={summarizeSkillPathInput}
          onSubmitFn={handleSetSummarizeSkillPath}
          isFocused={focusArea === 'content' && flowStep === 'getSummarizeSkillPath'}
        />
      )}

      <Box flexDirection="column" width="100%" minWidth={0}>
        <Box
          flexDirection="column"
          minWidth="100%"
          alignItems="center"
        >
          <Title label="Execution" maxWidth={sectionTitleWidth} />
        </Box>
        <CliStatus
          status={status}
          showSummary={(summaryLines) => {
            if (conversionOutputRows && conversionOutputRows.length > 0) {
              return (
                <Summary rows={conversionOutputRows} tableWidth={outputTableWidth} />
              )
            }
            return (
              <Box flexDirection="column">
                {summaryLines.map((line, index) => (
                  <Text key={`summary-${index}`} color="cyanBright">
                    {line}
                  </Text>
                ))}
              </Box>
            )
          }}
        />
      </Box>

    </Box>

  )
}
