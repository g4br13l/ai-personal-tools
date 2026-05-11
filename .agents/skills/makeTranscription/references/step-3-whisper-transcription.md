# Step 3: Generate Transcription with Whisper

This step is mandatory and always runs third.

## Required inputs

- `%VIDEO_PATH%_audio.wav` from Step 2.
- `%VIDEO_LANG%` from Step 1.

## Procedure

Run:

```powershell
whisper -m "C:/ai/models/ggml-large-v3-turbo.bin" -f "%VIDEO_PATH%_audio.wav" -l %VIDEO_LANG% -bs 5 -osrt --prompt "Transcription of an interview, job interview, or technical software development discussion."
```

## Flag reference

| Flag | Purpose |
|------|---------|
| `-m` | Path to the local Whisper model file |
| `-f` | Input audio file created in Step 2 |
| `-l %VIDEO_LANG%` | Force transcription language such as `en` or `pt` |
| `-bs 5` | Beam size 5 to improve accuracy |
| `-osrt` | Write an `.srt` subtitle file |
| `--prompt "..."` | Domain hint to improve technical vocabulary |

> Note on `--vad`: leave it disabled by default because some builds produce timestamp misalignment. Re-enable it only if the transcript includes long silence artifacts.

## Validation

- Whisper exits with code `0`.
- `%VIDEO_PATH%_audio.srt` exists next to the audio file.
- The `.srt` has sequential, increasing timestamps.
- The first and last subtitle timestamps roughly match the spoken start and end of the audio.

Do not proceed if any validation check fails.

## Next step

Proceed to [step-4-speaker-inference.md](step-4-speaker-inference.md) only after validation passes.
