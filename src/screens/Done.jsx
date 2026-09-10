import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Done({ result, reward, onHome, onAgain }) {
  const minutes = Math.floor(result.seconds / 60);
  const seconds = result.seconds % 60;
  useEffect(() => { confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 }, colors: ['#7b2639', '#d9cbbb', '#1d1b19'], scalar: 0.9, ticks: 150 }); }, []);
  return <div className="screen done-screen"><p className="section-label">SESSION ARCHIVE / COMPLETE</p><div className="done-mark" aria-hidden="true">01</div><h1>Good work.<br /><em>Keep going.</em></h1><p className="done-deck">The session is complete. Your consistency is the training.</p><div className="done-stats"><div><strong>{minutes}:{String(seconds).padStart(2, '0')}</strong><span>TIME MOVING</span></div><div><strong>{result.setsDone}</strong><span>SETS COMPLETE</span></div><div><strong>{result.exercises}</strong><span>EXERCISES</span></div></div><div className="reward-note"><span className="section-label">YOUR REWARD</span><strong><span className="reward-icecream" aria-hidden="true">🍦</span> {reward?.reward || 'filter coffee softy'}</strong><p>Drink some water and take a short stretch break.</p></div><div className="done-actions"><button className="primary-button" onClick={onHome}>BACK TO PLAN <span>↗</span></button><button className="secondary-button" onClick={onAgain}>PICK ANOTHER DAY</button></div></div>;
}
