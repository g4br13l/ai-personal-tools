import { useCallback, useEffect, useRef, useState } from 'react'



export type CliExecutionStreamT = 'stdout' | 'stderr'

export type StatusLogT = {
  type: 'basic' | 'step' | 'highlight' | 'success' | 'error'
  text: string
}

type BasicLogT = StatusLogT & { type: 'basic' }
type StepLogT = StatusLogT & { type: 'step' }
type HighLightLogT = StatusLogT & { type: 'highlight' }
type SuccessLogT = StatusLogT & { type: 'success' }
type ErrorLogT = StatusLogT & { type: 'error' }

export type StatusLogsTypedT = {
  basicLogs: BasicLogT[]
  stepLogs: StepLogT[]
  highlightLogs: HighLightLogT[]
  successLogs: SuccessLogT[]
  errorLogs: ErrorLogT[]
}


const emptyTypedLogs = (): StatusLogsTypedT => ({
  basicLogs: [],
  stepLogs: [],
  highlightLogs: [],
  successLogs: [],
  errorLogs: [],
})


/** Pure split of `statusLogs` by type — safe to call outside React (no hook). */
export function statusLogsToTypedParts(logs: StatusLogT[]): StatusLogsTypedT {
  return logs.reduce<StatusLogsTypedT>((prevLogs, currLog) => ({
    ...prevLogs,
    ...(currLog.type === 'basic' &&
      { basicLogs: [...prevLogs.basicLogs, currLog as BasicLogT] }
    ),
    ...(currLog.type === 'step' &&
      { stepLogs: [...prevLogs.stepLogs, currLog as StepLogT] }
    ),
    ...(currLog.type === 'highlight' &&
      { highlightLogs: [...prevLogs.highlightLogs, currLog as HighLightLogT] }
    ),
    ...(currLog.type === 'success' &&
      { successLogs: [...prevLogs.successLogs, currLog as SuccessLogT] }
    ),
    ...(currLog.type === 'error' &&
      { errorLogs: [...prevLogs.errorLogs, currLog as ErrorLogT] }
    ),
  }), emptyTypedLogs())
}


/** Ordered status banners and process stream lines (stdout/stderr) as they occur. */
export type ExecutionTimelineEntryT =
  | { kind: 'status', log: StatusLogT }
  | { kind: 'stream', line: string }


export type CliStatusT = {
  isRunning: boolean
  executionCompleted: boolean
  executionError: string | null
  executionTimeline: ExecutionTimelineEntryT[]
  statusSummaryRes: string[]
}


type CliStatusHookPropsT = {
  initialStatusMsg?: string
}



/** Flush interval in ms — batches incoming log chunks to reduce render frequency. */
const logFlushIntervalMs = 120


const makeInitialStatus = (): CliStatusT => ({
  isRunning: false,
  executionCompleted: false,
  executionError: null,
  executionTimeline: [],
  statusSummaryRes: [],
})


function chunkToLogLines(chunk: string, streamType: CliExecutionStreamT): string[] {
  return chunk
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `${streamType === 'stdout' ? '•' : '⚠'} ${line}`)
}


/**
 * Centralized state machine for async CLI execution flows.
 * Use this hook to drive running/completed/error status plus streaming output lines.
 */
