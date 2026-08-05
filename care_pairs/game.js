import { PAIRS, DIFFICULTIES, BACK_LOGO, TIPS } from './data.js';
import { sound } from './audio.js';

const board = document.getElementById('board');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const attemptsEl = document.getElementById('attempts');
const tipText = document.getElementById('tipText');
const tipBanner = document.getElementById('tipBanner');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const resumeBtn = document.getElementById('resumeBtn');
const pauseRestartBtn = document.getElementById('pauseRestartBtn');
const againBtn = document.getElementById('againBtn');
const saveBtn = document.getElementById('saveBtn');
const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('nameInput');
const victoryNameInput = document.getElementById('victoryNameInput');
const pauseOverlay = document.getElementById('pauseOverlay');
const victoryOverlay = document.getElementById('victoryOverlay');
const startOverlay = document.getElementById('startOverlay');
const leaderboardOverlay = document.getElementById('leaderboardOverlay');
const finalTime = document.getElementById('finalTime');
const finalScore = document.getElementById('finalScore');
const finalAttempts = document.getElementById('finalAttempts');
const rankScoreEl = document.getElementById('rankScore');
const rankList = document.getElementById('rankList');
const musicBtn = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');
const confettiCanvas = document.getElementById('confetti');

const LS_DIFF = 'cuidese-diff';
const LS_NAME = 'cuidese-name';

let difficulty = (localStorage.getItem(LS_DIFF) || 'facil');
if (!DIFFICULTIES[difficulty]) difficulty = 'facil';
let playerName = localStorage.getItem(LS_NAME) || '';

