import { Box, Text } from 'ink'
import { useMemo } from 'react'
import stringWidth from 'string-width'



/** Styled fragment of one table line: box-drawing vs header vs body text. */
export type ConsoleTableSegmentT = {
  text: string
  colorRole: 'border' | 'headerText' | 'dataText'
}


/** One rendered line of the ASCII table as Ink segments (borders vs cell text). */
export type ConsoleTableLineT = {
  segments: ConsoleTableSegmentT[]
}


type ConsoleTablePropsT = {
  /** Column titles, left to right. Length defines the number of columns. */
  columnHeaders: string[]
  /** One array per row; each row must have the same length as `columnHeaders`. */
  dataRows: string[][]
  /** Total display width of the table (including border characters). */
  tableWidth: number
}


const horizontalLineChar = '─'
const verticalLineChar = '│'
const topLeftCorner = '┌'
const topRightCorner = '┐'
const bottomLeftCorner = '└'
const bottomRightCorner = '┘'
const leftTeeJunction = '├'
const rightTeeJunction = '┤'
const topTeeJunction = '┬'
const bottomTeeJunction = '┴'
const crossJunction = '┼'


/** Minimum display width for a column (including inner padding spaces). */
const minimumColumnDisplayWidth = 4


function truncateToDisplayWidth(text: string, maxDisplayWidth: number): string {
  if (maxDisplayWidth <= 0) return ''
  if (stringWidth(text) <= maxDisplayWidth) return text
  if (maxDisplayWidth === 1) return '…'
  const ellipsisChar = '…'
  const widthBudgetForText = maxDisplayWidth - stringWidth(ellipsisChar)
  if (widthBudgetForText <= 0) return ellipsisChar
  let result = ''
  for (const character of text) {
    if (stringWidth(result + character) > widthBudgetForText) break
    result += character
  }
  return result + ellipsisChar
}


function padToDisplayWidth(text: string, targetDisplayWidth: number): string {
  let padded = text
  while (stringWidth(padded) < targetDisplayWidth) {
    padded += ' '
  }
  return padded
}


/** If padding overshot (should not happen), trim to exact display width. */
function ensureExactDisplayWidth(text: string, targetDisplayWidth: number): string {
  if (stringWidth(text) <= targetDisplayWidth) {
    return padToDisplayWidth(text, targetDisplayWidth)
  }
  return truncateToDisplayWidth(text, targetDisplayWidth)
}


/** Split `text` into lines so each line has display width ≤ maxInnerWidth. */
function wrapTextToDisplayLines(text: string, maxInnerWidth: number): string[] {
  if (maxInnerWidth <= 0) return ['']
  if (stringWidth(text) <= maxInnerWidth) return [text]
  const wrappedLines: string[] = []
  let remainingText = text
  while (remainingText.length > 0) {
    let currentLine = ''
    let consumedCharacterCount = 0
    for (const character of remainingText) {
      if (stringWidth(currentLine + character) > maxInnerWidth) {
        break
      }
      currentLine += character
      consumedCharacterCount += character.length
    }
    if (consumedCharacterCount === 0) {
      wrappedLines.push(truncateToDisplayWidth(remainingText, maxInnerWidth))
      break
    }
    wrappedLines.push(currentLine)
    remainingText = remainingText.slice(consumedCharacterCount)
  }
  return wrappedLines.length > 0 ? wrappedLines : ['']
}


function formatTableCell(content: string, totalColumnDisplayWidth: number): string {
  const innerContentWidth = Math.max(0, totalColumnDisplayWidth - 2)
  const paddedCore = padToDisplayWidth(
    truncateToDisplayWidth(content, innerContentWidth),
    innerContentWidth,
  )
  return ` ${paddedCore} `
}


function appendEndPaddingToSegments(
  segments: ConsoleTableSegmentT[],
  paddedFullLine: string,
  unpaddedFullLine: string,
): ConsoleTableSegmentT[] {
  if (paddedFullLine.length <= unpaddedFullLine.length) {
    return segments
  }
  const extraPadding = paddedFullLine.slice(unpaddedFullLine.length)
  if (segments.length === 0) {
    return [{ text: extraPadding, colorRole: 'border' }]
  }
  const lastIndex = segments.length - 1
  const lastSegment = segments[lastIndex]
  if (lastSegment === undefined) {
    return [{ text: extraPadding, colorRole: 'border' }]
  }
  return [
    ...segments.slice(0, lastIndex),
    { ...lastSegment, text: lastSegment.text + extraPadding },
  ]
}


