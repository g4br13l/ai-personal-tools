


export function consoleStreamAdap() {

  const getOutput = async (
    stream: ReadableStream<Uint8Array> | null,
    onChunk: (value: string) => void,
  ) => {

    if (!stream) return ''

    const reader = stream.getReader()
    const decoder = new TextDecoder()
    const chunks: string[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value === undefined) continue
      const text = decoder.decode(value, { stream: true })
      if (text.length === 0) continue
      chunks.push(text)
      onChunk(text)
    }

    const tail = decoder.decode()
    if (tail.length > 0) {
      chunks.push(tail)
      onChunk(tail)
    }

    return chunks.join('')
  }


  async function getProcOutput(
    stdOut: ReadableStream<Uint8Array> | null,
    stdErr: ReadableStream<Uint8Array> | null,
    onStdout?: (value: string) => void,
    onStderr?: (value: string) => void,
  ) {
    return Promise.all([
      getOutput(stdOut, (value) => {
        if (onStdout !== undefined) onStdout(value)
        else process.stdout.write(value)
      }),
      getOutput(stdErr, (value) => {
        if (onStderr !== undefined) onStderr(value)
        else process.stderr.write(value)
      }),
    ])
  }


  return { getOutput, getProcOutput }
}
