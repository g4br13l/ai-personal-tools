# Step 4: Create Speaker-Labeled Transcript

This step is mandatory and always runs fourth.

## Required inputs

- `%VIDEO_PATH%_audio.srt` from Step 3.

## Procedure

### 1. Flatten the `.srt` into `%VIDEO_PATH%_transcript_flat.txt`

Run:

```powershell
$SrtPath = "%VIDEO_PATH%_audio.srt"
$FlatPath = "%VIDEO_PATH%_transcript_flat.txt"

$entries = [regex]::Split((Get-Content $SrtPath -Raw -Encoding UTF8).Trim(), '\r?\n\r?\n+') | Where-Object { $_.Trim() }
$flatLines = foreach ($entry in $entries) {
    $lines = $entry -split '\r?\n' | Where-Object { $_.Trim() }
    if ($lines.Count -ge 3 -and $lines[1] -match '^(\d{2}:\d{2}:\d{2}),\d{3}\s-->') {
        $timestamp = $matches[1]
        $text = ($lines[2..($lines.Count - 1)] -join ' ').Trim()
        if ($text) {
            "[${timestamp}] $text"
        }
    }
}

$flatLines | Set-Content $FlatPath -Encoding UTF8
```

This command must produce one line per subtitle in the format `[HH:MM:SS] text`.

### 2. Label speakers with the LLM

Open [speaker-diarization-prompt.md](speaker-diarization-prompt.md), paste the full contents of `%VIDEO_PATH%_transcript_flat.txt` into the prompt, and ask the LLM to transform every line.

### 3. Save the LLM output

Save the response exactly as `%VIDEO_PATH%_speaker_transcript.txt`.

## Validation

- `%VIDEO_PATH%_transcript_flat.txt` exists.
- Every flattened line matches `[HH:MM:SS] text`.
- `%VIDEO_PATH%_speaker_transcript.txt` exists.
- Every speaker-labeled line matches `[HH:MM:SS] Speaker N: sentence`.
- The original timestamps are preserved and remain in the same order.
- The LLM output contains no explanation, markdown, or extra prose.

Do not finish if any validation check fails.

## Expected output

```text
[00:00:10] Speaker 0: Hello, Gabriel.
[00:00:15] Speaker 1: Hi, how are you?
```
