import { Box, Text } from 'ink'
import { memo, useMemo, type ComponentProps } from 'react'
import stringWidth from 'string-width'



const dashChar = '-'

function truncateToDisplayWidth(text: string, maxWidth: number): string {
  if (maxWidth <= 0) return ''
  if (stringWidth(text) <= maxWidth) return text
  if (maxWidth === 1) return '…'
  const ellipsis = '…'
  const budget = maxWidth - stringWidth(ellipsis)
  if (budget <= 0) return ellipsis
  let result = ''
  for (const ch of text) {
    if (stringWidth(result + ch) > budget) break
    result += ch
  }
  return result + ellipsis
}

function buildLine(label: string, maxWidth: number): string {
  if (maxWidth <= 0) return ''
  const title = label.trim()
  let inner = ` ${title} `
  if (stringWidth(inner) > maxWidth) {
    inner = truncateToDisplayWidth(inner, maxWidth)
  }
  const innerW = stringWidth(inner)
  if (innerW >= maxWidth) {
    return inner
  }
  const dashTotal = maxWidth - innerW
  const left = Math.floor(dashTotal / 2)
  const right = dashTotal - left
  return dashChar.repeat(left) + inner + dashChar.repeat(right)
}



type TitlePropsT = {
  label: string
  /** Character width; pass the same bounded width as the layout content area
   * (e.g. `safeWidth - padding`). */
  maxWidth: number
  textColor?: ComponentProps<typeof Text>['color']
}


export const Title = memo(({ label, maxWidth, textColor = 'black' }: TitlePropsT) => {
  const line = useMemo(() => buildLine(label, maxWidth), [label, maxWidth])

  return (
    <Box flexDirection="column" width={maxWidth} minWidth={maxWidth}>
      <Text color={textColor} bold wrap="truncate">
        {line}
      </Text>
    </Box>
  )
})
