import { Box, Text } from 'ink'
import { useMemo } from 'react'

import { ConsoleTable } from './table'
import { cliOutletContentWidth, useTerminalSize } from '../../hooks/useTerminalSize.hook'



/** One row of the summary table: a label and its value (e.g. file path). */
export type SummaryPathRowT = {
  label: string
  value: string
}


type SummaryPropsT = {
  rows: SummaryPathRowT[]
  tableWidth: number
  title?: string
}


const summaryColumnHeaders = ['Label', 'Value'] as const


export function Summary({ rows, tableWidth, title = 'Output files' }: SummaryPropsT) {
  const { columns } = useTerminalSize()
  const effectiveTableWidth = useMemo(
    () => Math.min(tableWidth, cliOutletContentWidth(columns)),
    [tableWidth, columns],
  )

  const tableDataRows = useMemo(
    () => rows.map((row) => [row.label, row.value]),
    [rows],
  )

  if (rows.length === 0) {
    return null
  }

  return (
    <Box
      flexDirection="column"
      width={effectiveTableWidth}
      minWidth={0}
      flexShrink={0}
    >
      <Box width={effectiveTableWidth} flexShrink={0}>
        <Text bold color="cyanBright" wrap="truncate-end">
          {title}
        </Text>
      </Box>
      <ConsoleTable
        columnHeaders={[...summaryColumnHeaders]}
        dataRows={tableDataRows}
        tableWidth={effectiveTableWidth}
      />
    </Box>
  )
}
