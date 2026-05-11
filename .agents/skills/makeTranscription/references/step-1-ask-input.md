# Step 1: Ask for the Video Input Path and Language

This step is mandatory and always runs first.

## Required inputs

- `%VIDEO_PATH%`: full local path to the MP4 file.
- `%VIDEO_LANG%`: spoken language as an ISO 639-1 code such as `en`, `pt`, `es`, `fr`, or `de`.

## Procedure

1. If `%VIDEO_PATH%` is not already known, ask for it.
2. If `%VIDEO_LANG%` is not already known, ask for it.
3. Confirm the path is explicit and points to an `.mp4` file.
4. Confirm the language code is explicit. Do not guess it.
5. Do not proceed until both values are known.

Example question:

```text
What is the full path to the MP4 video file you want to transcribe?
What is the spoken language code for the video? Examples: en, pt, es.
```

## Validation

- `%VIDEO_PATH%` is non-empty and ends with `.mp4`.
- `%VIDEO_LANG%` is non-empty and explicit.

## Output

Substitute the answers into `%VIDEO_PATH%` and `%VIDEO_LANG%` for all subsequent commands.

## Next step

Proceed to [step-2-convert-wav.md](step-2-convert-wav.md) only after validation passes.
