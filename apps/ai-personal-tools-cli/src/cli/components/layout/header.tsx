import { Box, Text } from 'ink'
import { memo } from 'react'
import { truncateToWidth } from '../../hooks/useTerminalSize.hook'



type HeaderTitlePropsT = {
  title: string
  maxWidth: number
}


export const HeaderTitle = memo(function HeaderTitle({ title, maxWidth }: HeaderTitlePropsT) {
  return (
    <Box flexDirection="column" minWidth="100%" alignItems="center">
      <Text color="black" bold>{truncateToWidth(title, maxWidth)}</Text>
    </Box>
  )
})
