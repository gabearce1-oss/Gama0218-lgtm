const weakMetricThreshold = 90;

export function chapterSignals(chapter) {
  const signals = [];
  if (chapter.status === 'blocker') signals.push('Blocker');
  if (!chapter.omega) signals.push('Unscored');
  else if (chapter.omega < 105) signals.push('Ω below 105');
  ['cls', 'bis', 'sii', 'mrf'].forEach((key) => {
    if (chapter[key] != null && chapter[key] < weakMetricThreshold) signals.push(`${key.toUpperCase()} below ${weakMetricThreshold}`);
  });
  return signals;
}

export function reportMetrics(chapters) {
  const scored = chapters.filter((chapter) => chapter.omega > 0);
  const weakChapters = chapters.filter((chapter) => chapterSignals(chapter).length);
  return {
    total: chapters.length,
    scored: scored.length,
    unscored: chapters.length - scored.length,
    weak: weakChapters.length,
    meanOmega: scored.length ? scored.reduce((sum, chapter) => sum + chapter.omega, 0) / scored.length : 0,
  };
}

export function sortedChapters(chapters) {
  return [...chapters].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));
}