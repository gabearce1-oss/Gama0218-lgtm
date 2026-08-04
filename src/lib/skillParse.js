// Deterministic markdown -> Skill field parser. No AI, no network.
const field = (text, label) => {
  const m = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`));
  return m ? m[1].replace(/`/g, '').trim() : '';
};

export function parseSkillMarkdown(text, fileName = '') {
  const titleLine = text.match(/^#\s*SKILL:\s*(.+)$/m) || text.match(/^#\s*(.+)$/m);
  const rawTitle = titleLine ? titleLine[1].trim() : (fileName || 'Untitled skill');
  const vm = rawTitle.match(/\s+v?(\d+[.\d]*)\s*$/);
  const subtitle = (text.match(/^##\s+(?!§)(.+)$/m) || [, ''])[1].trim();
  const sections = [...text.matchAll(/^##\s*(§\s*\d+[^\n]*)$/gm)].map((m) =>
    m[1].replace(/\s+/g, ' ').trim()
  );
  const compiled = text.match(/Compiled\s+([A-Za-z]+\s+\d+\s+\d{4})/);

  return {
    name: vm ? rawTitle.slice(0, vm.index).trim() : rawTitle,
    version: vm ? vm[1] : '',
    subtitle,
    scope: field(text, 'Scope'),
    calibration: field(text, 'Calibration'),
    dependency: field(text, 'Dependency'),
    sections,
    compiled_date: compiled ? compiled[1] : '',
    body_markdown: text,
    source_file: fileName,
    status: 'draft',
  };
}

// A skill fires when any of its triggers appears in the scene tags you type.
export function matchingSkills(skills, sceneText) {
  const hay = sceneText.toLowerCase();
  if (!hay.trim()) return [];
  return skills.filter((s) =>
    (s.triggers || []).some((t) => t && hay.includes(t.toLowerCase()))
  );
}