function fmt(s) {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${m}:${ss}`;
}

function newState() {
  return {
    flipped: [],
    matched: 0,
    attempts: 0,
    score: 0,
    streak: 0,
    locked: false,
    seconds: 0,
    timerId: null,
    paused: false,
    started: false,
    won: false,
    pairs: DIFFICULTIES[difficulty].pairs,
    config: DIFFICULTIES[difficulty],
    token: Math.random(),
  };
}

let S = newState();

function activePairs() {
  return PAIRS.slice(0, S.config.pairs);
}

function shuffledItems() {
  const items = [];
  for (const p of activePairs()) {
    items.push([p, 'practice']);
    items.push([p, 'benefit']);
  }
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function makeCard(pair, side) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `card ${side}`;
  el.dataset.pair = pair.id;
  el.setAttribute('aria-label', `${side === 'practice' ? pair.label : pair.benefit}`);
  const body = side === 'practice'
    ? `<div class="card-icon">${pair.emoji}</div><span class="card-name">${pair.label}</span>`
    : `<div class="card-icon">${pair.benefitEmoji}</div><span class="card-name">${pair.benefit}</span>`;
  el.innerHTML = `<div class="card-inner">
      <div class="card-face card-front">${body}</div>
      <div class="card-face card-back"><div class="back-badge">${BACK_LOGO}</div></div>
    </div>`;
  el.addEventListener('click', () => flip(el));
  return el;
}

function buildBoard() {
  board.innerHTML = '';
  board.classList.toggle('cols-3', S.config.cols === 3);
  const items = shuffledItems();
  items.forEach(([pair, side], i) => {
    const el = makeCard(pair, side);
    el.style.setProperty('--i', i);
    board.appendChild(el);
  });
}

function flip(el) {
  if (S.locked || S.paused || S.won) return;
  if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
  if (S.flipped.length === 2) return;
  if (!S.started) startTimer();
  el.classList.add('flipped');
  sound.flip();
  S.flipped.push(el);
  if (S.flipped.length === 2) {
    S.attempts++;
    updateStats();
    resolve();
  }
}

function resolve() {
  const [a, b] = S.flipped;
  const token = S.token;
  a.classList.remove('selected');
  b.classList.remove('selected');
  S.flipped = [];
  if (a.dataset.pair === b.dataset.pair) {
    S.locked = true;
    S.matched++;
    S.streak++;
    S.score += 10 + (S.streak - 1) * 5;
    updateStats();
    setTimeout(() => {
      if (token !== S.token) return;
      a.classList.add('matched');
      b.classList.add('matched');
      S.locked = false;
      sound.match();
      showTip();
      if (S.matched === S.config.pairs) win();
    }, 300);
  } else {
    S.locked = true;
    S.streak = 0;
    setTimeout(() => {
      if (token !== S.token) return;
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      S.locked = false;
      sound.miss();
    }, 850);
  }
}

function updateStats() {
  scoreEl.textContent = S.score;
  attemptsEl.textContent = S.attempts;
}

function startTimer() {
  if (S.timerId) return;
  S.started = true;
  S.timerId = setInterval(() => {
    S.seconds++;
    timerEl.textContent = fmt(S.seconds);
  }, 1000);
}

function stopTimer() {
  if (S.timerId) {
    clearInterval(S.timerId);
    S.timerId = null;
  }
}

let tipsPool = [];
let lastTip = null;

function showTip() {
  if (tipsPool.length === 0) {
    tipsPool = [...TIPS];
    if (lastTip) tipsPool.splice(tipsPool.indexOf(lastTip), 1);
  }
  const i = Math.floor(Math.random() * tipsPool.length);
  lastTip = tipsPool.splice(i, 1)[0];
  tipText.textContent = lastTip;
  tipBanner.classList.remove('pop');
  void tipBanner.offsetWidth;
  tipBanner.classList.add('pop');
}

function rankScore() {
  const remainingBonus = Math.max(0, S.config.limit - S.seconds);
  return S.matched * 5 + remainingBonus - S.attempts;
}

function win() {
  if (S.won) return;
  S.won = true;
  stopTimer();
  const token = S.token;
  setTimeout(() => {
    if (token === S.token) sound.win();
  }, 420);
  finalTime.textContent = fmt(S.seconds);
  finalScore.textContent = S.score;
  finalAttempts.textContent = S.attempts;
  rankScoreEl.textContent = rankScore();
  victoryNameInput.value = playerName;
  victoryOverlay.classList.add('show');
  startConfetti();
}

function togglePause() {
  if (S.won) return;
  S.paused = !S.paused;
  if (S.paused) {
    stopTimer();
    S.locked = true;
    sound.pauseMusic();
    pauseOverlay.classList.add('show');
    pauseBtn.textContent = 'CONTINUAR';
  } else {
    S.locked = false;
    if (S.started) startTimer();
    sound.resumeMusic();
    pauseOverlay.classList.remove('show');
    pauseBtn.textContent = 'PAUSAR';
  }
}

function resetGame() {
  stopConfetti();
  stopTimer();
  pauseOverlay.classList.remove('show');
  victoryOverlay.classList.remove('show');
  leaderboardOverlay.classList.remove('show');
  pauseBtn.textContent = 'PAUSAR';
  timerEl.textContent = '00:00';
  S = newState();
  updateStats();
  buildBoard();
}

function startGame() {
  const n = nameInput.value.trim();
  if (n) {
    playerName = n;
    localStorage.setItem(LS_NAME, playerName);
  } else {
    playerName = 'Jogador(a)';
  }
  startOverlay.classList.remove('show');
  resetGame();
}

function restart() {
  resetGame();
}

function selectDifficulty(diff, src) {
  if (!DIFFICULTIES[diff]) return;
  difficulty = diff;
  localStorage.setItem(LS_DIFF, diff);
  const segs = [document.getElementById('headerDifficult'), document.getElementById('startDifficult')];
  segs.forEach(seg => {
    if (!seg) return;
    [...seg.querySelectorAll('.seg-btn')].forEach(b => {
      b.classList.toggle('active', b.dataset.diff === diff);
    });
  });
  if (src !== 'start') {
    resetGame();
  } else {
    S = newState();
    updateStats();
  }
}

/* --- Leaderboard (Integração com Vercel API + Supabase) --- */

async function saveScore() {
  const name = (victoryNameInput.value.trim() || 'Jogador(a)').slice(0, 20);
  playerName = name;
  localStorage.setItem(LS_NAME, name);

  const finalScore = rankScore();

  if (saveBtn) saveBtn.disabled = true;

  try {
    const response = await fetch('/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: name,
        pontuacao: finalScore
      })
    });

    if (response.ok) {
      victoryOverlay.classList.remove('show');
      await showLeaderboard();
    } else {
      const errData = await response.json();
      alert(`Erro ao salvar pontuação: ${errData.error || 'Erro desconhecido'}`);
    }
  } catch (err) {
    console.error('Erro na requisição:', err);
    alert('Não foi possível conectar ao servidor para salvar a pontuação.');
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

async function showLeaderboard() {
  rankList.innerHTML = '<li class="rank-empty">Carregando ranking global...</li>';
  leaderboardOverlay.classList.add('show');

  try {
    const response = await fetch('/api/ranking');
    const data = await response.json();

    rankList.innerHTML = '';

    if (!data.ranking || data.ranking.length === 0) {
      const li = document.createElement('li');
      li.className = 'rank-empty';
      li.textContent = 'Nenhum resultado ainda. Seja a primeira!';
      rankList.appendChild(li);
      return;
    }

    data.ranking.forEach((s, i) => {
      const li = document.createElement('li');
      li.className = 'rank-item';
      if (i === 0) li.classList.add('rank-top');

      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`;

      li.innerHTML = `
        <span class="rank-medal">${medal}</span>
        <span class="rank-name">${s.nome || 'Anônimo'}</span>
        <b class="rank-score">${s.pontuacao} pts</b>`;

      rankList.appendChild(li);
    });
  } catch (err) {
    console.error('Erro ao buscar o ranking:', err);
    rankList.innerHTML = '<li class="rank-empty">Erro ao carregar o ranking global.</li>';
  }
}

