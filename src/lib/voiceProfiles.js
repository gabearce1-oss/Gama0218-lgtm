export const CHARACTERS = [
  {
    id: 'tijuana',
    call_sign: 'Tijuana',
    vector: 'Vector 4',
    origin: 'Tijuana / Border',
    role: 'Border-smart operator',
    archetype: 'Tactical Bilingual',
    core_voice: 'Border wit, quick blade, bilingual by instinct. Moves between English and Spanish without apology. The voice is not "broken"; it is tactical bilingualism.',
    rhythm: 'Elastic, teasing, confident. More Spanish when relaxed or angry; more English when making sure the whole squad understands.',
    markers: ['güey/wey', 'órale', 'no manches', 'neta', 'qué onda', 'vámonos', 'tranquilo', 'a la verga'],
    triggers: ['sarcasm', 'urgency', 'insult', 'precision', 'border memory', 'tactical command'],
    pressure_shift: 'In danger, Spanish interjections spike, but instructions stay understandable.',
    no_go: 'Do not translate every Spanish phrase immediately. Context carries meaning. In mission-critical dialogue, clarity wins.',
    rule: 'Border wit, quick blade, bilingual by instinct.',
    samples: [
      'No manches. That lock is older than your whole plan.',
      'Órale, I got the north exit. You watch the alley.',
      'This isn\'t luck, güey. This is Tijuana math.',
      'Vámonos. Whatever\'s behind that wall just woke up.',
    ],
  },
  {
    id: 'herrera',
    call_sign: 'Herrera',
    vector: 'Vector 2',
    origin: 'Bronx, NYC',
    role: 'Field commander',
    archetype: 'Controlled Bilingual',
    core_voice: 'Bronx control — measured, authoritative, switches to Spanish to narrow audience or sharpen a point.',
    rhythm: 'Compressed under pressure. Commands land short. Spanish surfaces for privacy, emphasis, or grief.',
    markers: ['mira', 'ya', 'dale', 'no te muevas', 'cuídate'],
    triggers: ['command', 'privacy', 'grief', 'authority', 'solidarity'],
    pressure_shift: 'Tightens up. Fewer words. Spanish imperatives replace full sentences when time is thin.',
    no_go: 'Never chaotic. Even anger is structured.',
    rule: 'Bronx control under border improvisation.',
    samples: [
      'Mira, we need clean timing.',
      'I said clean, not pretty.',
      'My mother used to say the dead don\'t leave. They just get quiet.',
    ],
  },
  {
    id: 'oneil',
    call_sign: 'O\'Neil',
    vector: 'Vector 1',
    origin: 'Kentucky / Rural',
    role: 'Point / Hunter',
    archetype: 'Rural Calm',
    core_voice: 'Rural calm — sparse, instinctive, reads spaces before people. Says less, means more.',
    rhythm: 'Short declaratives. Silence between lines is part of the voice. Poetic without trying.',
    markers: ['reckon', 'aight', 'quiet don\'t mean gone'],
    triggers: ['instinct', 'suspicion', 'grief', 'warning'],
    pressure_shift: 'Goes almost monosyllabic in danger. Each word is a decision.',
    no_go: 'Never wordy. Never panicked.',
    rule: 'Rural calm — reads the room before the room knows it\'s been read.',
    samples: [
      'That hallway\'s too quiet.',
      'Trees don\'t lie.',
      'Where I\'m from, quiet don\'t mean gone.',
    ],
  },
  {
    id: 'hoshnsin',
    call_sign: 'Hoshnsin',
    vector: 'Vector 3',
    origin: 'Philadelphia',
    role: 'Tactical / Intel',
    archetype: 'City Suspicion',
    core_voice: 'City suspicion — fast, sardonic, deflects with humor but catches everything. Philly sharp.',
    rhythm: 'Rapid, clipped, conversational. Gets louder when nervous, quieter when serious.',
    markers: ['nah', 'drawlin\'', 'cool', 'bet'],
    triggers: ['sarcasm', 'deflection', 'tension', 'solidarity'],
    pressure_shift: 'Humor thins out. When Hoshnsin goes quiet, the situation is real.',
    no_go: 'No hollow jokes in grief. The humor has a floor.',
    rule: 'Philly sharp — jokes as armor, silence as truth.',
    samples: [
      'Everything\'s too quiet to you. Trees too loud too?',
      'That is exactly the kind of thing a haunted man says.',
      'In Philly we just tell \'em move their car.',
    ],
  },
];

