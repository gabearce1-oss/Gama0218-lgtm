// Deterministic document locators. Pure pattern matching — no model, no inference, no scoring.
// Every hit is reproducible by hand: run the same pattern over the same text and you get the same offsets.

export const LOCATORS = [
  {
    id: 'LOC-CHAP',
    name: 'Chapter heading',
    class: 'structure',
    pattern: /^\s*(chapter|cap[íi]tulo)\s+([0-9]{1,3}|[ivxlcdm]{1,7})\b.*$/gim,
    note: 'Locates chapter boundaries and exposes duplicate or out-of-order numbering.',
  },
  {
    id: 'LOC-EPI',
    name: 'Front/back matter heading',
    class: 'structure',
    pattern: /^\s*(prologue|epilogue|preface|foreword|afterword|appendix|glossary)\b.*$/gim,
    note: 'Non-chapter sections that must be excluded from chapter counts.',
  },
  {
    id: 'LOC-SPAN',
    name: 'Spanish token',
    class: 'language',
    pattern: /\b(mira|órale|orale|güey|guey|neta|vámonos|vamonos|no manches|carnal|carnalismo|familia|barrio|hermano|mijo|mija|abuela|pendejo|cabrón|cabron|ese|jefita|vato|chale)\b/gi,
    note: 'Counts Spanish/caló surface forms for code-switch tallies. Counting only — purpose is judged by a human.',
  },
  {
    id: 'LOC-CALO',
    name: 'Caló / border marker',
    class: 'language',
    pattern: /\b(firme|simón|simon|ruca|jaina|placa|movida|clika|clica|trucha|ranfla)\b/gi,
    note: 'Regional register markers, logged separately from standard Spanish.',
  },
  {
    id: 'LOC-SENS',
    name: 'Sensory term',
    class: 'sensory',
    pattern: /\b(smell(?:ed|s|ing)?|stench|reek(?:ed|s)?|taste(?:d|s)?|bitter|metallic|humid|cordite|diesel|kerosene|sweat|mud|rain|heat|cold|ringing|silence|echo(?:ed|es)?)\b/gi,
    note: 'Raw sensory vocabulary counts for the sensory presence tally.',
  },
  {
    id: 'LOC-DATE',
    name: 'Date or year reference',
    class: 'timeline',
    pattern: /\b((?:19|20)\d{2}|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:,\s*\d{4})?)\b/gi,
    note: 'Every explicit date, for timeline reconciliation against the evidence record.',
  },
  {
    id: 'LOC-UNIT',
    name: 'Military unit or rank',
    class: 'timeline',
    pattern: /\b(\d{1,3}(?:st|nd|rd|th)\s+(?:infantry|cavalry|airborne|division|battalion|brigade|regiment)|sgt\.?|sergeant|corporal|lieutenant|captain|platoon|squad)\b/gi,
    note: 'Unit and rank claims requiring a source before they stand.',
  },
  {
    id: 'LOC-HW',
    name: 'Weapon, aircraft or vehicle',
    class: 'hardware',
    pattern: /\b(m-?16|m-?14|m-?60|ak-?47|claymore|c-?4|huey|uh-?1|ch-?47|chinook|f-?4|phantom|b-?52|jeep|apc|m-?113)\b/gi,
    note: 'Hardware references — each must match the period and the theater.',
  },
  {
    id: 'LOC-PLACE',
    name: 'Place name',
    class: 'timeline',
    pattern: /\b(saigon|hanoi|da\s?nang|khe\s?sanh|hu[eé]|mekong|pleiku|an\s?khe|cam\s?ranh|tijuana|bronx|philadelphia|kentucky)\b/gi,
    note: 'Geographic claims for map and timeline verification.',
  },
  {
    id: 'LOC-HEDGE',
    name: 'Unverified hedge language',
    class: 'integrity',
    pattern: /\b(reportedly|allegedly|it is believed|some say|approximately|roughly|about\s+\d+|estimated|probably|maybe)\b/gi,
    note: 'Soft claims that cannot enter the record without a source.',
  },
  {
    id: 'LOC-TODO',
    name: 'Draft marker left in text',
    class: 'integrity',
    pattern: /(\bTODO\b|\bTK\b|\bXX+\b|\[\s*(?:insert|check|verify|fix|cite)[^\]]*\]|\?\?\?)/g,
    note: 'Author notes and placeholders that must not survive into a release package.',
  },
  {
    id: 'LOC-PLACEHOLD',
    name: 'Placeholder number',
    class: 'integrity',
    pattern: /\b(0\.00|00\.0|999|123456|N\/A|TBD)\b/g,
    note: 'Dummy values that indicate a field was never actually measured.',
  },
  {
    id: 'LOC-OCR',
    name: 'OCR / encoding artifact',
    class: 'artifact',
    pattern: /(\uFFFD|â€[™œ\u009d“”]|Ã[©¡­¨]|\bl1\b|\brn\b(?=\s)|[A-Za-z]\d[A-Za-z]{2,})/g,
    note: 'Mojibake and character-recognition damage, so bad text is caught before it is measured.',
  },
  {
    id: 'LOC-DUPSPACE',
    name: 'Formatting damage',
    class: 'artifact',
    pattern: /( {3,}|\t{2,}|\n{4,}|-{4,})/g,
    note: 'Runs of whitespace or rules that break paragraph and word counts.',
  },
];

const CONTEXT_RADIUS = 70;

// Runs every locator over one document. Returns a flat array of hit records.
// maxPerLocator caps hits per pattern per file so one noisy pattern cannot flood the ledger.
export function scanText(text, { maxPerLocator = 25 } = {}) {
  const hits = [];
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') lineStarts.push(i + 1);
  }
  const lineFor = (offset) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (lineStarts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };

  for (const locator of LOCATORS) {
    const re = new RegExp(locator.pattern.source, locator.pattern.flags);
    let match;
    let count = 0;
    let total = 0;
    while ((match = re.exec(text)) !== null) {
      total++;
      if (match[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      if (count < maxPerLocator) {
        const start = Math.max(0, match.index - CONTEXT_RADIUS);
        const end = Math.min(text.length, match.index + match[0].length + CONTEXT_RADIUS);
        hits.push({
          locator_id: locator.id,
          locator_name: locator.name,
          locator_class: locator.class,
          match_text: match[0].trim().slice(0, 200),
          context: text.slice(start, end).replace(/\s+/g, ' ').trim(),
          char_offset: match.index,
          line_number: lineFor(match.index),
        });
        count++;
      }
    }
    if (total > count && hits.length) {
      // record the true total on the first hit of this locator so counts are not understated
      const first = hits.find((h) => h.locator_id === locator.id);
      if (first) first.occurrences = total;
    }
  }
  return hits;
}

export function wordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}