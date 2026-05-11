import * as prompt from '@clack/prompts'
import type { SpinnerOptions, SpinnerResult } from '@clack/prompts'
import type { Readable, Writable } from 'node:stream'


/** Generic types */

type CommonOptionsT = {
  input?: Readable
  output?: Writable
  signal?: AbortSignal
  withGuide?: boolean
}

type FormatFnT = (line: string) => string


type BoxAlignmentT = 'left' | 'center' | 'right'
type BoxOptionsT = {
  contentAlign?: BoxAlignmentT
  titleAlign?: BoxAlignmentT
  width?: number | 'auto'
  titlePadding?: number
  contentPadding?: number
  rounded?: boolean
  formatBorder?: (text: string) => string
} & CommonOptionsT


type MessageT = { message: string }


/** Specific types */

type IntroOutroPropsT = {
  title?: string
  opts?: CommonOptionsT
}

export type ReadonlyOptT<T> = T | Readonly<T>


export type SelectPropsT<TValue = unknown> = {
  question: string
  options: ReadonlyOptT<Array<{
    value: TValue
    label: string
    hint?: string
  }>>
}

export type BoxPropsT = Partial<MessageT> & {
  title?: string
  opts?: BoxOptionsT
}

export type NotePropsT = Partial<MessageT> & {
  title?: string
  opts?: CommonOptionsT & FormatFnT
}


export type TextPropsT = MessageT & {
  message: string
  placeholder?: string
  defaultValue?: string
  initialValue?: string
  validate?: (value: string | undefined) => string | Error | undefined
} & CommonOptionsT


type ConfirmOptionsT = CommonOptionsT & MessageT & {
  active?: string
  inactive?: string
  initialValue?: boolean
  vertical?: boolean
}

type SpinnerPropsT = Readonly<SpinnerOptions>



function clackTerminalAdapter() {


  async function intro({ title, opts }: IntroOutroPropsT) {
    prompt.intro(title, opts)
  }

  async function outro({ title, opts }: IntroOutroPropsT) {
    prompt.outro(title, opts)
  }

  async function box({ title, message, opts }: BoxPropsT) {
    prompt.box(message, title, opts)
  }

  async function note({ title, message, opts }: NotePropsT) {

    prompt.note(message, title, opts)
  }

  async function confirm(props: ConfirmOptionsT) {
    return await prompt.confirm(props)
  }

  async function text(props: TextPropsT) {
    return await prompt.text(props) as string
  }


  async function select<TValue>({ question, options }: SelectPropsT<TValue>) {

    const mutableOptions = options.map((option) => ({
      value: option.value as string,
      label: option.label,
      hint: option.hint,
    }))

    const res = await prompt.select({
      message: question,
      initialValue: options[0]?.value as string,
      options: mutableOptions,
    })

    return res as TValue
  }

  function spinner(props: SpinnerPropsT = {}) {
    return prompt.spinner(props) as SpinnerResult
  }


  return { intro, outro, box, note, confirm, text, select, spinner }
}


export const terminal = clackTerminalAdapter()