function finalizeLineSegments(
  segments: ConsoleTableSegmentT[],
  tableDisplayWidth: number,
): ConsoleTableLineT {
  const unpaddedFullLine = segments.map((segment) => segment.text).join('')
  const paddedFullLine = ensureExactDisplayWidth(unpaddedFullLine, tableDisplayWidth)
  if (paddedFullLine === unpaddedFullLine) {
    return { segments }
  }
  if (paddedFullLine.length > unpaddedFullLine.length) {
    return { segments: appendEndPaddingToSegments(segments, paddedFullLine, unpaddedFullLine) }
  }
  return { segments: [{ text: paddedFullLine, colorRole: 'border' }] }
}


function lineOfBorderOnly(borderText: string, tableDisplayWidth: number): ConsoleTableLineT {
  return finalizeLineSegments([{ text: borderText, colorRole: 'border' }], tableDisplayWidth)
}


function lineOfVerticalBarsAndCells(
  cellTexts: string[],
  columnDisplayWidths: number[],
  columnCount: number,
  cellColorRole: 'headerText' | 'dataText',
  tableDisplayWidth: number,
): ConsoleTableLineT {
  const segments: ConsoleTableSegmentT[] = []
  segments.push({ text: verticalLineChar, colorRole: 'border' })
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const columnWidth = columnDisplayWidths[columnIndex] ?? minimumColumnDisplayWidth
    segments.push({
      text: formatTableCell(cellTexts[columnIndex] ?? '', columnWidth),
      colorRole: cellColorRole,
    })
    segments.push({ text: verticalLineChar, colorRole: 'border' })
  }
  return finalizeLineSegments(segments, tableDisplayWidth)
}


/** Outer border width: top-left + (n−1) tee junctions + top-right = n + 1 characters. */
function borderCharactersOverhead(columnCount: number): number {
  return columnCount + 1
}


function computeMinimumColumnWidths(columnHeaders: string[], dataRows: string[][]): number[] {
  const columnCount = columnHeaders.length
  const minimumWidths: number[] = []
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const headerDisplayWidth = stringWidth(columnHeaders[columnIndex] ?? '')
    const widestCellInColumn = dataRows.reduce((widestSoFar, row) => {
      const cellText = row[columnIndex] ?? ''
      return Math.max(widestSoFar, stringWidth(cellText))
    }, 0)
    const contentWidth = Math.max(headerDisplayWidth, widestCellInColumn)
    minimumWidths.push(contentWidth + 2)
  }
  return minimumWidths
}


function distributeColumnDisplayWidths(
  minimumWidthsPerColumn: number[],
  innerWidthBudget: number,
): number[] {
  const columnCount = minimumWidthsPerColumn.length
  if (columnCount === 0) return []

  const floorWidths = minimumWidthsPerColumn.map((minimumWidth) =>
    Math.max(minimumColumnDisplayWidth, minimumWidth))
  const sumOfFloors = floorWidths.reduce((accumulator, width) => accumulator + width, 0)

  if (sumOfFloors <= innerWidthBudget) {
    const widths = [...floorWidths]
    const extraSpace = innerWidthBudget - sumOfFloors
    const lastColumnIndex = columnCount - 1
    widths[lastColumnIndex] = (widths[lastColumnIndex] ?? 0) + extraSpace
    return widths
  }

  const widths = [...floorWidths]
  while (widths.reduce((accumulator, width) => accumulator + width, 0) > innerWidthBudget) {
    const widestColumnIndex = widths.reduce(
      (bestIndex, width, index) => (width > (widths[bestIndex] ?? 0) ? index : bestIndex),
      0,
    )
    const currentWidestWidth = widths[widestColumnIndex]
    if (currentWidestWidth === undefined || currentWidestWidth <= 1) break
    widths[widestColumnIndex] = currentWidestWidth - 1
  }
  return widths
}


