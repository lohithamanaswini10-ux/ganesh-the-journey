/**
 * GANESH – THE JOURNEY
 * Sound Manager: Native Web Audio API Synthesis Engine
 * 100% self-contained, zero external audio files, completely reliable offline.
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.isMuted = false;
    this.musicVolume = 0.75;
    this.sfxVolume = 0.85;

    // Ambient Drone nodes
    this.isDronePlaying = false;
    this.droneOscillators = [];
    this.droneGain = null;
    this.droneFilter = null;
    this.droneLfo = null;

    // Initialize audio on first user interaction
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn("Web Audio API not supported in this browser.");
        return;
      }

      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      // Music sub-channel
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      // SFX sub-channel
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;

      // Resume context if suspended
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Could not initialize Web Audio:", e);
    }
  }

  ensureContext() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMusicVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  setMute(mute) {
    this.isMuted = !!mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
  }

  /**
   * Start Ambient Spiritual Tanpura / Raga Drone
   * Synthesizes Sa-Pa-Sa (C3 - G3 - C4) devotional drone with subtle warmth and movement.
   */
  startAmbientMusic(theme = "kailash") {
    this.ensureContext();
    if (!this.ctx || this.isDronePlaying) return;

    try {
      this.stopAmbientMusic();

      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.28, now + 2.5); // Gentle fade in

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = "lowpass";
      this.droneFilter.frequency.value = theme === "kailash" ? 650 : 850;

      // Subtle LFO for gentle shimmering breathing
      this.droneLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.droneLfo.frequency.value = 0.15; // Slow 6-second cycle
      lfoGain.gain.value = 80;
      this.droneLfo.connect(lfoGain);
      lfoGain.connect(this.droneFilter.frequency);
      this.droneLfo.start();

      // Pitch frequencies for Indian classical drone (Sa = 130.81Hz - C3, Pa = 196Hz - G3, High Sa = 261.63Hz - C4)
      const freqs = [130.81, 196.00, 261.63, 392.00];

      this.droneOscillators = freqs.map((freq, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = i % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Gentle detuning for lush acoustic depth
        const detune = (i - 1.5) * 3.5;
        osc.detune.setValueAtTime(detune, now);

        const oscGain = this.ctx.createGain();
        oscGain.gain.value = 0.25 / (i + 1);

        osc.connect(oscGain);
        oscGain.connect(this.droneFilter);
        osc.start(now);
        return osc;
      });

      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.musicGain);

      this.isDronePlaying = true;
    } catch (e) {
      console.warn("Error starting ambient drone:", e);
    }
  }

  stopAmbientMusic() {
    if (!this.ctx || !this.isDronePlaying) return;

    try {
      const now = this.ctx.currentTime;
      if (this.droneGain) {
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      }

      setTimeout(() => {
        this.droneOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (_) {}
        });
        this.droneOscillators = [];
        if (this.droneLfo) {
          try { this.droneLfo.stop(); this.droneLfo.disconnect(); } catch (_) {}
          this.droneLfo = null;
        }
        if (this.droneFilter) {
          this.droneFilter.disconnect();
          this.droneFilter = null;
        }
        if (this.droneGain) {
          this.droneGain.disconnect();
          this.droneGain = null;
        }
        this.isDronePlaying = false;
      }, 1300);
    } catch (e) {
      console.warn("Error stopping ambient drone:", e);
    }
  }

  /**
   * Authentic Temple Bell (Ghantha) Chime
   * Inharmonic metallic partials with long ringing exponential decay.
   */
  playTempleBell(pitch = 523.25) { // C5 base
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const partials = [
      { ratio: 1.0,  gain: 0.55, decay: 2.8 },
      { ratio: 1.52, gain: 0.35, decay: 2.2 },
      { ratio: 2.76, gain: 0.25, decay: 1.8 },
      { ratio: 4.15, gain: 0.15, decay: 1.2 },
      { ratio: 5.43, gain: 0.08, decay: 0.7 }
    ];

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch * p.ratio, now);

      gain.gain.setValueAtTime(p.gain * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + p.decay);
    });
  }

  /**
   * Auspicious Conch Shell (Shankha) Divine Blast
   */
  playShankha() {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    // Pitch rises slightly, settles, then decays
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.35); // E4
    osc.frequency.setValueAtTime(329.63, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(220, now + 2.2);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(500, now + 2.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.4);
    gain.gain.setValueAtTime(0.45, now + 1.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 2.35);
  }

  /**
   * Modak Collection Shimmer (Ascending Pentatonic Raga)
   */
  playModak() {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Sa Re Ga Pa Dha Sa

    notes.forEach((freq, idx) => {
      const noteTime = now + (idx * 0.055);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  /**
   * Flower Harvest Gentle Chime
   */
  playFlower() {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Puzzle Solved / Divine Revelation Fanfare
   */
  playPuzzleSuccess() {
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [
      { time: 0, notes: [261.63, 329.63, 392.00] },       // C major
      { time: 0.18, notes: [329.63, 392.00, 523.25] },    // Higher inversion
      { time: 0.4, notes: [392.00, 523.25, 659.25, 783.99] } // Triumphant resolve
    ];

    const now = this.ctx.currentTime;

    chords.forEach(c => {
      c.notes.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + c.time);

        gain.gain.setValueAtTime(0.18, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + c.time);
        osc.stop(now + c.time + 0.85);
      });
    });

    this.playTempleBell(659.25);
  }

  /**
   * Respectful Soft Warning / Mistake Thud
   */
  playMistake() {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * UI Click / Wooden Block Tap
   */
  playClick() {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Level Complete Celebration Fanfare
   */
  playLevelComplete() {
    this.ensureContext();
    this.playShankha();
    setTimeout(() => this.playTempleBell(523.25), 300);
    setTimeout(() => this.playTempleBell(659.25), 600);
    setTimeout(() => this.playTempleBell(783.99), 900);
  }

  /**
   * World Complete Grand Celebration
   */
  playWorldComplete() {
    this.ensureContext();
    this.playShankha();
    setTimeout(() => this.playPuzzleSuccess(), 600);
    setTimeout(() => this.playTempleBell(523.25), 1100);
    setTimeout(() => this.playTempleBell(783.99), 1600);
    setTimeout(() => this.playTempleBell(1046.50), 2100);
  }
}

export const sound = new SoundManager();
