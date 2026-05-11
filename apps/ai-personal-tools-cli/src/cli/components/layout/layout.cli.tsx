import { Box, useApp, useInput } from 'ink'
import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import type { MenuT } from '../../../main'
import {
  cliSize,
  cliSafeWidth,
  cliTitleMaxWidth,
  useTerminalSize,
} from '../../hooks/useTerminalSize.hook'
import { useInputReady } from '../../hooks/useInputReady.hook'
import { FooterMenu } from './footer'
import { HeaderTitle } from './header'



export type CliFocusAreaT = 'menu' | 'content'

export type CliLayoutContextT = {
  focusArea: CliFocusAreaT
  setFocusArea: (area: CliFocusAreaT) => void
}

const uiSize = cliSize
export type UiSizeT = typeof uiSize



type LayoutCliPropsT = {
  menuItems: MenuT[]
}


export const LayoutCli = ({ menuItems }: LayoutCliPropsT) => {

  const { exit } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { columns } = useTerminalSize()
  const currIndex = menuItems.findIndex((m) => m.path === location.pathname)
  const currentIndex = currIndex >= 0 ? currIndex : 0
  const headerTitle = menuItems[currentIndex]?.title ?? ''
  const [focusArea, setFocusArea] = useState<CliFocusAreaT>('menu')
  const isInputReady = useInputReady()

  const safeWidth = cliSafeWidth(columns)


  // Global exit shortcut should always work.
  useInput((input, key) => {
    if ((key.ctrl && input === 'c') || input === 'q') {
      exit()
    }
  })

  // Menu-only navigation.
  useInput((_input, key) => {

    if (!isInputReady) return

    if (key.leftArrow) {
      const prev = (currentIndex - 1 + menuItems.length) % menuItems.length
      navigate(menuItems[prev]!.path)
    }
    else if (key.rightArrow) {
      const next = (currentIndex + 1) % menuItems.length
      navigate(menuItems[next]!.path)
    }
    else if (key.return) setFocusArea('content')
  }, {
    isActive: focusArea === 'menu',
  })

  // Content-only navigation.
  useInput((_input, key) => {
    if (!isInputReady) return
    if (key.escape) setFocusArea('menu')
  }, {
    isActive: focusArea === 'content',
  })

  const outletContext = useMemo(() => ({ focusArea, setFocusArea }), [focusArea])
  

  return (

    <Box
      flexDirection="column"
      width={safeWidth}
      marginLeft={uiSize.safeMargin}
      paddingX={2}
    >

      {/* Left menu */}
      <Box
        flexDirection="column"
        borderColor="gray"
        borderDimColor
        borderStyle="round"
        marginY={0}
        paddingY={0}
        paddingX={2}
        minWidth={28}
        minHeight={uiSize.minHeight}
      >

        {/* Page content */}
        <Box flexDirection="column" alignItems="stretch">
          <HeaderTitle title={headerTitle} maxWidth={cliTitleMaxWidth(columns)} />
          <Box justifyContent="center" alignItems="flex-start" marginY={1}>
            <Outlet context={outletContext} />
          </Box>
        </Box>

        <FooterMenu
          menuItems={menuItems}
          pathname={location.pathname}
          uiSize={uiSize}
          menuWidth={safeWidth}
        />
      </Box>

    </Box>

  )
}
