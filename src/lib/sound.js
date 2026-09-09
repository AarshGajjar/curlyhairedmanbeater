// Soft two-note chime generated with WebAudio — no external audio files needed.
let ctx;

function getCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  ctx ??= new Ctx();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function chime(kind = 'soft') {
  try {
    const ac = getCtx();
    if (!ac) return;
    const notes = kind === 'happy' ? [659.25, 783.99, 1046.5] : [880, 1174.66];
    notes.forEach((f, i) => {
      const t0 = ac.currentTime + i * 0.14;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
      o.connect(g).connect(ac.destination);
      o.start(t0);
      o.stop(t0 + 0.32);
    });
  } catch {
    /* audio unavailable — silently ignore */
  }
}
