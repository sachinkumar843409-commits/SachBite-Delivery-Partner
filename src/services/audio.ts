// Web Audio API high-intensity sound synthesizer and Haptic feedback for SachBite Delivery Partner

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private alertIntervalId: any = null;
  private isLoudMode: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLoud = localStorage.getItem('sachbite_loud_sound');
      if (savedLoud !== null) {
        this.isLoudMode = savedLoud === 'true';
      }
    }
  }

  setLoudMode(enabled: boolean) {
    this.isLoudMode = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sachbite_loud_sound', enabled ? 'true' : 'false');
    }
  }

  getLoudMode(): boolean {
    return this.isLoudMode;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Trigger high-power vibration
  triggerVibrate(pattern: number[] = [400, 150, 400, 150, 600, 200, 800]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Vibrate not supported or blocked by policy
    }
  }

  // Play urgent, extra-loud incoming order chime & alarm (cuts through traffic noise)
  playNewOrderAlert() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy repetitive haptic vibration pattern for bike riding in traffic
      this.triggerVibrate([500, 120, 500, 120, 800, 150, 800]);

      // High volume multiplier (1.0 for loud mode, 0.7 for standard)
      const volume = this.isLoudMode ? 0.95 : 0.65;

      // 4-stage piercing, energetic delivery alert sequence (Swiggy/Zomato style high-gain synth)
      const alertSequence = [
        { freq: 659.25, type: 'triangle' as OscillatorType, start: 0.0, dur: 0.14 },  // E5
        { freq: 880.0,  type: 'sawtooth' as OscillatorType, start: 0.12, dur: 0.16 }, // A5
        { freq: 1174.66, type: 'triangle' as OscillatorType, start: 0.28, dur: 0.20 }, // D6
        { freq: 1760.0, type: 'sine' as OscillatorType,     start: 0.46, dur: 0.38 }, // A6 loud crest
        // Echo pulse
        { freq: 880.0,  type: 'triangle' as OscillatorType, start: 0.75, dur: 0.14 },
        { freq: 1174.66, type: 'sawtooth' as OscillatorType, start: 0.88, dur: 0.18 },
        { freq: 1760.0, type: 'triangle' as OscillatorType, start: 1.05, dur: 0.45 },
      ];

      alertSequence.forEach(({ freq, type, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + start);

        // Punchy attack with smooth exponential decay
        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.linearRampToValueAtTime(volume, now + start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur);
      });
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  }

  // Start continuous repeating loud ringtone until order is accepted/declined
  startContinuousAlert(intervalMs = 4000) {
    this.stopContinuousAlert();
    this.playNewOrderAlert();
    this.alertIntervalId = setInterval(() => {
      this.playNewOrderAlert();
    }, intervalMs);
  }

  // Stop repeating ringtone
  stopContinuousAlert() {
    if (this.alertIntervalId) {
      clearInterval(this.alertIntervalId);
      this.alertIntervalId = null;
    }
  }

  // Soft ding when a stage advances (arrived, picked up, etc.)
  playStageDing() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      this.triggerVibrate([150, 80, 200]);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.18);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Celebratory fanfare when order is successfully delivered
  playDeliveredSuccess() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      this.triggerVibrate([200, 100, 200, 100, 450]);

      const chords = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.12 }, // E5
        { freq: 783.99, time: 0.24 }, // G5
        { freq: 1046.5, time: 0.38 }  // C6
      ];

      chords.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.6, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + 0.4);
      });
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEffectsService();

