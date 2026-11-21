/**
 * Pure Web Audio API Ambient Focus Soundscapes
 * Works 100% offline & on iOS/Android/Desktop without needing Spotify Premium or external MP3s.
 */
export type SoundscapeType = 'off' | 'rain' | 'brown' | 'lofi';

class AmbientSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeType: SoundscapeType = 'off';
  private volume = 0.35;

  private ensureContext(): AudioContext | null {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.08);
    }
  }

  public stop() {
    this.activeType = 'off';
    for (const node of this.activeNodes) {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // Ignore already-stopped nodes
      }
    }
    this.activeNodes = [];
  }

  public start(type: SoundscapeType) {
    this.stop();
    if (type === 'off') return;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    this.activeType = type;

    if (type === 'brown' || type === 'rain') {
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

      for (let ch = 0; ch < 2; ch++) {
        const out = noiseBuffer.getChannelData(ch);
        let lastOut = 0;
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'brown') {
            out[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = out[i];
            out[i] *= 3.2;
          } else {
            // Soft pink/rain texture
            b0 = 0.99765 * b0 + white * 0.099046;
            b1 = 0.963 * b1 + white * 0.2965164;
            b2 = 0.57 * b2 + white * 1.0526913;
            out[i] = (b0 + b1 + b2 + white * 0.1848) * 0.14;
          }
        }
      }

      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'brown' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'brown' ? 320 : 1050;
      filter.Q.value = type === 'brown' ? 0.7 : 0.45;

      const gain = ctx.createGain();
      gain.gain.value = type === 'brown' ? 0.48 : 0.42;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      src.start();
      this.activeNodes.push(src, filter, gain);
      return;
    }

    if (type === 'lofi') {
      // Warm cosmic Lo-Fi harmonic chord pad (Fmaj9 soft drone with gentle LFO breathing)
      const freqs = [174.61, 220.0, 261.63, 329.63, 392.0];
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 580;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.14;
      lfoGain.gain.value = 180;
      lfo.connect(lfoGain);
      lfoGain.connect(padFilter.frequency);
      lfo.start();

      const padGain = ctx.createGain();
      padGain.gain.value = 0.14;
      padFilter.connect(padGain);
      padGain.connect(this.masterGain);
      this.activeNodes.push(padFilter, lfo, lfoGain, padGain);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        osc.detune.value = (idx - 2) * 3.5;
        osc.connect(padFilter);
        osc.start();
        this.activeNodes.push(osc);
      });
    }
  }

  public getActiveType(): SoundscapeType {
    return this.activeType;
  }
}

export const soundscapeEngine = new AmbientSoundscapeEngine();
