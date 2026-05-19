// rhythm.js — visual metronome / playhead animation
// Depends on nothing; called by app.js via onclick and stopRhythm() guard.

const rhythmState = {
  playing: false,
  bpm: 120,
  startTime: null,
  rafId: null
};

// One full left-to-right sweep = 4 beats (one measure)
function sweepDurationMs() {
  return (4 * 60_000) / rhythmState.bpm;
}

function toggleRhythm() {
  rhythmState.playing ? stopRhythm() : startRhythm();
}

function startRhythm() {
  rhythmState.playing = true;
  rhythmState.startTime = null;

  const btn = document.getElementById('rhythm-toggle-btn');
  const playhead = document.getElementById('playhead');
  if (btn) {
    btn.textContent = '■ Stop Rhythm';
    btn.classList.add('active');
  }
  if (playhead) playhead.classList.add('visible');

  rhythmState.rafId = requestAnimationFrame(tick);
}

function stopRhythm() {
  rhythmState.playing = false;
  if (rhythmState.rafId) cancelAnimationFrame(rhythmState.rafId);
  rhythmState.rafId = null;
  rhythmState.startTime = null;

  const btn = document.getElementById('rhythm-toggle-btn');
  const playhead = document.getElementById('playhead');
  if (btn) {
    btn.textContent = '▶ Start Rhythm';
    btn.classList.remove('active');
  }
  if (playhead) {
    playhead.classList.remove('visible');
    playhead.style.transform = 'translateX(0)';
  }
}

function updateBPM(value) {
  const newBPM = parseInt(value, 10);

  // Preserve playhead position across BPM change
  if (rhythmState.playing && rhythmState.startTime !== null) {
    const now = performance.now();
    const elapsed = now - rhythmState.startTime;
    const progress = (elapsed % sweepDurationMs()) / sweepDurationMs();
    rhythmState.bpm = newBPM;
    rhythmState.startTime = now - progress * sweepDurationMs();
  } else {
    rhythmState.bpm = newBPM;
  }

  const display = document.getElementById('bpm-display');
  if (display) display.textContent = newBPM;
}

function tick(timestamp) {
  if (!rhythmState.playing) return;

  if (rhythmState.startTime === null) rhythmState.startTime = timestamp;

  const elapsed = timestamp - rhythmState.startTime;
  const progress = (elapsed % sweepDurationMs()) / sweepDurationMs();

  const container = document.getElementById('lyrics-container');
  const playhead = document.getElementById('playhead');

  if (container && playhead) {
    const x = progress * container.offsetWidth;
    playhead.style.transform = `translateX(${x}px)`;
  }

  rhythmState.rafId = requestAnimationFrame(tick);
}
