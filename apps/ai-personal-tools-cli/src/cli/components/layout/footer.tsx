import { Box, Text } from 'ink'
import { memo } from 'react'
import { type MenuT } from '../../../main'
import { truncateToWidth } from '../../hooks/useTerminalSize.hook'
import type { UiSizeT } from './layout.cli'



type FooterMenuPropsT = {
  menuItems: MenuT[]
  pathname: string
  menuWidth: number
  uiSize: UiSizeT
}


export const FooterMenu = memo(function FooterMenu({
  menuItems,
  pathname,
  menuWidth,
  uiSize,
}: FooterMenuPropsT) {

  const availableWidth = Math.max(20, menuWidth - (uiSize.safeMargin * 2))
  const maxLabelWidth = Math.max(4, Math.floor(availableWidth / menuItems.length) - 4)

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      minWidth="100%"
      backgroundColor="gray"
      borderDimColor
    >
      {menuItems.map((item) => {
        const isMenuItemSelected = pathname === item.path
        const truncatedLabel = truncateToWidth(item.label, maxLabelWidth)

        return (
          <Box
            key={item.path}
            backgroundColor={isMenuItemSelected ? 'cyanBright' : 'gray'}
            paddingX={2}
          >
            <Text color="black">{truncatedLabel}</Text>
          </Box>
        )
      })}
    </Box>
  )
})
