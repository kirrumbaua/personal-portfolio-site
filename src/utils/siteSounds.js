/* 
 * Cuelume Web Audio API Synthesizer 
 * Provides subtle UI micro-sounds (clicks, ticks, toggles, drops) with ZERO external audio files!
 */

const PRESETS = {
  chime: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1046.5, attack: 0.006, decay: 0.22, peak: 0.09 },
      { kind: "tone", waveform: "sine", frequency: 1568, offset: 0.09, attack: 0.006, decay: 0.26, peak: 0.08 }
    ],
    shimmer: { delay: 0.12, feedback: 0.25, wet: 0.18, lowpass: 4000 }
  },
  sparkle: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1760, offset: 0, attack: 0.003, decay: 0.09, peak: 0.045 },
      { kind: "tone", waveform: "sine", frequency: 2217, offset: 0.045, attack: 0.003, decay: 0.09, peak: 0.04 },
      { kind: "tone", waveform: "sine", frequency: 2637, offset: 0.09, attack: 0.003, decay: 0.1, peak: 0.038 },
      { kind: "tone", waveform: "sine", frequency: 3520, offset: 0.135, attack: 0.003, decay: 0.12, peak: 0.032 }
    ],
    shimmer: { delay: 0.07, feedback: 0.35, wet: 0.22, lowpass: 6000 }
  },
  droplet: {
    masterGain: 0.55,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 1200, glideTo: 550, glideTime: 0.14, attack: 0.004, decay: 0.2, peak: 0.075 }
    ],
    shimmer: { delay: 0.09, feedback: 0.2, wet: 0.15, lowpass: 3000 }
  },
  bloom: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 528, attack: 0.06, decay: 0.32, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 528, detune: 12, attack: 0.06, decay: 0.34, peak: 0.05 }
    ],
    shimmer: { delay: 0.15, feedback: 0.2, wet: 0.12, lowpass: 2500 }
  },
  tick: {
    masterGain: 0.35,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 5400, filterQ: 1.8, attack: 0.001, decay: 0.018, peak: 0.14 },
      { kind: "tone", waveform: "sine", frequency: 2600, attack: 0.001, decay: 0.012, peak: 0.018 }
    ]
  },
  press: {
    masterGain: 0.35,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 1700, filterQ: 1.4, attack: 0.001, decay: 0.02, peak: 0.13 }
    ]
  },
  release: {
    masterGain: 0.35,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 4600, filterQ: 1.8, attack: 0.001, decay: 0.016, peak: 0.12 },
      { kind: "tone", waveform: "sine", frequency: 3200, offset: 0.006, attack: 0.001, decay: 0.05, peak: 0.02 }
    ]
  },
  toggle: {
    masterGain: 0.4,
    layers: [
      { kind: "noise", filterType: "bandpass", filterFrequency: 2200, filterQ: 1.6, attack: 0.001, decay: 0.016, peak: 0.12 },
      { kind: "noise", filterType: "bandpass", filterFrequency: 3800, filterQ: 1.6, offset: 0.024, attack: 0.001, decay: 0.02, peak: 0.1 }
    ]
  },
  success: {
    masterGain: 0.5,
    layers: [
      { kind: "tone", waveform: "sine", frequency: 880, attack: 0.004, decay: 0.09, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1108.73, offset: 0.06, attack: 0.004, decay: 0.1, peak: 0.06 },
      { kind: "tone", waveform: "sine", frequency: 1318.51, offset: 0.12, attack: 0.004, decay: 0.18, peak: 0.07 }
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.16, lowpass: 4500 }
  }
};

let audioCtx = null;
let soundEnabled = true; // Default enabled

function getAudioContext() {
  if (audioCtx) return audioCtx;
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    audioCtx = new AudioContextClass();
  } catch {
    return null;
  }
  return audioCtx;
}

function playOscillator(ctx, dest, layer, startTime) {
  const osc = ctx.createOscillator();
  osc.type = layer.waveform;
  osc.frequency.setValueAtTime(layer.frequency, startTime);
  if (layer.detune) osc.detune.value = layer.detune;

  if (layer.glideTo !== undefined) {
    const duration = layer.glideTime ?? (layer.attack + layer.decay);
    osc.frequency.exponentialRampToValueAtTime(layer.glideTo, startTime + duration);
  }

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(layer.peak, startTime + layer.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + layer.attack + layer.decay);

  osc.connect(gain).connect(dest);
  osc.start(startTime);
  osc.stop(startTime + layer.attack + layer.decay + 0.05);
}

function playNoise(ctx, dest, layer, startTime) {
  const duration = layer.attack + layer.decay + 0.05;
  const bufferSize = Math.max(1, Math.floor(duration * ctx.sampleRate));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = layer.filterType;
  filter.frequency.value = layer.filterFrequency;
  if (layer.filterQ !== undefined) filter.Q.value = layer.filterQ;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(layer.peak, startTime + layer.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + layer.attack + layer.decay);

  source.connect(filter).connect(gain).connect(dest);
  source.start(startTime);
  source.stop(startTime + duration);
}

function applyShimmer(ctx, srcGain, dest, shimmer) {
  const delay = ctx.createDelay(1);
  delay.delayTime.value = shimmer.delay;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = shimmer.lowpass;

  const feedback = ctx.createGain();
  feedback.gain.value = shimmer.feedback;

  const wet = ctx.createGain();
  wet.gain.value = shimmer.wet;

  srcGain.connect(delay);
  delay.connect(filter);
  filter.connect(feedback);
  feedback.connect(delay);
  filter.connect(wet);
  wet.connect(dest);

  return [delay, filter, feedback, wet];
}

export function playSound(presetName = 'tick') {
  if (!soundEnabled) return;
  const preset = PRESETS[presetName];
  if (!preset) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const trigger = () => {
    const now = ctx.currentTime;
    const masterGainNode = ctx.createGain();
    masterGainNode.gain.value = preset.masterGain * 5;
    masterGainNode.connect(ctx.destination);

    const shimmerNodes = preset.shimmer ? applyShimmer(ctx, masterGainNode, ctx.destination, preset.shimmer) : [];

    for (const layer of preset.layers) {
      const startTime = now + (layer.offset ?? 0);
      if (layer.kind === "tone") {
        playOscillator(ctx, masterGainNode, layer, startTime);
      } else {
        playNoise(ctx, masterGainNode, layer, startTime);
      }
    }

    setTimeout(() => {
      masterGainNode.disconnect();
      shimmerNodes.forEach(n => n.disconnect());
    }, 1000);
  };

  if (ctx.state === 'running') {
    trigger();
  } else {
    try {
      ctx.resume().then(() => {
        if (soundEnabled && ctx.state === 'running') trigger();
      });
    } catch {
      // Ignore audio restriction errors
    }
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  try {
    localStorage.setItem('site_sound_enabled', String(enabled));
  } catch {}
}

export function initSiteSounds() {
  try {
    const saved = localStorage.getItem('site_sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  } catch {}
}
