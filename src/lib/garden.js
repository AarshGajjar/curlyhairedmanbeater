// Completed workouts are stored locally on the device as food-and-drink rewards.
const KEY = 'curlyhairedmanbeater-rewards-v1';
export const REWARDS = { softy: 'filter coffee softy' };

export function loadRewards() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(data) ? data.map(item => ({ ...item, reward: REWARDS.softy })) : [];
  } catch { return []; }
}

export function saveRewards(rewards) {
  try { localStorage.setItem(KEY, JSON.stringify(rewards)); } catch { /* session-only fallback */ }
}

export function addReward(rewards, { week, day, title, seconds }) {
  const reward = { id: Date.now(), at: new Date().toISOString(), week, day, title, seconds, reward: REWARDS.softy };
  return [...rewards, reward].slice(-60);
}

/** Consecutive calendar-week streak. */
export function weeklyStreak(rewards) {
  if (!rewards.length) return 0;
  const weekId = value => {
    const date = new Date(value);
    const day = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };
  const weeks = new Set(rewards.map(reward => weekId(reward.at)));
  const ONE_WEEK = 7 * 24 * 3600 * 1000;
  let cursor = weekId(new Date());
  if (!weeks.has(cursor)) cursor -= ONE_WEEK;
  let streak = 0;
  while (weeks.has(cursor)) { streak++; cursor -= ONE_WEEK; }
  return streak;
}
