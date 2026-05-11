import { file } from 'bun'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { errRes, okRes } from './brand/brandedFns'
import type { ErrResBT, OkResBT } from './brand/BrandedTypes'



type SaveFilePropsT<T extends string> = {
  content: T
  dir: string
  fileName: string
  extension?: '.json' | '.txt'
}


export const videoExtensions = [
  '.3gp', '.avi', '.flv', '.m4v', '.mkv', '.mov', '.mp4', '.mpeg', '.mpg', '.webm', '.wmv',
] as const

export const audioExtensions = [
  '.aac', '.aiff', '.ape', '.flac', '.m4a', '.mp3', '.ogg', '.opus', '.wav', '.wma',
] as const

export const otherFileExtensions = [
  '.json', '.srt',
] as const

export const fileExtensions = [...videoExtensions, ...audioExtensions, ...otherFileExtensions]
export type FileExtensionT = (typeof fileExtensions)[number]


export async function saveFile<T extends string>({
  content,
  dir,
  fileName,
  extension = '.json',
}: SaveFilePropsT<T>) {

  const now = new Date()
  const dateTime = now.toISOString().replace(/[:.]/g, '-')
  const filePath = `${dir}/${fileName}-${dateTime}.${extension}`
  await mkdir(dir, { recursive: true })
  await writeFile(filePath, content, 'utf8')
  return content
}


export function jsonToString(json: object) {
  return JSON.stringify(json, null, 2)
}


type FilePathResT = {
  filePath: string
  fileDir: string
  fileBaseName: string
  fileFullName: string
  fileExt: string
  fileRootDir: string
}


export function pathNormalize(filePath: string): FilePathResT {

  filePath = filePath.replaceAll('\\', '/').trim()
  const { dir, name, base, ext, root } = path.parse(filePath)
  return {
    filePath,
    fileDir: dir,
    fileBaseName: name,
    fileFullName: base,
    fileExt: ext,
    fileRootDir: root,
  }
}
  

export async function pathValidate(
  fPath: string,
  extAllowed: FileExtensionT[] = [...fileExtensions],
): Promise<ErrResBT | OkResBT<FilePathResT>> {

  const { filePath, fileDir, fileBaseName, fileFullName, fileExt, fileRootDir } =
    pathNormalize(fPath)

  if (filePath.length === 0) {
    return errRes({ id: 'file-path-empty-error' })
  }

  const isCorrectExt = extAllowed.some((inputExt: FileExtensionT) => fileExt === inputExt)
  if (!isCorrectExt) {
    return errRes({
      id: 'file-extension-not-allowed-error',
      msg: `Allowed file extension(s): ${extAllowed}`,
    })
  }

  if (!(await file(filePath).exists())) {
    return errRes({ id: `file-does-not-existis-error`, msg: `filePath: ${filePath}` })
  }

  return okRes({ filePath, fileDir, fileBaseName, fileFullName, fileExt, fileRootDir })
}
