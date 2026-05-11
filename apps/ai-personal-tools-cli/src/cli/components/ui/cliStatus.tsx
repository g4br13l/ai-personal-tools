import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React, { useMemo, type ComponentProps, type ReactNode } from 'react'
import type { CliStatusT, ExecutionTimelineEntryT, StatusLogT } from '../../hooks/cliStatus.hook'
import { cliTitleMaxWidth, useTerminalSize } from '../../hooks/useTerminalSize.hook'
import { Title } from './title'



type CliStatusPropsT = {
  status: CliStatusT
  showSummary?: (summaryLines: string[]) => ReactNode
}



function statusLogTitleColor(log: StatusLogT): ComponentProps<typeof Text>['color'] {
  switch (log.type) {
    case 'step': return 'cyanBright'
    case 'highlight': return 'cyanBright'
    case 'error': return 'redBright'
    case 'success': return 'greenBright'
    case 'basic': return 'white'
    default: return 'white'
  }
}


function TimelineEntryRow({
  entry,
  sectionTitleWidth,
}: {
  entry: ExecutionTimelineEntryT
  sectionTitleWidth: number
}) {

  if (entry.kind === 'stream') {
    return (
      <Text dimColor>{entry.line}</Text>
    )
  }
  return (
    <Box>
      <Title
        textColor={statusLogTitleColor(entry.log)}
        maxWidth={sectionTitleWidth}
        label={entry.log.text}
      />
    </Box>
  )
}


const CliStatusComponent = ({
  status,
  showSummary,
}: CliStatusPropsT) => {

  const { columns } = useTerminalSize()
  const sectionTitleWidth = useMemo(() => cliTitleMaxWidth(columns), [columns])
  const isDone = !status.isRunning && (status.executionCompleted || !!status.executionError)

  return (

    <Box flexDirection="column">

      {status.isRunning && (
        <Box flexDirection="row">
          <Spinner type="dots12" />
          <Text dimColor> steps</Text>
        </Box>
      )}

      {status.executionTimeline.map((entry, index) => (
        <TimelineEntryRow
          key={`tl-${index}`}
          entry={entry}
          sectionTitleWidth={sectionTitleWidth}
        />
      ))}

      {!status.isRunning &&
        !status.executionCompleted &&
        !status.executionError &&
        status.executionTimeline.length === 0 && (
        <Text dimColor>Waiting for input...</Text>
      )}

      {isDone && status.executionCompleted && (
        showSummary
          ? showSummary(status.statusSummaryRes)
          : (
            <Box flexDirection="column">
              {status.statusSummaryRes.map((line, index) => (
                <Text key={`summary-${index}`} color="cyanBright">
                  {line}
                </Text>
              ))}
            </Box>
          )
      )}

      {status.executionError && (
        <Box flexDirection="column">
          <Text color="red">✗ {status.executionError}</Text>
        </Box>
      )}

    </Box>

  )
}

export const CliStatus = React.memo(CliStatusComponent)
