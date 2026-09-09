import { motion } from 'motion/react';
import Bubble from '../components/Bubble.jsx';
import ShinyText from '../bits/ShinyText.jsx';
import { DAY_EMOJI, WEEK_BLURB } from '../lib/encouragements.js';
import { weeklyStreak } from '../lib/garden.js';

function dayLabel(dayKey) { return dayKey.replace(/^day\s*/i, 'Day '); }

export default function Home({ appName, plan, weeks, week, onWeek, onStart, rewards, onClearRewards }) {
  const days = plan[week] ? Object.values(plan[week]) : [];
  const streak = weeklyStreak(rewards);
  const totalMinutes = Math.round(rewards.reduce((sum, reward) => sum + (reward.seconds || 0), 0) / 60);
  return <div className="screen">
    <header className="hero"><div className="curl-mark" aria-hidden="true">~</div><div><p className="eyebrow">WORKOUT PLAN</p><h1 className="hero-title"><ShinyText text={appName} speed={3} color="#a5445f" shineColor="#ead8c8" /></h1><p className="hero-sub">Three training days a week - six weeks</p></div></header>
    <Bubble className="week-picker" delay={0.05}><div className="segmented" role="tablist" aria-label="Training phase">{weeks.map(item => <button key={item} role="tab" aria-selected={week === item} className={`seg ${week === item ? 'active' : ''}`} onClick={() => onWeek(item)}>{week === item && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}<span className="seg-label">{item.replace('Week ', 'Wk ')}</span></button>)}</div><p className="week-blurb">{WEEK_BLURB[week] || 'Choose a session to begin.'}</p></Bubble>
    <div className="day-grid">{days.map((day, index) => { const mains = day.exercises.filter(exercise => exercise.type.toLowerCase() === 'main').length; return <Bubble key={day.key} className="day-card" delay={0.1 + index * 0.07}><motion.button className="day-card-btn" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => onStart(day.key)}><span className="day-emoji">{DAY_EMOJI[day.key] || '.'}</span><span className="day-text"><span className="day-kicker">{dayLabel(day.key)}</span><span className="day-title">{day.title}</span><span className="day-meta">{day.exercises.length} moves - {mains} main lifts - about {Math.round(day.exercises.length * 4.5)} min</span></span><span className="day-arrow" aria-hidden="true">-&gt;</span></motion.button></Bubble>; })}</div>
    <Bubble className="rewards" delay={0.35}><div className="rewards-head"><div><p className="eyebrow">COMPLETED SESSIONS</p><h2>Workout rewards</h2></div>{rewards.length > 0 && <button className="link-btn" onClick={onClearRewards}>reset</button>}</div>{rewards.length === 0 ? <p className="rewards-empty">Complete a workout to add a coffee softy to your list.</p> : <><div className="reward-stats"><div><strong>{rewards.length}</strong><span>workout{rewards.length === 1 ? '' : 's'}</span></div><div><strong>{streak}</strong><span>week streak</span></div><div><strong>{totalMinutes}</strong><span>minutes</span></div></div><div className="reward-list">{rewards.map((reward, index) => <motion.div key={reward.id} className="reward-item" title={`${new Date(reward.at).toLocaleDateString()} - ${reward.title}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.04 }}><span className="reward-icon" aria-hidden="true">{'\u{1F366}'}</span><span><strong>{reward.reward}</strong><small>{new Date(reward.at).toLocaleDateString()} - {reward.title}</small></span></motion.div>)}</div></>}</Bubble>
    <p className="footnote">Keep your form controlled and take the rest you need.</p>
  </div>;
}
