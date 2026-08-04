// Top 10 war canon reference works. Only verifiable bibliographic facts are stored here
// (title, author, year, canon status). No score is attributed to these books — each entry
// names the craft standard the work is canonically recognized for, and the manuscript
// metric this platform already measures against that standard.
export const WAR_CANON = [
  { title: 'The Things They Carried', author: "Tim O'Brien", year: 1990, canon: 'Pulitzer finalist, 1991', standard: 'Moral weight of carried memory', metric: 'moral_weight', target: 8.5 },
  { title: 'All Quiet on the Western Front', author: 'Erich Maria Remarque', year: 1929, canon: 'Global canon; foundational anti-war novel', standard: 'Body memory and physical attrition', metric: 'body_memory', target: 8.5 },
  { title: 'Matterhorn', author: 'Karl Marlantes', year: 2010, canon: 'NYT bestseller; Vietnam infantry canon', standard: 'Agency under fire', metric: 'agency_under_fire', target: 8.5 },
  { title: 'The Naked and the Dead', author: 'Norman Mailer', year: 1948, canon: 'National Book Award author; WWII canon', standard: 'Squad dialogue realism', metric: 'dialogue', target: 8.5 },
  { title: 'A Farewell to Arms', author: 'Ernest Hemingway', year: 1929, canon: 'Nobel laureate author; WWI canon', standard: 'Emotional resonance through restraint', metric: 'emotional_resonance', target: 8.5 },
  { title: 'Dispatches', author: 'Michael Herr', year: 1977, canon: 'National Book Critics Circle finalist', standard: 'Cinematic immediacy', metric: 'cinematic_potential', target: 8.5 },
  { title: 'Catch-22', author: 'Joseph Heller', year: 1961, canon: 'National Book Award finalist, 1962', standard: 'Structural pacing across recurring beats', metric: 'beat_pacing', target: 8.5 },
  { title: 'Going After Cacciato', author: "Tim O'Brien", year: 1978, canon: 'National Book Award, 1979', standard: 'Character agency and pursuit arc', metric: 'character_agency', target: 8.5 },
  { title: 'Paco’s Story', author: 'Larry Heinemann', year: 1986, canon: 'National Book Award, 1987', standard: 'Grief carried past the war', metric: 'grief_index', target: 8.5 },
  { title: 'The Yellow Birds', author: 'Kevin Powers', year: 2012, canon: 'National Book Award finalist, 2012', standard: 'Reader retention through sustained dread', metric: 'reader_retention', target: 8.5 },
];

export function canonProgress(chapters) {
  const vaultII = chapters.filter((c) => c.chapter_number <= 44);
  return WAR_CANON.map((entry) => {
    const measured = vaultII.filter((c) => typeof c[entry.metric] === 'number' && c[entry.metric] > 0);
    const mean = measured.length ? measured.reduce((s, c) => s + c[entry.metric], 0) / measured.length : null;
    // Some dimensions are stored on a 0–100 scale rather than 0–10; scale the threshold to match.
    const target = mean !== null && mean > 10 ? entry.target * 10 : entry.target;
    return {
      ...entry,
      target,
      mean,
      coverage: measured.length,
      total: vaultII.length,
      pct: mean === null ? null : Math.min(100, (mean / target) * 100),
    };
  });
}