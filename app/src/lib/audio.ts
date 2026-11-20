// Voice notes: record with the microphone, then turn the recording into MP3
// before sending (WhatsApp providers such as UAZAPI take MP3 or Ogg/Opus, not
// the WebM browsers record). The Bubble app did the same with an MP3 recorder.
import { Mp3Encoder } from '@breezystack/lamejs';

export class VoiceRecorder {
  private rec: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  startedAt = 0;

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.rec = new MediaRecorder(this.stream);
    this.rec.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.rec.start();
    this.startedAt = Date.now();
  }

  private finish(): Promise<Blob> {
    return new Promise((resolve) => {
      const rec = this.rec;
      if (!rec) return resolve(new Blob());
      rec.onstop = () => {
        this.stream?.getTracks().forEach((t) => t.stop());
        resolve(new Blob(this.chunks, { type: rec.mimeType }));
      };
      rec.stop();
    });
  }

  cancel() {
    this.finish();
    this.rec = null;
  }

  /** Stops and returns an MP3 data URL. */
  async stop(): Promise<{ dataUrl: string; seconds: number }> {
    const blob = await this.finish();
    this.rec = null;
    const buf = await blob.arrayBuffer();
    const ctx = new AudioContext();
    const audio = await ctx.decodeAudioData(buf);
    ctx.close();
    const mp3 = encodeMp3(audio);
    const dataUrl = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.readAsDataURL(mp3);
    });
    return { dataUrl, seconds: Math.round(audio.duration) };
  }
}

function encodeMp3(audio: AudioBuffer): Blob {
  const rate = audio.sampleRate;
  const data = audio.getChannelData(0);
  const samples = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const enc = new Mp3Encoder(1, rate, 64);
  const parts: BlobPart[] = [];
  const block = 1152;
  for (let i = 0; i < samples.length; i += block) {
    const out = enc.encodeBuffer(samples.subarray(i, i + block));
    if (out.length) parts.push(new Uint8Array(out));
  }
  const end = enc.flush();
  if (end.length) parts.push(new Uint8Array(end));
  return new Blob(parts, { type: 'audio/mpeg' });
}
