import type { SpinnerResult } from '@clack/prompts'
import { webExtractionService } from './webExtraction.service'



export const extractionDepth = [
  { value: 'pageOnly', label: 'Extract only a page' } as const,
  { value: 'subpages', label: 'Extract page and subpages' } as const,
]

export type ExtractionDepthItemT = typeof extractionDepth[number]
export type ExtractionDepthValueT = ExtractionDepthItemT['value']



type WebExtractionCtrlPropsT = {
  extDepthValue: ExtractionDepthValueT
  url: string
  onProgress?: (msg: string) => void
}


export async function WebExtractionCtrl({
  extDepthValue,
  url,
  onProgress,
}: WebExtractionCtrlPropsT) {

  const spinner = {
    start: (msg?: string) => onProgress?.(msg ?? 'Starting...'),
    stop: (msg?: string) => onProgress?.(msg ?? 'Done'),
    message: (msg?: string) => onProgress?.(msg ?? ''),
  } as unknown as SpinnerResult

  if (extDepthValue === 'subpages') {
    return await webExtractionService().extractPageAndSubPages(url, spinner)
  }

  const single = await webExtractionService().extractPage(url, spinner)
  return [single]

}
