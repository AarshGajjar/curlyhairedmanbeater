import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import Bubble from '../components/Bubble.jsx';
import CuteButton from '../components/CuteButton.jsx';
import CountUp from '../bits/CountUp.jsx';
import ShinyText from '../bits/ShinyText.jsx';

export default function Done({ result, reward, onHome, onAgain }) {
  const minutes = Math.floor(result.seconds / 60);
  const seconds = result.seconds % 60;
  useEffect(() => { confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 }, colors: ['#a5445f', '#d6e5d9', '#ead8c8'], scalar: 0.9, ticks: 150 }); }, []);
  const rewardIcon = '\u{1F366}';
  return <div className="screen done"><motion.div className="done-reward-icon" initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }} transition={{ duration: 0.6, ease: 'easeOut' }}>{rewardIcon}</motion.div><h1 className="done-title"><ShinyText text="Workout complete" speed={2.5} color="#a5445f" shineColor="#ead8c8" /></h1><Bubble className="done-stats" delay={0.2}><div className="stat"><span className="stat-num"><CountUp to={minutes} duration={1.2} />m <CountUp to={seconds} duration={1.4} />s</span><span className="stat-label">time moving</span></div><div className="stat"><span className="stat-num"><CountUp to={result.setsDone} duration={1.4} /></span><span className="stat-label">sets complete</span></div><div className="stat"><span className="stat-num"><CountUp to={result.exercises} duration={1.6} /></span><span className="stat-label">exercises</span></div></Bubble><Bubble className="done-note" delay={0.35}><p>Your reward: <strong>{reward?.reward}</strong>. Drink some water and take a short stretch break.</p></Bubble><div className="done-actions"><CuteButton onClick={onHome}>Back to plan</CuteButton><CuteButton variant="ghost" onClick={onAgain}>Pick another day</CuteButton></div></div>;
}
