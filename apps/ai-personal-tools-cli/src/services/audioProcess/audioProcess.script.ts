

export function makeFastWhisperCommand(
  inputAudioFullPath: string,
  outputTranscriptPath: string,
  hfToken: string,
) {
  return [
    'insanely-fast-whisper',
    '--model-name',
    'distil-whisper/distil-large-v3',
    '--batch-size',
    '4',
    '--file-name',
    inputAudioFullPath,
    '--device-id',
    '0',
    '--transcript-path',
    outputTranscriptPath,
    '--hf-token',
    hfToken,
  ]
}