export const CODE_SWITCH_TRIGGERS = [
  { trigger: 'Command', switch_type: 'Short Spanish imperative', example: 'No te muevas.' },
  { trigger: 'Warning', switch_type: 'Spanish marker + English command', example: 'Mira, back up.' },
  { trigger: 'Humor', switch_type: 'Spanish punchline / interjection', example: 'No manches, that\'s your plan?' },
  { trigger: 'Family memory', switch_type: 'Quoted Spanish', example: 'Mi mamá said, "cuídate."' },
  { trigger: 'Solidarity', switch_type: 'Shared in-group phrase', example: 'Dale, we got this.' },
  { trigger: 'Anger', switch_type: 'Spanish intensifier', example: 'Ya, enough.' },
  { trigger: 'Lexical precision', switch_type: 'Word feels better in Spanish', example: 'That\'s not fear. That\'s coraje.' },
  { trigger: 'Privacy', switch_type: 'Spanish to narrow audience', example: 'No le digas todavía.' },
];

export const SQUAD_DYNAMICS = [
  {
    pair: 'O\'Neil + Hoshnsin',
    dynamic: 'Rural calm vs. city suspicion',
    lines: [
      { speaker: 'O\'Neil', text: 'That hallway\'s too quiet.' },
      { speaker: 'Hoshnsin', text: 'Everything\'s too quiet to you. Trees too loud too?' },
      { speaker: 'O\'Neil', text: 'Trees don\'t lie.' },
      { speaker: 'Hoshnsin', text: 'That is exactly the kind of thing a haunted man says.' },
    ],
  },
  {
    pair: 'Herrera + Tijuana',
    dynamic: 'Bronx control vs. border improvisation',
    lines: [
      { speaker: 'Herrera', text: 'Mira, we need clean timing.' },
      { speaker: 'Tijuana', text: 'Clean timing? In this building? Qué cute.' },
      { speaker: 'Herrera', text: 'I said clean, not pretty.' },
      { speaker: 'Tijuana', text: 'Órale. Ugly I can do.' },
    ],
  },
  {
    pair: 'O\'Neil + Herrera',
    dynamic: 'Two commanders, different weather systems',
    lines: [
      { speaker: 'O\'Neil', text: 'Door\'s wrong.' },
      { speaker: 'Herrera', text: 'Wrong how?' },
      { speaker: 'O\'Neil', text: 'Too easy.' },
      { speaker: 'Herrera', text: 'Yeah. I hate when you\'re poetic.' },
    ],
  },
  {
    pair: 'Hoshnsin + Tijuana',
    dynamic: 'Joke duel, mutual respect under trash talk',
    lines: [
      { speaker: 'Hoshnsin', text: 'That your professional opinion?' },
      { speaker: 'Tijuana', text: 'No, güey. That one was free.' },
      { speaker: 'Hoshnsin', text: 'Cool. I want a refund.' },
      { speaker: 'Tijuana', text: 'Survive first.' },
    ],
  },
];

export const SCENE_PROTOCOLS = [
  {
    mode: 'Mission',
    desc: 'Everyone compresses.',
    accent: 'amber',
    lines: [
      { speaker: 'O\'Neil', text: 'Left clear.' },
      { speaker: 'Hoshnsin', text: 'Movement upstairs.' },
      { speaker: 'Herrera', text: 'Hold. Nobody crosses.' },
      { speaker: 'Tijuana', text: 'Back exit open. Vámonos.' },
    ],
  },
  {
    mode: 'Argument',
    desc: 'Regional voice rises.',
    accent: 'red',
    lines: [
      { speaker: 'Hoshnsin', text: 'Nah, you\'re drawlin\'. That route gets us boxed in.' },
      { speaker: 'O\'Neil', text: 'And your route gets us shot in alphabetical order.' },
      { speaker: 'Herrera', text: 'Both of you shut up and let the building speak.' },
      { speaker: 'Tijuana', text: 'The building says you\'re all loud.' },
    ],
  },
  {
    mode: 'Grief / Memory',
    desc: 'The deepest voice comes out.',
    accent: 'violet',
    lines: [
      { speaker: 'Herrera', text: 'My mother used to say the dead don\'t leave. They just get quiet.' },
      { speaker: 'O\'Neil', text: 'Where I\'m from, quiet don\'t mean gone.' },
      { speaker: 'Tijuana', text: 'En mi casa, we fed ghosts like family.' },
      { speaker: 'Hoshnsin', text: 'In Philly we just tell \'em move their car.' },
    ],
  },
];

export const VOICE_TEST = [
  'You can identify the speaker without a dialogue tag.',
  'The dialect marker is not doing all the work.',
  'The line reveals attitude, not just geography.',
  'Any Spanish / code-switch has a reason.',
  'It sounds like a person, not a Wikipedia page wearing boots.',
];