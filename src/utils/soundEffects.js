// Sound Effects using Web Audio API
// Generate realistic sounds without external files

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Generate white noise buffer
function createNoiseBuffer(ctx, duration) {
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// Launch sound - rising thrust rumble
export function playLaunchSound() {
  const ctx = getAudioContext();
  const duration = 2;

  // Create noise for rumble
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  // Filter for rumble character
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

  // Gain envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + duration - 0.3);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  // Additional oscillator for thrust
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(50, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0, ctx.currentTime);
  oscGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
  oscGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + duration - 0.3);
  oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  // Connect
  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  // Play
  noise.start(ctx.currentTime);
  osc.start(ctx.currentTime);
  noise.stop(ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

// In-flight sound - continuous engine rumble (looped)
let flightSoundNode = null;

export function startFlightSound() {
  if (flightSoundNode) return;

  const ctx = getAudioContext();
  const duration = 100; // Long duration

  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  // Bandpass filter for whoosh
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 500;
  filter.Q.value = 0.5;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.15;

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start();
  flightSoundNode = { noise, gainNode };
}

export function stopFlightSound() {
  if (flightSoundNode) {
    flightSoundNode.noise.stop();
    flightSoundNode = null;
  }
}

// Explosion sound - boom with debris
export function playExplosionSound() {
  const ctx = getAudioContext();
  const duration = 3;

  // Impact boom
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.8, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  // Noise burst for explosion character
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(2000, ctx.currentTime);
  noiseFilter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // Sub bass thump
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(40, ctx.currentTime);
  subOsc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 1);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.6, ctx.currentTime);
  subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

  subOsc.connect(subGain);
  subGain.connect(ctx.destination);

  // Play all
  osc.start(ctx.currentTime);
  noise.start(ctx.currentTime);
  subOsc.start(ctx.currentTime);

  osc.stop(ctx.currentTime + 0.8);
  noise.stop(ctx.currentTime + duration);
  subOsc.stop(ctx.currentTime + 1.5);
}

// Initialize audio context on user interaction
export function initAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}
