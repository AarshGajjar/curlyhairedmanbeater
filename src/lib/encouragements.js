// Short, steady coaching prompts. The tone stays warm without getting overly personal.
export const SET_DONE = [
  'One set complete. Keep the rhythm.',
  'Nice work. Take the next rep at your pace.',
  'Strong and steady.',
  'That one counts.',
  'Good form energy.',
  'Small wins build the habit.',
  'You showed up. That matters.',
];

export const REST_TIPS = [
  'Sip some water.',
  'Shake out your arms and roll your shoulders.',
  'Breathe in slowly, then let it go.',
  'Relax your jaw and reset your stance.',
  'Check your posture before the next set.',
  'Take the rest you need.',
];

export const EXERCISE_DONE = [
  'Exercise complete. On to the next.',
  'Another one checked off.',
  'Progress, not perfection.',
  'That section is in the books.',
];

export const FINISH_LINES = [
  'You finished. Nice work.',
  'Workout done. That is a solid win.',
  'One day at a time is how habits stick.',
  'Stronger than yesterday.',
];

export const DAY_EMOJI = { 'Day 1': '\u{1F331}', 'Day 2': '\u{1F4AA}', 'Day 3': '\u{1F338}' };
export const TYPE_EMOJI = { 'warm-up': '\u2600\uFE0F', main: '\u2022', finisher: '\u2726' };

export const WEEK_BLURB = {
  'Week 1-2': 'Learn the moves. Go light, go slow, feel it out.',
  'Week 3-4': 'Getting comfy. Add a little weight if it feels good.',
  'Week 5-6': 'You are in a rhythm now. Keep your form tidy.',
};

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}
