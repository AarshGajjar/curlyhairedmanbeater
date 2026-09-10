import { useMemo, useState } from 'react';
import Toast from '../components/Toast.jsx';
import { useCountdown } from '../lib/useCountdown.js';
import { chime } from '../lib/sound.js';
import { REST_TIPS, SET_DONE, pick } from '../lib/encouragements.js';

const flatten = day => day.exercises.flatMap((exercise, exerciseIndex) => Array.from({ length: exercise.sets }, (_, setIndex) => ({ exercise, exerciseIndex, setIndex })));

export default function Workout({ day, onBack, onFinish }) {
  const queue = useMemo(() => flatten(day), [day]);
  const [position, setPosition] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [toast, setToast] = useState(null);
  const [timerReset, setTimerReset] = useState(0);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const current = queue[position];
  const timed = current.exercise.seconds > 0;
  const progress = position / queue.length;
  const showToast = text => { setToast({ id: Date.now(), text }); window.setTimeout(() => setToast(null), 2600); };
  const finish = () => onFinish({ seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)), setsDone: queue.length, exercises: day.exercises.length });
  const advance = () => { chime(position === queue.length - 1 ? 'happy' : 'soft'); if (position >= queue.length - 1) { finish(); return; } setPosition(value => value + 1); setTimerReset(0); showToast(position % 3 === 2 ? pick(REST_TIPS) : pick(SET_DONE)); };
  const timer = useCountdown({ seconds: current.exercise.seconds, running: timed, resetKey: `${position}-${timerReset}`, onDone: () => showToast('Time. Reset when ready.') });
  const repTarget = current.exercise.details.match(/\d+[-–]?\d*/)?.[0] || '—';
  const currentExercise = day.exercises[current.exerciseIndex];

  return <div className="screen workout-screen"><header className="workout-header"><button className="back-button" onClick={onBack} aria-label="Back to plan">← <span>PLAN</span></button><span className="workout-context">{day.week} / {day.key}</span><span className="workout-status">IN SESSION</span></header><div className="workout-progress"><span style={{ width: `${Math.max(3, progress * 100)}%` }} /></div><main className="active-layout"><section className="active-intro"><p className="section-label">{current.exercise.type} / MOVEMENT {String(current.exerciseIndex + 1).padStart(2, '0')}</p><h1>{current.exercise.name}</h1><p className="active-details">{current.exercise.details}{current.exercise.sides ? ' · BOTH SIDES' : ''}</p><div className="active-set"><span>SET <strong>{String(current.setIndex + 1).padStart(2, '0')}</strong> / {String(currentExercise.sets).padStart(2, '0')}</span><span>{String(position + 1).padStart(2, '0')} / {String(queue.length).padStart(2, '0')} MOVEMENTS</span></div></section><section className="active-control" aria-label="Current set controls"><div className="metric-block"><span className="metric-label">{timed ? 'TIME REMAINING' : 'REP TARGET'}</span><strong className="metric-value">{timed ? `${Math.floor(timer.timeLeft / 60)}:${String(timer.timeLeft % 60).padStart(2, '0')}` : repTarget}</strong><span className="metric-caption">{timed ? (timer.paused ? 'PAUSED' : 'MOVE WITH CONTROL') : 'REPETITIONS'}</span></div>{timed && <div className="timer-controls"><button className="secondary-button" onClick={timer.toggle}>{timer.paused ? 'RESUME' : 'PAUSE'}</button><button className="text-action" onClick={() => setTimerReset(value => value + 1)}>RESET TIMER</button></div>}<button className="primary-button" onClick={advance}>{position === queue.length - 1 ? 'FINISH WORKOUT' : 'COMPLETE SET'} <span>↗</span></button><div className="nav-controls"><button onClick={() => setPosition(value => Math.max(0, value - 1))} disabled={position === 0}>← PREVIOUS</button><button onClick={advance}>SKIP FOR NOW →</button></div><p className="coach-note">{current.exercise.type.toLowerCase() === 'warm-up' ? 'Warm up gently. Let your range of motion open.' : 'Choose a weight that keeps your form controlled.'}</p></section></main><section className="exercise-access"><button className="exercise-access-toggle" onClick={() => setShowExerciseList(value => !value)} aria-expanded={showExerciseList}><span>{showExerciseList ? 'HIDE' : 'VIEW'} EXERCISE LIST</span><span>{showExerciseList ? '−' : '+'}</span></button>{showExerciseList && <div className="exercise-drawer">{day.exercises.map((item, index) => <div key={`${item.name}-${index}`} className={index === current.exerciseIndex ? 'active' : index < current.exerciseIndex ? 'done' : ''}><b>{index < current.exerciseIndex ? '✓' : String(index + 1).padStart(2, '0')}</b><span>{item.name}</span><small>{item.details}</small></div>)}</div>}</section><Toast message={toast} /></div>;
}
