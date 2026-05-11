# Step 2: Convert the MP4 to WAV (16 kHz, mono, PCM)

This step is mandatory and always runs second.

## Required inputs

- `%VIDEO_PATH%` from Step 1.

## Procedure

Run:

```powershell
ffmpeg -i "%VIDEO_PATH%" -ar 16000 -ac 1 -c:a pcm_s16le "%VIDEO_PATH%_audio.wav"
```

## Flag reference

| Flag | Purpose |
|------|---------|
| `-i` | Input video file |
| `-ar 16000` | Resample to 16 kHz, which Whisper expects |
| `-ac 1` | Convert to mono to reduce transcription drift |
| `-c:a pcm_s16le` | Write uncompressed 16-bit PCM WAV |

## Validation

- The command exits with code `0`.
- `%VIDEO_PATH%_audio.wav` exists.
- The output WAV is mono and approximately 16 kHz.

Do not proceed if any validation check fails.

## Next step

Proceed to [step-3-whisper-transcription.md](step-3-whisper-transcription.md) only after validation passes.
