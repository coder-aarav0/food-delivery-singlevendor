/**
 * Unified High-Performance Web Audio Synthesizer & Haptics Engine.
 * 100% Native Web Audio API — Zero external MP3/WAV assets, zero latency.
 * Handles deterministic node garbage collection and mobile Safari autoplay policies.
 */

class UnifiedSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('enatega_audio_muted') === 'true';
      } catch {
        this.isMuted = false;
      }

      // Synchronous gesture unlocker for Mobile Safari / WebKit autoplay policy
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };

      window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    }
  }

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      return null;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('enatega_audio_muted', muted ? 'true' : 'false');
      }
    } catch {
      // Ignore
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Safe node disconnection helper to prevent memory leaks in active dispatch stations.
   */
  private registerGarbageCollection(osc: OscillatorNode, gainNode: GainNode): void {
    osc.onended = () => {
      try {
        osc.disconnect();
        gainNode.disconnect();
      } catch {
        // Already disconnected
      }
    };
  }

  /**
   * Crisp 80ms bubble-pop frequency sweep on item add (+Add / quantity increment)
   */
  public playPopSound(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch envelope: frequency sweeps up quickly from 480Hz to 880Hz
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      // Amplitude envelope: snappy attack, quick exponential decay
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      this.registerGarbageCollection(osc, gain);
      osc.start(now);
      osc.stop(now + 0.085);
    } catch {
      // Ignore audio policy errors
    }
  }

  /**
   * Uplifting 4-note harmonic major triad celebration chime on order placement
   */
  public playCelebrationSound(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + index * 0.09;
        const duration = 0.4;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        this.registerGarbageCollection(osc, gain);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Attention chime for timer / alerts
   */
  public playChimeSound(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      this.registerGarbageCollection(osc, gain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  /**
   * Cheerful dual-tone chime (E5 -> B5) when a new order arrives at the Admin Kanban
   */
  public playNewOrderChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Tone 1: 659.25 Hz (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      this.registerGarbageCollection(osc1, gain1);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Tone 2: 987.77 Hz (B5) after 160ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.16);
      gain2.gain.setValueAtTime(0.35, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      this.registerGarbageCollection(osc2, gain2);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.7);
    } catch (err) {
      console.warn('Audio chime playback blocked or not supported:', err);
    }
  }

  /**
   * Urgent pulsating siren (A5 -> D6) for incoming 60s rider dispatch orders
   */
  public playRiderAlertChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Pulse 1 (880 Hz - A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      this.registerGarbageCollection(osc1, gain1);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Pulse 2 (1174.66 Hz - D6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.18);
      gain2.gain.setValueAtTime(0.45, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      this.registerGarbageCollection(osc2, gain2);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.4);
    } catch (err) {
      console.warn('Rider alert audio blocked:', err);
    }
  }

  /**
   * Low warning buzz (220Hz -> 110Hz Sawtooth) on OTP mismatch or SLA breach
   */
  public playWarningSound(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      this.registerGarbageCollection(osc, gain);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  public playRiderAlert(): void {
    this.playRiderAlertChime();
  }

  public playWarningAlert(): void {
    this.playWarningSound();
  }

  /**
   * Tactile haptic vibration for mobile quick commerce
   */
  public triggerHaptic(pattern: number | number[] = 15): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptic policy blocks
      }
    }
  }
}

export const sound = new UnifiedSoundEngine();

// Convenience individual exports
export const playPopSound = () => sound.playPopSound();
export const playCelebrationSound = () => sound.playCelebrationSound();
export const playChimeSound = () => sound.playChimeSound();
export const playNewOrderChime = () => sound.playNewOrderChime();
export const playRiderAlertChime = () => sound.playRiderAlertChime();
export const playWarningSound = () => sound.playWarningSound();
export const triggerHaptic = (pattern?: number | number[]) => sound.triggerHaptic(pattern);
