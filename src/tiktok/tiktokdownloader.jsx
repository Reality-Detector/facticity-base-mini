// App.js
import React, { useState, useRef } from 'react';
// FFmpeg‑WASM
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// Vosk Browser (see https://github.com/alphacep/vosk-browser)
import { Model, KaldiRecognizer } from 'vosk-browser';

function TikTokDownloader() {
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs to hold our loaded FFmpeg and Vosk model so they persist across renders.
  const ffmpegRef = useRef(null);
  const modelRef = useRef(null);

  // Load FFmpeg (if not already loaded)
  const loadFFmpeg = async () => {
    if (!ffmpegRef.current) {
      ffmpegRef.current = createFFmpeg({ log: true });
      await ffmpegRef.current.load();
    }
  };

  // Load the Vosk model (if not already loaded)
  const loadVoskModel = async () => {
    if (!modelRef.current) {
      // This will load your model files from "/model" and your wasm binary from "/vosk.wasm".
      modelRef.current = await Model.create({
        wasmUrl: '/vosk.wasm',
        modelUrl: '/model'
      });
    }
  };

  // Handler for file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setTranscript('');
    }
  };

  // Process the video: extract audio, decode, and transcribe.
  const processVideo = async () => {
    if (!videoFile) return;
    setLoading(true);
    setTranscript(''); // clear any previous transcript

    try {
      // 1. Load FFmpeg if needed and write the video file into its virtual FS.
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

      // 2. Run FFmpeg to extract audio as a WAV file with 16kHz mono PCM.
      //    This command removes the video stream (-vn) and outputs 16 kHz, 1-channel audio.
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-vn',
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-ac', '1',
        'output.wav'
      );

      // 3. Read the generated WAV file from the FFmpeg FS.
      const data = ffmpeg.FS('readFile', 'output.wav');
      const audioBlob = new Blob([data.buffer], { type: 'audio/wav' });

      // 4. Decode the audio using the Web Audio API.
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000 // ensure the sample rate matches what FFmpeg produced
      });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0); // use the first (and only) channel

      // 5. Convert the Float32 PCM data (values in [-1, 1]) to Int16.
      const int16Data = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // 6. Load the Vosk model if needed.
      await loadVoskModel();
      const model = modelRef.current;

      // 7. Create a recognizer with the model.
      //    The recognizer expects a sample rate of 16kHz.
      const recognizer = new KaldiRecognizer(model, 16000);

      // 8. Feed the audio data to the recognizer in small chunks.
      const CHUNK_SIZE = 4096;
      for (let i = 0; i < int16Data.length; i += CHUNK_SIZE) {
        const chunk = int16Data.subarray(i, i + CHUNK_SIZE);
        recognizer.acceptWaveform(chunk);
      }

      // 9. Get the final result.
      const result = recognizer.finalResult();
      setTranscript(result.text);
    } catch (err) {
      console.error('Error processing video:', err);
      setTranscript('Error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>TikTok Video Transcriber</h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <br /><br />
      <button onClick={processVideo} disabled={!videoFile || loading}>
        {loading ? 'Processing...' : 'Transcribe Video'}
      </button>
      <br /><br />
      <h2>Transcript:</h2>
      <div style={{
          padding: '1rem',
          border: '1px solid #ccc',
          minHeight: '100px',
          background: '#f9f9f9'
        }}>
        {transcript || <em>No transcript yet.</em>}
      </div>
    </div>
  );
}

export default TikTokDownloader;
