import { useMemo, useState } from 'react';
import Bubble from '../components/Bubble.jsx';
import CuteButton from '../components/CuteButton.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import Toast from '../components/Toast.jsx';
import { useCountdown } from '../lib/useCountdown.js';
import { chime } from '../lib/sound.js';
import { REST_TIPS, SET_DONE, TYPE_EMOJI, pick } from '../lib/encouragements.js';

const flatten = day => day.exercises.flatMap((exercise, exerciseIndex) => Array.from({ length: exercise.sets }, (_, setIndex) => ({ exercise, exerciseIndex, setIndex })));

export default function Workout({ day, onBack, onFinish }) {
  const queue = useMemo(() => flatten(day), [day]);
  const [position, setPosition] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [toast, setToast] = useState(null);
  const [timerReset, setTimerReset] = useState(0);
  const current = queue[position];
  const timed = current.exercise.seconds > 0;
  const progress = position / queue.length;
  const showToast = text => { setToast({ id: Date.now(), text }); window.setTimeout(() => setToast(null), 2600); };
  const finish = () => onFinish({ seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)), setsDone: queue.length, exercises: day.exercises.length });
  const advance = () => { chime(position === queue.length - 1 ? 'happy' : 'soft'); if (position >= queue.length - 1) { finish(); return; } setPosition(value => value + 1); setTimerReset(0); showToast(position % 3 === 2 ? pick(REST_TIPS) : pick(SET_DONE)); };
  const timer = useCountdown({ seconds: current.exercise.seconds, running: timed, resetKey: `${position}-${timerReset}`, onDone: () => showToast('Time. Reset when ready.') });
  const repTarget = current.exercise.details.match(/\d+[-–]?\d*/)?.[0] || '—';

  return <div className="screen workout-screen">
    <header className="workout-topbar"><button className="back-button" onClick={onBack} aria-label="Back to plan">← <span>Plan</span></button><span className="eyebrow">{day.week} · {day.key}</span><span className="curl-check">Workout</span></header>
    <div className="workout-layout">
      <section className="workout-copy"><p className="eyebrow">{TYPE_EMOJI[current.exercise.type.toLowerCase()] || '•'} {current.exercise.type}</p><h1>{current.exercise.name}</h1><p className="exercise-details">{current.exercise.details}{current.exercise.sides ? ' · both sides' : ''}</p><div className="set-line"><span>Set {current.setIndex + 1} of {current.exercise.sets}</span><span>{position + 1} / {queue.length} total</span></div><div className="progress-bar" aria-label={`${Math.round(progress * 100)} percent complete`}><span style={{ width: `${Math.max(4, progress * 100)}%` }} /></div><div className="exercise-list" aria-label="Workout exercises">{day.exercises.map((item, index) => <span key={`${item.name}-${index}`} className={index === current.exerciseIndex ? 'active' : index < current.exerciseIndex ? 'done' : ''}>{index < current.exerciseIndex ? '✓' : String(index + 1).padStart(2, '0')} {item.name}</span>)}</div></section>
      <section className="workout-action"><Bubble className="timer-card"><ProgressRing progress={progress} size={238} stroke={9}>{timed ? <><strong className="timer-value">{Math.floor(timer.timeLeft / 60)}:{String(timer.timeLeft % 60).padStart(2, '0')}</strong><span className="timer-label">{timer.paused ? 'paused' : 'move with control'}</span></> : <><strong className="rep-value">{repTarget}</strong><span className="timer-label">reps / target</span></>}</ProgressRing>{timed && <div className="timer-controls"><CuteButton variant="soft" onClick={timer.toggle}>{timer.paused ? 'Resume' : 'Pause'}</CuteButton><button className="text-button" onClick={() => setTimerReset(value => value + 1)}>Reset timer</button></div>}</Bubble><CuteButton className="complete-button" onClick={advance}>{position === queue.length - 1 ? 'Finish workout' : 'Complete set'} <span>→</span></CuteButton><div className="nav-controls"><button onClick={() => setPosition(value => Math.max(0, value - 1))} disabled={position === 0}>← Previous</button><button onClick={advance}>Skip for now →</button></div><p className="coach-note">{current.exercise.type.toLowerCase() === 'warm-up' ? 'Warm up gently.' : 'Choose a weight that keeps your form controlled.'}</p></section>
    </div><Toast message={toast} />
  </div>;
}
