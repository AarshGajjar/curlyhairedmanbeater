import { useEffect, useMemo, useState } from 'react';
import Background from './components/Background.jsx';
import Home from './screens/Home.jsx';
import Workout from './screens/Workout.jsx';
import Done from './screens/Done.jsx';
import { buildPlan, parseCsv, weekOrder } from './lib/parseCsv.js';
import { addReward, loadRewards, saveRewards } from './lib/garden.js';

const APP_NAME = 'curlyhairedmanbeater';

export default function App() {
  const [status, setStatus] = useState('loading');
  const [plan, setPlan] = useState({});
  const [week, setWeek] = useState('');
  const [screen, setScreen] = useState('home');
  const [selectedDay, setSelectedDay] = useState(null);
  const [rewards, setRewards] = useState(() => loadRewards());
  const [result, setResult] = useState(null);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}beginner_female_gym_plan.csv`)
      .then(response => { if (!response.ok) throw new Error('load'); return response.text(); })
      .then(text => {
        if (cancelled) return;
        const nextPlan = buildPlan(parseCsv(text));
        setPlan(nextPlan); setWeek(weekOrder(nextPlan)[0] || '');
        setStatus(Object.keys(nextPlan).length ? 'ready' : 'error');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { saveRewards(rewards); }, [rewards]);

  const weeks = useMemo(() => weekOrder(plan), [plan]);
  const startWorkout = dayKey => {
    const day = plan[week]?.[dayKey];
    if (!day) return;
    setSelectedDay({ ...day, week }); setScreen('workout');
  };
  const finishWorkout = workoutResult => {
    const nextRewards = addReward(rewards, { week: selectedDay.week, day: selectedDay.key, title: selectedDay.title, seconds: workoutResult.seconds });
    setRewards(nextRewards); setReward(nextRewards[nextRewards.length - 1]); setResult(workoutResult); setScreen('done');
  };

  return <div className="app-shell"><Background /><main className="app-main">
    {status === 'loading' && <div className="state-card"><span className="curl-mark">⌁</span><h1>Opening your training notes…</h1><p>Pulling in the plan.</p></div>}
    {status === 'error' && <div className="state-card"><span className="curl-mark">!</span><h1>That page needs a reset.</h1><p>We couldn’t load the bundled workout plan. Refresh and try again.</p></div>}
    {status === 'ready' && screen === 'home' && <Home appName={APP_NAME} plan={plan} weeks={weeks} week={week} onWeek={setWeek} onStart={startWorkout} rewards={rewards} onClearRewards={() => setRewards([])} />}
    {status === 'ready' && screen === 'workout' && selectedDay && <Workout day={selectedDay} onBack={() => setScreen('home')} onFinish={finishWorkout} />}
    {status === 'ready' && screen === 'done' && result && <Done result={result} reward={reward} onHome={() => setScreen('home')} onAgain={() => setScreen('home')} />}
  </main></div>;
}
