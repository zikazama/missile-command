// Sound Effects using Web Audio API
// Generate realistic sounds without external files
// Optimized for iOS/iPhone compatibility

let audioContext = null;
let audioInitialized = false;
let audioPermissionRequested = false;

function getAudioContext() {
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported on this device');
        return null;
      }
      audioContext = new AudioContextClass();
    }
    return audioContext;
  } catch (error) {
    console.error('Error creating audio context:', error);
    return null;
  }
}

// Resume audio context - crucial for iOS
function ensureAudioContextRunning() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    // For iOS and other browsers, resume is needed
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        console.log('Audio context resumed');
        audioInitialized = true;
      }).catch(err => {
        console.warn('Could not resume audio context:', err);
      });
    } else if (ctx.state === 'running') {
      audioInitialized = true;
    }
    return true;
  } catch (error) {
    console.error('Error ensuring audio context running:', error);
    return false;
  }
}

// Generate white noise buffer
function createNoiseBuffer(ctx, duration) {
  if (!ctx) return null;
  
  try {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  } catch (error) {
    console.error('Error creating noise buffer:', error);
    return null;
  }
}

// Launch sound - rising thrust rumble
export function playLaunchSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') {
    console.warn('Audio context not available for launch sound');
    return;
  }

  try {
    const duration = 2;

    // Create noise for rumble
    const noiseBuffer = createNoiseBuffer(ctx, duration);
    if (!noiseBuffer) return;

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
  } catch (error) {
    console.error('Error playing launch sound:', error);
  }
}

// In-flight sound - continuous engine rumble (looped)
let flightSoundNode = null;

export function startFlightSound() {
  if (flightSoundNode) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') {
    console.warn('Audio context not available for flight sound');
    return;
  }

  try {
    const duration = 100; // Long duration

    const noiseBuffer = createNoiseBuffer(ctx, duration);
    if (!noiseBuffer) return;

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
  } catch (error) {
    console.error('Error starting flight sound:', error);
  }
}

export function stopFlightSound() {
  if (flightSoundNode) {
    try {
      flightSoundNode.noise.stop();
    } catch (error) {
      console.error('Error stopping flight sound:', error);
    }
    flightSoundNode = null;
  }
}

// Explosion sound - boom with debris
export function playExplosionSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') {
    console.warn('Audio context not available for explosion sound');
    return;
  }

  try {
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
    if (!noiseBuffer) return;

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
  } catch (error) {
    console.error('Error playing explosion sound:', error);
  }
}

// Initialize audio context on user interaction
// Critical for iOS - must be called from user gesture
export function initAudio() {
  if (audioPermissionRequested) {
    ensureAudioContextRunning();
    return;
  }

  audioPermissionRequested = true;

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      console.error('Could not create audio context');
      return;
    }

    // For iOS and other browsers
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        console.log('✓ Audio context resumed successfully');
        audioInitialized = true;
      }).catch(err => {
        console.warn('Could not resume audio context:', err);
        // Retry after a short delay
        setTimeout(() => {
          ctx.resume().catch(e => console.warn('Retry failed:', e));
        }, 100);
      });
    } else if (ctx.state === 'running') {
      audioInitialized = true;
      console.log('✓ Audio context already running');
    } else {
      console.warn('Audio context state:', ctx.state);
    }
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
}

// Additional function to ensure audio is ready before playing sounds
export function isAudioReady() {
  const ctx = getAudioContext();
  return ctx && (ctx.state === 'running' || audioInitialized);
}

// Enable audio on first page load/interaction
export function enableAudioOnInteraction() {
  const handleInteraction = () => {
    initAudio();
    // Use passive listener for scroll
    document.removeEventListener('click', handleInteraction);
    document.removeEventListener('touchstart', handleInteraction, { passive: true });
    document.removeEventListener('keydown', handleInteraction);
  };

  // Add event listeners for user interactions
  document.addEventListener('click', handleInteraction, { passive: true });
  document.addEventListener('touchstart', handleInteraction, { passive: true });
  document.addEventListener('keydown', handleInteraction, { passive: true });
}
