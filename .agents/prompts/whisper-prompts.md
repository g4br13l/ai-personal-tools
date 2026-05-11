# Generate MP4 video legend

## Step 1: Convert the MP4 video to a WAV 16kHz

used the installed **ffmpeg** to convert the video to audio at the proper frequency for Whisper to read.

Run the command:

```
ffmpeg -i C:\seu_video.mp4 -ar 16000 -ac 1 -c:a pcm_s16le c:\audio_seu_video.wav
```

- **-i**: (Input) input file.
- **-ar 16000**: Convert to the frequency of 16kHz to be read by the Whisper.
- **-ac 1**: Convert to Mono to avoid hallucinations.
- **pcm_s16le**: Convert to an uncompressed audio format (RAW), easiest to be read by the Whisper.


## Step 2: Generate transcription

Run the command:

```
whisper -m "C:\llms\whisper\ggml-large-v3-turbo.bin" 
>> -f "C:\audio-file-converted-to-16bits-withffmpg.wav" 
>> -l en 
>> -bs 5 
>> -osrt 
>> --vad
>> --prompt "Transcription of a job interview. Technical software development discussion."
```

- **-l en**: Language (English)
- **-bs 5**: (Beam Size): Make the model check the 5 best hypotheses of phrases before writing them, which avoids transcription errors.
- **-osrt**: Show the output transcription and create a ".srt" file (legend with time) with the full transcription.
- **--vad**: (Voice Activity Detection) Cuts the silences and noises between spoken words.

