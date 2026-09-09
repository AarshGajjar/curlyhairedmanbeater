// Tiny CSV parser (handles quoted fields) + workout-plan shaping.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => v.trim() !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(v => v.trim() !== '')) rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** Parses "30s", "15-20s hold", "5 min" → seconds (uses the upper bound of ranges). 0 if rep-based. */
export function parseSeconds(details) {
  const d = details.toLowerCase();
  const min = d.match(/(\d+)\s*min/);
  if (min) return parseInt(min[1], 10) * 60;
  const sec = d.match(/(?:(\d+)\s*-\s*)?(\d+)\s*s\b/);
  if (sec) return parseInt(sec[2], 10);
  return 0;
}

export function hasSides(details) {
  return /per side|each side|each direction|per leg|per arm/i.test(details);
}

/**
 * Shape: { [week]: { [dayKey]: { key, title, exercises: [{type,name,details,sets,seconds,sides}] } } }
 */
export function buildPlan(records) {
  const plan = {};
  for (const r of records) {
    const week = r['week'];
    const dayKey = r['day'];
    if (!week || !dayKey) continue;
    plan[week] ??= {};
    plan[week][dayKey] ??= { key: dayKey, title: r['day name'] || dayKey, exercises: [] };
    const details = r['reps/time'] || '';
    plan[week][dayKey].exercises.push({
      type: r['exercise type'] || 'Main',
      name: r['exercise name'] || 'Exercise',
      details,
      sets: Math.max(1, parseInt(r['sets'], 10) || 1),
      seconds: parseSeconds(details),
      sides: hasSides(details),
    });
  }
  return plan;
}

export function weekOrder(plan) {
  return Object.keys(plan).sort((a, b) => {
    const na = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
    const nb = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
    return na - nb;
  });
}
