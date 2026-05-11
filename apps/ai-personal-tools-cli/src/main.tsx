import { render } from 'ink'
import type { JSX } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { LayoutCli } from './cli/components/layout/layout.cli'
import { IndexCli } from './cli/index.cli'
import { WebExtractionCli } from './modules/webExtraction/webExtraction.cli'
import { VideoToTextCli } from './modules/videoToText/videoToText.cli'



export type MenuT = { label: string, path: string, element: JSX.Element, title: string }


export const menuItems: MenuT[] = [
  {
    label: 'Home',
    path: '/',
    element: <IndexCli />,
    title: 'Home',
  },
  {
    label: 'Web Extraction',
    path: '/extract',
    element: <WebExtractionCli />,
    title: 'Web Extraction',
  },
  {
    label: 'Video to text',
    path: '/video_text',
    element: <VideoToTextCli />,
    title: 'Video to Text',
  },
]


function MainCli() {
  return (

    <MemoryRouter>
      <Routes>
        <Route element={<LayoutCli menuItems={menuItems} />}>
          {menuItems.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Route>
      </Routes>
    </MemoryRouter>
    
  )
}

render(<MainCli />, {
  exitOnCtrlC: false,
})
