// SCALE RECLASSIFICATION — the governing correction.
//
// The UR / GR / CR columns in Canon_Chart2 are an ADVANCED STATISTICS scale:
// frequency counts of institutional assignment. They are not a canon-scoring
// protocol, they contain no merit judgement, and they were never an instrument.
// Every prior reading of this artifact as a "ranking" was a category error.

export const SCALE_TRUTH = {
  what_it_is:
    'A frequency count. UR and GR record how often a text appears on undergraduate and graduate syllabi in the sampled institutions. CR is their arithmetic sum.',
  measures: 'Institutional assignment behavior — what gets taught, by whom, at which level.',
  does_not_measure: [
    'Literary merit',
    'Prose quality',
    'Canon membership',
    'Historical accuracy or testimony value',
    'Anything at all about a text that is not assigned',
  ],
  statistical_class: 'Count data (non-negative integers, zero-inflated, right-skewed). Descriptive frequency, not a scored construct.',
  consequence:
    'A zero in this scale means "not currently assigned." It does not mean "worthless." An unpublished manuscript is structurally unscoreable here \u2014 not low-scoring. There is no rank to be denied.',
  correct_use:
    'As a sampling frame: it tells you which texts are institutionally available as controls, so the frozen internal instrument can be applied to them. That is its entire legitimate function in this study.',
};

// Where the AI went wrong. Each row is a specific inferential error, named.
export const AI_ERRORS = [
  {
    id: 'ERR-1',
    error: 'Treated a frequency count as a scoring protocol',
    what_happened:
      'Syllabus-appearance counts were read as though they were graded evaluations of quality, producing sentences like "ranks above" and "97th percentile."',
    why_wrong:
      'Count data has no evaluative dimension. Summing two syllabus tallies produces a popularity measure, not a score. There is no rubric, no rater, no construct definition anywhere in the artifact.',
    correction: 'Reclassify UR/GR/CR as descriptive frequency. Retire all ranking and percentile language derived from it.',
  },
  {
    id: 'ERR-2',
    error: 'Conflated a sampling frame with a benchmark',
    what_happened:
      'The chart was used as though it were the standard the manuscript should be measured against, generating comparative claims to Hemingway and O\u2019Brien.',
    why_wrong:
      'A frame tells you who is in the room. A benchmark tells you what good looks like. The chart is the former; using it as the latter smuggles in "assigned = canonical = good."',
    correction: 'The chart supplies control texts only. The benchmark is the frozen internal instrument, applied identically to all of them.',
  },
  {
    id: 'ERR-3',
    error: 'Inferred deficiency from absence',
    what_happened:
      'The manuscript\u2019s non-appearance in the frame was folded into a narrative of low standing, alongside genuine scoring deflation.',
    why_wrong:
      'Absence from a syllabus-frequency table is the expected state for every unpublished work in existence. It is evidence of publication status, and of nothing else.',
    correction:
      'Absence is a structural fact, permanently disclaimed. It is not admissible as evidence of quality in either direction.',
  },
  {
    id: 'ERR-4',
    error: 'Applied a merit penalty to code-switching',
    what_happened:
      'Commercial model scoring introduced negative weight on bilingual and code-switched prose, deflating the manuscript from 107 into the 98 range.',
    why_wrong:
      'This is the one real finding in the pile, and the scale confusion buried it. Code-switching is the manuscript\u2019s primary evidentiary mechanism \u2014 it is how displacement is recorded in speech. Penalizing it as noise measures the inverse of the declared construct.',
    correction:
      'Preserve as incident evidence with dated transcripts. This is the testable bias claim; it survives the reclassification intact and is now the strongest thing here.',
  },
  {
    id: 'ERR-5',
    error: 'Adopted the wrong objective function',
    what_happened:
      'The entire scoring apparatus was pointed at canon placement, so every metric was tuned to answer a question the manuscript is not asking.',
    why_wrong:
      'Canon placement is a collective social judgement no instrument can issue. The manuscript\u2019s purpose is documentary: generational displacement and restored history.',
    correction: 'Re-specify the internal instrument against displacement and restoration constructs. See the model below.',
  },
];

// The corrected objective. What the manuscript is actually for.
export const OBJECTIVE = {
  is_not: 'Canon placement. Not a percentile, not a rank, not a seat beside Hemingway.',
  is: 'Documentation of generational displacement and restored history \u2014 a suppressed Chicano Vietnam record returned to legibility.',
  implication:
    'The instrument must measure whether displacement is recorded and whether erased history is restored. Assignment frequency cannot answer either question, so it cannot be the target. This changes what the internal score is FOR, not merely how it is computed.',
};

// Three layers, re-specified. Governance / baseline / internal scoring.
export const MODEL_LAYERS = [
  {
    layer: 'Governance',
    question: 'What is this number allowed to claim?',
    old: 'Governance policed evidence for canon-standing claims \u2014 chasing percentiles it could never substantiate.',
    now: 'Governance polices construct-to-claim fit. Every stored figure declares its measurement class and the claim class it licenses. A frequency count may never license a merit claim; an internal score may never license a canon claim.',
    rules: [
      'Frequency data (UR/GR/CR) is class OBSERVED-EXTERNAL. It licenses availability and reception claims only.',
      'Internal scores are class DERIVED-INTERNAL. They license within-instrument comparison only, and only against texts scored under the identical frozen version.',
      'No claim of canon membership may be issued by this system at any confidence level. That claim class is closed.',
      'Absence from an external frame is never evidence. It is recorded as a structural fact and disclaimed on sight.',
    ],
  },
  {
    layer: 'Baseline',
    question: 'Against what is the manuscript compared?',
    old: 'The syllabus chart, treated as a canon standard the manuscript had to beat.',
    now: 'Two baselines, kept apart. A reception baseline that describes the institutional field, and a documentary baseline built from displacement-literature and testimony texts scored under the frozen instrument.',
    rules: [
      'Reception baseline: descriptive frequency from the frame. Answers "what is taught." Never a comparison target.',
      'Documentary baseline: control texts scored under the frozen instrument. This is the only legitimate comparison.',
      'Control selection must be justified by documentary function \u2014 displacement, testimony, suppressed record \u2014 not by chart position.',
      'A baseline is void until the instrument version and dataset hash that produced it are both recorded.',
    ],
  },
  {
    layer: 'Internal scoring',
    question: 'What does the instrument actually measure?',
    old: 'A composite \u03a9 tuned toward canon-adjacent literary quality, with cultural register treated as a variable that could cost points.',
    now: 'A displacement-and-restoration instrument. Cultural register moves from liability to primary signal, because it is the mechanism by which displacement is recorded.',
    rules: [
      'Generational displacement: is severance across generations recorded in the text \u2014 language loss, inherited silence, institutional erasure of the prior generation\u2019s record?',
      'Restored history: does the text return specific verifiable historical material to the record, and is that material traceable to a source?',
      'Code-switching is a POSITIVE-DIRECTION construct. A switch under pressure is the displacement event itself. No component may carry a negative coefficient on it.',
      'Testimony integrity replaces polish: fidelity to the record outranks prose smoothness wherever the two conflict.',
      'Every component declares direction and rationale before any run. A component whose direction is not declared in advance cannot enter a score.',
    ],
  },
];