/* --- Difficulty selectors --- */
document.querySelectorAll('#headerDifficult, #startDifficult').forEach(seg => {
  seg.addEventListener('click', e => {
    const btn = e.target.closest('.seg-btn');
    if (!btn) return;
    selectDifficulty(btn.dataset.diff, seg.id === 'startDifficult' ? 'start' : 'header');
  });
});

/* --- Leaderboard buttons --- */
document.getElementById('leaderboardBtn').addEventListener('click', showLeaderboard);
document.getElementById('startLeaderboardBtn').addEventListener('click', showLeaderboard);
document.getElementById('closeLeaderboardBtn').addEventListener('click', () => leaderboardOverlay.classList.remove('show'));

/* --- Music --- */
const MUSIC_MODES = ['off', 'piano', 'nature'];
const MUSIC_LABELS = { off: 'Off', piano: 'Piano', nature: 'Natureza' };
let musicIndex = 0;

musicBtn.addEventListener('click', () => {
  sound.ensure();
  musicIndex = (musicIndex + 1) % MUSIC_MODES.length;
  const mode = MUSIC_MODES[musicIndex];
  if (mode === 'piano') sound.pianoStart();
  else if (mode === 'nature') sound.natureStart();
  else sound.stopMusic();
  musicLabel.textContent = MUSIC_LABELS[mode];
  musicBtn.setAttribute('aria-pressed', String(mode !== 'off'));
});

startBtn.addEventListener('click', startGame);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') startGame(); });
victoryNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveScore(); });
saveBtn.addEventListener('click', saveScore);
againBtn.addEventListener('click', restart);
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);
pauseRestartBtn.addEventListener('click', restart);
restartBtn.addEventListener('click', restart);

/* --- Confetti --- */
const confettiCtx = confettiCanvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS = ['#E6007E', '#002A54', '#8A6FE8', '#FF6FB2', '#C9B6F2', '#FFFFFF'];
let parts = [];
let raf = null;
let running = false;

function resizeConfetti() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  confettiCanvas.width = innerWidth * dpr;
  confettiCanvas.height = innerHeight * dpr;
  confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnConfetti() {
  const w = innerWidth;
  const h = innerHeight;
  for (let i = 0; i < 150; i++) {
    const fromBurst = i < 50;
    parts.push({
      x: fromBurst ? w / 2 : Math.random() * w,
      y: fromBurst ? h * 0.4 : -20 - Math.random() * h * 0.5,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 10,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      vx: fromBurst ? (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 1.2,
      vy: fromBurst ? (Math.random() - 0.5) * 6 : 1.5 + Math.random() * 2.4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.22,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.03,
    });
  }
}

function confettiLoop() {
  confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of parts) {
    p.vy += 0.006;
    p.vx *= 0.99;
    p.x += p.vx + Math.sin(p.sway) * 0.6;
    p.y += p.vy;
    p.sway += p.swaySpeed;
    p.rot += p.vr;
    if (p.y > innerHeight + 30) {
      p.y = -30;
      p.x = Math.random() * innerWidth;
    }
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.globalAlpha = 0.92;
    confettiCtx.fillStyle = p.color;
    confettiCtx.beginPath();
    confettiCtx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    confettiCtx.fill();
    confettiCtx.restore();
  }
  raf = requestAnimationFrame(confettiLoop);
}

function startConfetti() {
  if (running || reducedMotion) return;
  running = true;
  parts = [];
  resizeConfetti();
  spawnConfetti();
  confettiLoop();
}

function stopConfetti() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  parts = [];
  confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
}

window.addEventListener('resize', resizeConfetti);

selectDifficulty(difficulty, 'start');
nameInput.value = playerName;
victoryNameInput.value = playerName;
updateStats();