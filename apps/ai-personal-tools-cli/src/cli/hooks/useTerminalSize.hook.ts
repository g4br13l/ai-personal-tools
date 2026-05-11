import { useStdout } from 'ink'



export const terminalDefaults = {
  columns: 80,
  rows: 24,
}

export const truncateToWidth = (text: string, maxWidth: number) => {
  if (maxWidth <= 0) return ''
  if (text.length <= maxWidth) return text
  if (maxWidth === 1) return '…'
  return `${text.slice(0, maxWidth - 1)}…`
}

/** Same numbers as `LayoutCli` outer shell (`uiSize`). */
export const cliSize = {
  safeMargin: 1,
  maxWidth: 110,
  minWidth: 64,
  minHeight: 18,
} as const

export type CliSizeT = typeof cliSize

/**
 * Usable width inside horizontal margins. Capped at the real terminal width so Yoga
 * never lays out wider than the TTY (which can abort the layout WASM).
 */
export function cliSafeWidth(columns: number): number {
  const available = Math.max(1, columns - cliSize.safeMargin * 2)
  const ideal = Math.min(
    cliSize.maxWidth,
    Math.max(cliSize.minWidth, available),
  )
  return Math.min(available, ideal)
}

/** Width for `HeaderTitle` and `Title` inside `LayoutCli` (matches `safeWidth - 8` clamp). */
export function cliTitleMaxWidth(columns: number): number {
  const safe = cliSafeWidth(columns)
  const desired = Math.max(12, safe - 8)
  return Math.min(safe, desired)
}

/**
 * Usable width for route content inside `LayoutCli` (e.g. `Summary` monospace tables).
 *
 * Subtracts:
 * - outer shell `paddingX={2}` (×2),
 * - inner menu `borderStyle="round"` (left + right border columns),
 * - inner menu `paddingX={2}` (×2).
 *
 * So the table width matches the real `Outlet` column, not only `cliSafeWidth - outerPadding`.
 */
export function cliOutletContentWidth(columns: number): number {
  const outerPaddingX = 2
  const innerMenuPaddingX = 2
  const menuBorderCols = 2
  const safe = cliSafeWidth(columns)
  return Math.max(
    4,
    safe - outerPaddingX * 2 - menuBorderCols - innerMenuPaddingX * 2,
  )
}

export const useTerminalSize = () => {
  const { stdout } = useStdout()

  if (!stdout?.isTTY) {
    return terminalDefaults
  }

  return {
    columns: stdout.columns ?? terminalDefaults.columns,
    rows: stdout.rows ?? terminalDefaults.rows,
  }
}