export function buildConsoleTableLines(
  columnHeaders: string[],
  dataRows: string[][],
  tableDisplayWidth: number,
): ConsoleTableLineT[] {
  const columnCount = columnHeaders.length
  if (columnCount === 0) return []

  const normalizedRows = dataRows.map((row) => {
    const padded = [...row]
    while (padded.length < columnCount) padded.push('')
    return padded.slice(0, columnCount)
  })

  const minimumWidthsPerColumn = computeMinimumColumnWidths(columnHeaders, normalizedRows)
  const borderOverhead = borderCharactersOverhead(columnCount)
  const innerWidthBudget = Math.max(0, tableDisplayWidth - borderOverhead)
  const columnDisplayWidths = distributeColumnDisplayWidths(
    minimumWidthsPerColumn,
    innerWidthBudget,
  )

  const outputLines: ConsoleTableLineT[] = []

  const topBorderSegments = columnDisplayWidths
    .map((columnWidth) => horizontalLineChar.repeat(columnWidth))
    .join(topTeeJunction)
  const topBorderLine = `${topLeftCorner}${topBorderSegments}${topRightCorner}`
  outputLines.push(lineOfBorderOnly(topBorderLine, tableDisplayWidth))

  const headerTexts = columnHeaders.map((headerText) => headerText ?? '')
  outputLines.push(
    lineOfVerticalBarsAndCells(
      headerTexts,
      columnDisplayWidths,
      columnCount,
      'headerText',
      tableDisplayWidth,
    ),
  )

  const separatorSegments = columnDisplayWidths
    .map((columnWidth) => horizontalLineChar.repeat(columnWidth))
    .join(crossJunction)
  const separatorLine = `${leftTeeJunction}${separatorSegments}${rightTeeJunction}`
  outputLines.push(lineOfBorderOnly(separatorLine, tableDisplayWidth))

  normalizedRows.forEach((rowCells, dataRowIndex) => {
    const wrappedCellsPerColumn = columnDisplayWidths.map((columnWidth, columnIndex) => {
      const innerWidth = Math.max(0, columnWidth - 2)
      return wrapTextToDisplayLines(rowCells[columnIndex] ?? '', innerWidth)
    })
    const lineCountForRow = Math.max(1, ...wrappedCellsPerColumn.map((lines) => lines.length))

    for (let lineIndex = 0; lineIndex < lineCountForRow; lineIndex += 1) {
      const cellTextsForVisualLine = columnDisplayWidths.map((_columnWidth, columnIndex) => {
        const wrappedLinesForColumn = wrappedCellsPerColumn[columnIndex] ?? []
        return wrappedLinesForColumn[lineIndex] ?? ''
      })
      outputLines.push(
        lineOfVerticalBarsAndCells(
          cellTextsForVisualLine,
          columnDisplayWidths,
          columnCount,
          'dataText',
          tableDisplayWidth,
        ),
      )
    }

    const isLastDataRow = dataRowIndex === normalizedRows.length - 1
    if (!isLastDataRow) {
      outputLines.push(lineOfBorderOnly(separatorLine, tableDisplayWidth))
    }
  })

  const bottomBorderSegments = columnDisplayWidths
    .map((columnWidth) => horizontalLineChar.repeat(columnWidth))
    .join(bottomTeeJunction)
  const bottomBorderLine = `${bottomLeftCorner}${bottomBorderSegments}${bottomRightCorner}`
  outputLines.push(lineOfBorderOnly(bottomBorderLine, tableDisplayWidth))

  return outputLines
}


function inkPropsForSegment(role: ConsoleTableSegmentT['colorRole']) {
  switch (role) {
    case 'border':
      return { color: 'white' as const, dimColor: true }
    case 'headerText':
      return { color: 'cyanBright' as const, bold: true, dimColor: false }
    case 'dataText':
      return { color: 'white' as const, dimColor: false }
  }
}


export function ConsoleTable({ columnHeaders, dataRows, tableWidth }: ConsoleTablePropsT) {
  const tableLines = useMemo(
    () =>
      dataRows.length > 0 && columnHeaders.length > 0
        ? buildConsoleTableLines(columnHeaders, dataRows, tableWidth)
        : [],
    [columnHeaders, dataRows, tableWidth],
  )

  if (columnHeaders.length === 0 || dataRows.length === 0) {
    return null
  }

  return (
    <Box flexDirection="column" flexShrink={0} width={tableWidth}>
      {tableLines.map((tableLine, lineIndex) => (
        <Box key={`console-table-line-${lineIndex}`} width={tableWidth} flexShrink={0}>
          <Text wrap="truncate-end">
            {tableLine.segments.map((segment, segmentIndex) => (
              <Text
                key={`seg-${lineIndex}-${segmentIndex}`}
                {...inkPropsForSegment(segment.colorRole)}
              >
                {segment.text}
              </Text>
            ))}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
