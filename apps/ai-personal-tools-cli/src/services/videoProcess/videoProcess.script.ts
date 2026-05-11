


export function makeFfmpegVideoToAudioCommand(
  inputVideoFullPath: string,
  outputAudioFullPath: string,
) {
  return [
    'ffmpeg',
    '-y',
    '-i',
    inputVideoFullPath,
    '-ar',
    '16000',
    '-ac',
    '1',
    '-c:a',
    'pcm_s16le',
    outputAudioFullPath,
  ]
}
