const AC = window.AudioContext || window.webkitAudioContext;

export const sound = {
  ctx: null,
  master: null,
  musicGain: null,
  musicNodes: [],
  musicTimer: null,
  mode: 'off',
  running: false,
  broken: false,

  ensure() {
    if (this.broken) return false;
    try {
      if (!this.ctx) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.6;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    } catch (e) {
      this.broken = true;
      return false;
    }
  },

  _env(dest, t, peak, dur) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(dest);
    return g;
  },

  _tone(opts) {
    const { freq = 440, type = 'sine', t = 0, dur = 0.5, peak = 0.15, dest } = opts;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.min(5000, Math.max(300, freq * 6));
    lp.Q.value = 0.6;
    const g = this._env(dest || this.master, t, peak, dur);
    osc.connect(lp);
    lp.connect(g);
    osc.start(t);
    osc.stop(t + dur + 0.06);
  },

  _safe(fn) {
    if (!this.ensure()) return;
    try { fn(); } catch (e) {}
  },

  flip() {
    this._safe(() => {
      const t = this.ctx.currentTime;
      this._tone({ freq: 540, type: 'triangle', t, dur: 0.12, peak: 0.05 });
    });
  },

  miss() {
    this._safe(() => {
      const t = this.ctx.currentTime;
      this._tone({ freq: 300, type: 'sine', t, dur: 0.16, peak: 0.035 });
    });
  },

  match() {
    this._safe(() => {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', t: t + i * 0.09, dur: 0.7, peak: 0.06 });
      });
    });
  },

  win() {
    this._safe(() => {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => {
        this._tone({ freq: f, type: 'sine', t: t + i * 0.13, dur: 0.9, peak: 0.06 });
        this._tone({ freq: f * 2, type: 'sine', t: t + i * 0.13 + 0.01, dur: 0.6, peak: 0.02 });
      });
    });
  },

  stopMusic() {
    this.running = false;
    this.mode = 'off';
    clearTimeout(this.musicTimer);
    if (this.musicGain) {
      const g = this.musicGain;
      try {
        const t = this.ctx.currentTime;
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      } catch (e) {}
      window.setTimeout(() => {
        try { g.disconnect(); } catch (e) {}
      }, 400);
      this.musicGain = null;
    }
    this.musicNodes.forEach(n => {
      try { n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    this.musicNodes = [];
  },

  pauseMusic() {
    if (!this.musicGain) return;
    try {
      const t = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    } catch (e) {}
  },

  resumeMusic() {
    if (!this.musicGain || this.mode === 'off') return;
    const base = this.mode === 'piano' ? 0.14 : 0.5;
    try {
      const t = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(Math.max(this.musicGain.gain.value, 0.0001), t);
      this.musicGain.gain.exponentialRampToValueAtTime(base, t + 0.4);
    } catch (e) {}
  },

  pianoStart() {
    this._safe(() => {
      this.stopMusic();
      this.mode = 'piano';
      this.running = true;
      const ctx = this.ctx;
      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = 0.14;
      this.musicGain.connect(this.master);
      const chords = [
        [130.81, 261.63, 329.63, 392.0],
        [110.0, 220.0, 261.63, 329.63],
        [87.31, 174.61, 220.0, 261.63],
        [98.0, 196.0, 246.94, 293.66],
      ];
      const step = 0.9;
      let bar = 0;
      let nextT = ctx.currentTime + 0.15;
      const tick = () => {
        if (!this.running || this.mode !== 'piano') return;
        const chord = chords[bar % chords.length];
        chord.forEach(f => {
          this._tone({ freq: f, type: 'sine', t: nextT, dur: 3.4, peak: 0.032, dest: this.musicGain });
        });
        this._tone({ freq: chord[0] / 2, type: 'sine', t: nextT, dur: 3.6, peak: 0.05, dest: this.musicGain });
        const seq = [0, 1, 2, 1, 0, 1, 2, 3];
        seq.forEach((ci, i) => {
          const f = chord[ci] * (i === 7 ? 1 : 2);
          this._tone({ freq: f, type: 'triangle', t: nextT + i * step * 0.5, dur: 1.0, peak: 0.028, dest: this.musicGain });
        });
        bar++;
        nextT += step * 4;
        const wait = Math.max(0, (nextT - ctx.currentTime) * 1000 - 90);
        this.musicTimer = setTimeout(tick, wait);
      };
      tick();
    });
  },

  natureStart() {
    this._safe(() => {
      this.stopMusic();
      this.mode = 'nature';
      this.running = true;
      const ctx = this.ctx;
      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = 0.5;
      this.musicGain.connect(this.master);

      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.03 * white) / 1.03;
        data[i] = last * 2.5;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 420;
      lp.Q.value = 0.5;
      const lpGain = ctx.createGain();
      lpGain.gain.value = 0.9;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 950;
      bp.Q.value = 1.4;
      const bpGain = ctx.createGain();
      bpGain.gain.value = 0.3;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      const lfoAmp = ctx.createGain();
      lfoAmp.gain.value = 200;
      lfo.connect(lfoAmp);
      lfoAmp.connect(bp.frequency);

      const swell = ctx.createGain();
      swell.gain.value = 0.55;
      const swOsc = ctx.createOscillator();
      swOsc.frequency.value = 0.09;
      const swAmp = ctx.createGain();
      swAmp.gain.value = 0.12;
      swOsc.connect(swAmp);
      swAmp.connect(swell.gain);

      src.connect(lp);
      lp.connect(lpGain);
      lpGain.connect(swell);
      src.connect(bp);
      bp.connect(bpGain);
      bpGain.connect(swell);
      swell.connect(this.musicGain);

      src.start();
      lfo.start();
      swOsc.start();
      this.musicNodes.push(src, lfo, swOsc);
    });
  },
};
