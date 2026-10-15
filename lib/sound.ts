/**
 * High-performance Web Audio Synthesizer & Haptics Engine.
 * Zero external audio asset dependencies. 100% native Web Audio API.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      return null;
    }
  }

  /**
   * Crisp 80ms bubble-pop frequency sweep on item add (+Add / quantity increment)
   */
  public playPopSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch envelope: frequency sweeps up quickly from 480Hz to 880Hz
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

      // Amplitude envelope: snappy attack, quick exponential decay
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.085);
    } catch (err) {
      // Ignore audio policy errors
    }
  }

  /**
   * Uplifting 3-note harmonic major triad celebration chime on order placement
   */
  public playCelebrationSound() {
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

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (err) {
      // Ignore
    }
  }

  /**
   * Attention chime for timer / alerts
   */
  public playChimeSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (err) {
      // Ignore
    }
  }

  /**
   * Tactile haptic vibration for mobile quick commerce
   */
  public triggerHaptic(duration = 15) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Ignore
      }
    }
  }
}

export const sound = new SoundEngine();

export const playPopSound = () => sound.playPopSound();
export const playCelebrationSound = () => sound.playCelebrationSound();
export const playChimeSound = () => sound.playChimeSound();
export const triggerHaptic = (duration?: number) => sound.triggerHaptic(duration);