export function useCliStatus(_props: CliStatusHookPropsT = {}) {

  const [status, setStatus] =
    useState<CliStatusT>(() => makeInitialStatus())

  const pendingLogsRef = useRef<string[]>([])
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)


  const appendStreamLinesToTimeline = useCallback((
    prevTimeline: ExecutionTimelineEntryT[],
    lines: string[],
  ): ExecutionTimelineEntryT[] => {
    if (lines.length === 0) return prevTimeline
    return [
      ...prevTimeline,
      ...lines.map((line) => ({ kind: 'stream' as const, line })),
    ]
  }, [])


  const startFlushTimer = useCallback(() => {
    if (flushTimerRef.current !== null) return
    flushTimerRef.current = setInterval(() => {
      const pending = pendingLogsRef.current
      if (pending.length === 0) return
      pendingLogsRef.current = []
      setStatus((prev) => ({
        ...prev,
        executionTimeline: appendStreamLinesToTimeline(prev.executionTimeline, pending),
      }))
    }, logFlushIntervalMs)
  }, [appendStreamLinesToTimeline])

  const stopFlushTimer = useCallback(() => {
    if (flushTimerRef.current === null) return
    clearInterval(flushTimerRef.current)
    flushTimerRef.current = null
  }, [])


  useEffect(() => {
    return () => stopFlushTimer()
  }, [stopFlushTimer])

  const resetStatus = useCallback(() => {
    stopFlushTimer()
    pendingLogsRef.current = []
    setStatus(makeInitialStatus())
  }, [stopFlushTimer])

  const setStatusLogs = useCallback((logs: StatusLogT[]) => {
    setStatus((prev) => ({
      ...prev,
      executionTimeline: logs.map((log) => ({ kind: 'status', log })),
    }))
  }, [])

  /**
   * Append pipeline phase status rows. Flushes any buffered stdout/stderr **first** so
   * stream output stays before the next banner (e.g. ffmpeg lines after “Generating audio…”).
   */
  const appendPipelineStatusLogs = useCallback((logs: StatusLogT[]) => {
    if (logs.length === 0) return
    setStatus((prev) => {
      const pending = pendingLogsRef.current
      pendingLogsRef.current = []
      const afterStreams = appendStreamLinesToTimeline(prev.executionTimeline, pending)
      const statusTail = logs.map((log) => ({ kind: 'status' as const, log }))
      return {
        ...prev,
        executionTimeline: [...afterStreams, ...statusTail],
      }
    })
  }, [appendStreamLinesToTimeline])

  const clearStatusResult = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      executionCompleted: false,
      executionError: null,
      statusSummaryRes: [],
    }))
  }, [])

  const startStatus = useCallback((logs: StatusLogT[]) => {
    stopFlushTimer()
    pendingLogsRef.current = []
    setStatus({
      isRunning: true,
      executionCompleted: false,
      executionError: null,
      executionTimeline: logs.map((log) => ({ kind: 'status', log })),
      statusSummaryRes: [],
    })
    startFlushTimer()
  }, [startFlushTimer, stopFlushTimer])

  const appendTerminalStdLog = useCallback((chunk: string, streamType: CliExecutionStreamT) => {
    const lines = chunkToLogLines(chunk, streamType)
    if (lines.length === 0) return
    pendingLogsRef.current.push(...lines)
  }, [])

  const markCompletedStatus = useCallback((logs: StatusLogT[], summaryRes: string[] = []) => {
    stopFlushTimer()
    const remaining = pendingLogsRef.current
    pendingLogsRef.current = []
    setStatus((prev) => {
      const afterStreams = appendStreamLinesToTimeline(prev.executionTimeline, remaining)
      const completionTail = logs.map((log) => ({ kind: 'status' as const, log }))
      return {
        ...prev,
        isRunning: false,
        executionCompleted: true,
        executionTimeline: [...afterStreams, ...completionTail],
        statusSummaryRes: summaryRes,
      }
    })
  }, [appendStreamLinesToTimeline, stopFlushTimer])

  const markErrorStatus = useCallback((logs: StatusLogT[], error: string) => {
    stopFlushTimer()
    const remaining = pendingLogsRef.current
    pendingLogsRef.current = []
    setStatus((prev) => {
      const afterStreams = appendStreamLinesToTimeline(prev.executionTimeline, remaining)
      const errTail = logs.map((log) => ({ kind: 'status' as const, log }))
      return {
        ...prev,
        isRunning: false,
        executionCompleted: false,
        executionError: error,
        executionTimeline: [...afterStreams, ...errTail],
      }
    })
  }, [appendStreamLinesToTimeline, stopFlushTimer])

  return {
    status,
    resetStatus,
    setStatusLogs,
    appendPipelineStatusLogs,
    clearStatusResult,
    startStatus,
    appendTerminalStdLog,
    markCompletedStatus,
    markErrorStatus,
  }
}
